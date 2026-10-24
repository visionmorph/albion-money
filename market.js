// Market data: Albion Online Data Project requests and price aggregation.
// Market data server: Americas.
const SERVER = 'west';
const BLACK_MARKET = 'Black Market';
// Royal Cities: excludes Caerleon and Brecilien.
const ROYAL_CITIES = ['Bridgewatch', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford'];
// Buy/sell cells with no current order fall back to the average sale price from this many recent days.
const ESTIMATE_DAYS = 14;
// Resource return rate (%) by focus, then bonus day (0/10/20), then [normal city, bonus city].
const RETURN_RATES = {
  no: { 0: [15.3, 24.8], 10: [21.9, 30.1], 20: [27.5, 34.6] },
  yes: { 0: [43.5, 47.9], 10: [46.5, 50.5], 20: [49.2, 52.8] }
};

// Merge records for one item across the selected cities/qualities: each side is the average of the
// prices that exist, dated by the newest observation, with a count of how many prices went in.
// Each city's primary theme colour, shown as a dot next to prices that came from that city.
const CITY_COLORS = {
  'Fort Sterling': '#dbe9f4',
  Martlock: '#4f86d9',
  Lymhurst: '#5fb35a',
  Bridgewatch: '#e3a33b',
  Thetford: '#7e4fb0',
  Caerleon: '#3d3d3d',
  Brecilien: '#3fb5a8'
};

function averageRecords(records) {
  const merged = new Map();
  for (const record of records) {
    const entry = merged.get(record.item_id) || merged.set(record.item_id, { item_id: record.item_id, buy: [], sell: [] }).get(record.item_id);
    if (record.buy_price_max > 0) entry.buy.push([record.buy_price_max, record.buy_price_max_date, record.city]);
    if (record.sell_price_min > 0) entry.sell.push([record.sell_price_min, record.sell_price_min_date, record.city]);
  }
  const side = prices => prices.length ? { price: Math.round(prices.reduce((sum, [price]) => sum + price, 0) / prices.length), date: prices.map(([, date]) => date).sort().at(-1), count: prices.length, cities: [...new Set(prices.map(([, , city]) => city))] } : { price: 0, date: null, count: 0, cities: [] };
  return new Map([...merged.values()].map(({ item_id, buy, sell }) => {
    const b = side(buy), s = side(sell);
    return [item_id, { item_id, buy_price_max: b.price, buy_price_max_date: b.date, buy_count: b.count, buy_cities: b.cities, sell_price_min: s.price, sell_price_min_date: s.date, sell_count: s.count, sell_cities: s.cities }];
  }));
}

// Fetches and aggregates every price the table needs for the given variants.
// locations/qualities are the ticked sidebar options; cities is every city (for artifacts).
async function fetchMarket(variants, locations, qualities, cities, signal) {
  const ids = variants.map(variant => encodeURIComponent(variant.id)).join(',');
  const params = new URLSearchParams({ locations: [...locations, BLACK_MARKET].join(','), qualities: qualities.join(',') });
  const materialIds = variants.flatMap(variant => [...variant.materials, variant.artifact, variant.enchant].filter(Boolean).map(material => encodeURIComponent(material.id))).join(',');
  const materialParams = new URLSearchParams({ locations: cities.join(','), qualities: '1' });
  const artifactIds = variants.map(variant => variant.artifact?.id).filter((id, index, ids) => id && ids.indexOf(id) === index);
  const historyParams = new URLSearchParams({ locations: locations.join(','), qualities: qualities.join(','), 'time-scale': '24' });
  const [response, materialResponse, artifactHistory, itemHistory] = await Promise.all([
    fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/prices/${ids}.json?${params}`, { signal }),
    fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/prices/${materialIds}.json?${materialParams}`, { signal }),
    artifactIds.length ? fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/history/${artifactIds.map(encodeURIComponent).join(',')}.json?time-scale=24&qualities=1`, { signal }) : null,
    fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/history/${ids}.json?${historyParams}`, { signal })
  ]);
  for (const result of [response, materialResponse, artifactHistory].filter(Boolean)) if (!result.ok) throw new Error(result.status === 429 ? 'Too many requests. Please wait a moment and refresh.' : `Market service returned ${result.status}. Please try again.`);
  const [data, materialData, historyData = [], itemHistoryData] = await Promise.all([response.json(), materialResponse.json(), artifactHistory?.json(),
    // Estimates are optional: if the history request fails, live prices still show.
    itemHistory.ok ? itemHistory.json().catch(() => []) : []]);
  if (!Array.isArray(data) || !Array.isArray(materialData) || !Array.isArray(historyData)) throw new Error('Unexpected market response. Please try again.');
  const records = data.filter(record => qualities.includes(Number(record.quality)));
  const market = {
    indexed: averageRecords(records.filter(record => locations.includes(record.city))),
    blackMarket: averageRecords(records.filter(record => record.city === BLACK_MARKET))
  };
  const materialPrices = averageRecords(materialData.filter(record => locations.includes(record.city)));
  const enchantPrices = new Map();
  for (const { enchant } of variants) {
    if (!enchant) continue;
    const listings = materialData.filter(record => record.item_id === enchant.id && ROYAL_CITIES.includes(record.city) && record.sell_price_min > 0);
    if (listings.length) enchantPrices.set(enchant.id, { price: Math.round(listings.reduce((sum, record) => sum + record.sell_price_min, 0) / listings.length), cities: listings.map(record => record.city) });
  }
  // Volume-weighted average sale price over the history window (about the last 4 weeks), across all cities.
  const artifactPrices = new Map();
  for (const id of artifactIds) {
    const days = historyData.filter(series => series.item_id === id && cities.includes(series.location)).flatMap(series => series.data).filter(day => day.item_count > 0 && day.avg_price > 0);
    const sold = days.reduce((sum, day) => sum + day.item_count, 0);
    if (!sold) continue;
    const dates = days.map(day => day.timestamp.slice(0, 10)).sort();
    artifactPrices.set(id, { price: Math.round(days.reduce((sum, day) => sum + day.avg_price * day.item_count, 0) / sold), sold, from: dates[0], to: dates.at(-1) });
  }
  // Estimates for empty buy/sell cells: volume-weighted average sale price over the last ESTIMATE_DAYS days,
  // across the ticked cities and qualities.
  market.estimates = new Map();
  market.volume = new Map();
  const cutoff = Date.now() - ESTIMATE_DAYS * 864e5;
  for (const { id } of variants) {
    const series = (Array.isArray(itemHistoryData) ? itemHistoryData : []).filter(entry => entry.item_id === id && locations.includes(entry.location) && qualities.includes(Number(entry.quality)));
    const days = series.flatMap(entry => entry.data.filter(day => day.item_count > 0 && day.avg_price > 0 && new Date(`${day.timestamp}Z`) >= cutoff).map(day => ({ ...day, city: entry.location })));
    const sold = days.reduce((sum, day) => sum + day.item_count, 0);
    // Daily sales volume for the Sales column: one entry per UTC day, oldest first, empty days as 0.
    market.volume.set(id, Array.from({ length: ESTIMATE_DAYS }, (_, back) => {
      const date = new Date(Date.now() - (ESTIMATE_DAYS - 1 - back) * 864e5).toISOString().slice(0, 10);
      const today = days.filter(day => day.timestamp.startsWith(date));
      const count = today.reduce((sum, day) => sum + day.item_count, 0);
      return { date, sold: count, price: count ? Math.round(today.reduce((sum, day) => sum + day.avg_price * day.item_count, 0) / count) : 0 };
    }));
    if (!sold) continue;
    market.estimates.set(id, {
      price: Math.round(days.reduce((sum, day) => sum + day.avg_price * day.item_count, 0) / sold),
      sold,
      newest: days.map(day => day.timestamp).sort().at(-1),
      cities: [...new Set(days.map(day => day.city))]
    });
  }
  return { market, materialPrices, enchantPrices, artifactPrices };
}
