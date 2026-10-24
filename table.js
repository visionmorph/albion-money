// Table rendering: one row per variant, one cell builder per column.
const formatter = new Intl.NumberFormat('en-US');

function observation(date) {
  if (!date || date.startsWith('0001')) return null;
  const parsed = new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(date) ? date : `${date}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function priceCell(record, side, loading, className = side) {
  const cell = document.createElement('td');
  cell.className = className;
  const amount = record?.[side === 'buy' ? 'buy_price_max' : 'sell_price_min'];
  const date = observation(record?.[side === 'buy' ? 'buy_price_max_date' : 'sell_price_min_date']);
  const value = document.createElement('span');
  value.className = `price${amount > 0 ? '' : ' missing'}`;
  value.textContent = amount > 0 ? formatter.format(amount) : '—';
  // Buy and sell orders get a dot per city their price came from.
  const sources = className === side && amount > 0 ? record[`${side}_cities`] || [] : [];
  if (sources.length) {
    const dots = document.createElement('span');
    dots.className = 'city-dots';
    dots.append(...sources.map(name => {
      const dot = document.createElement('i');
      dot.style.background = CITY_COLORS[name];
      dot.dataset.city = name;
      dot.setAttribute('aria-label', name);
      return dot;
    }));
    value.prepend(dots);
  }
  cell.append(value);
  const age = document.createElement('span');
  age.className = 'age';
  const count = record?.[side === 'buy' ? 'buy_count' : 'sell_count'] || 0;
  if (amount > 0 && date) {
    const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    age.textContent = (count > 1 ? `Avg. of ${count} · ` : '') + (minutes < 1 ? 'Just observed' : minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`);
    age.classList.toggle('stale', minutes >= 1440);
    age.title = count > 1 ? `Average of ${count} prices; newest observed ${date.toLocaleString()}` : `Observed ${date.toLocaleString()}`;
  } else {
    age.textContent = loading ? 'Loading…' : amount > 0 ? 'Observation time unknown' : '';
  }
  cell.append(age);
  return cell;
}

function materialCell(variant, materialPrices, loading, rate) {
  const cell = document.createElement('td');
  cell.className = 'materials';
  const costs = variant.materials.map(material => material.count * (materialPrices.get(material.id)?.sell_price_min || 0));
  const complete = costs.every(cost => cost > 0);
  const value = document.createElement('span');
  value.className = `price${complete ? '' : ' missing'}`;
  value.textContent = complete ? formatter.format(Math.round(costs.reduce((sum, cost) => sum + cost, 0) * (1 - rate / 100))) : '—';
  const detail = document.createElement('span');
  detail.className = 'age';
  detail.textContent = complete ? variant.materials.map(material => `${material.count} ${material.name}`).join(' + ') : '';
  detail.title = variant.materials.map((material, index) => `${material.count} × ${material.id}: ${costs[index] > 0 ? formatter.format(costs[index]) : (loading ? 'loading' : 'no sell order')}`).join('\n') + `\nBefore ${rate}% return: ${complete ? formatter.format(costs.reduce((sum, cost) => sum + cost, 0)) : '—'}`;
  cell.append(value, detail);
  return cell;
}

// Artifacts are never returned, so this is the full price with no return rate applied.
// Listings are sparse, so artifacts use their estimated market value: the average sale price from recent history.
function artifactCell(variant, artifactPrices, loading) {
  const cell = document.createElement('td');
  cell.className = 'artifact';
  const artifact = variant.artifact;
  const estimate = artifact && artifactPrices.get(artifact.id);
  const price = estimate?.price;
  const value = document.createElement('span');
  value.className = `price${price > 0 ? '' : ' missing'}`;
  value.textContent = price > 0 ? formatter.format(artifact.count * price) : '—';
  const detail = document.createElement('span');
  detail.className = 'age';
  detail.textContent = price > 0 ? artifact.name : artifact && loading ? 'Loading…' : '';
  if (artifact) detail.title = `${artifact.count} × ${artifact.id}` + (estimate ? `
Average of ${formatter.format(estimate.sold)} sales across all cities, ${estimate.from} to ${estimate.to}` : '');
  cell.append(value, detail);
  return cell;
}

function enchantCell(variant, enchantPrices, loading) {
  const cell = document.createElement('td');
  cell.className = 'enchant';
  const value = document.createElement('span');
  const detail = document.createElement('span');
  detail.className = 'age';
  const enchant = variant.enchant;
  const average = enchant && enchantPrices.get(enchant.id);
  const price = average?.price;
  value.className = `price${price > 0 ? '' : ' missing'}`;
  value.textContent = price > 0 ? formatter.format(enchant.count * price) : '—';
  if (enchant) {
    detail.textContent = price > 0 ? `${enchant.count} ${enchant.name.toLowerCase()}s` : '';
    detail.title = `${enchant.count} × ${enchant.id}: ${price > 0 ? `${formatter.format(price)} each (Royal City average of lowest asks in ${average.cities.join(', ')})` : loading ? 'loading' : 'no sell orders in any city'}`;
  }
  cell.append(value, detail);
  return cell;
}

function render(market = { indexed: new Map(), blackMarket: new Map() }, loading = false, materialPrices = new Map(), enchantPrices = new Map(), artifactPrices = new Map()) {
  lastRender = [market, loading, materialPrices, enchantPrices, artifactPrices];
  const rate = returnRate();
  returnRateValue.textContent = `${rate}%`;
  const { indexed, blackMarket } = market;
  // Hide the Artifact column for items whose recipe has no artifact.
  rows.closest('table').classList.toggle('no-artifact', !variants.some(variant => variant.artifact));
  rows.replaceChildren(...variants.map(variant => {
    const row = document.createElement('tr');
    if (!variant.enchantment && variant.tier > 4) row.className = 'tier-start';
    const label = document.createElement('td');
    label.innerHTML = `<span class="variant"><span class="tier-icon tier-${variant.tier}" aria-hidden="true">${['IV', 'V', 'VI', 'VII', 'VIII'][variant.tier - 4]}</span>${variant.tier}.${variant.enchantment}</span>`;
    row.append(label, priceCell(indexed.get(variant.id), 'buy', loading), priceCell(indexed.get(variant.id), 'sell', loading), priceCell(blackMarket.get(variant.id), 'buy', loading, 'black'), materialCell(variant, materialPrices, loading, rate), artifactCell(variant, artifactPrices, loading), enchantCell(variant, enchantPrices, loading));
    return row;
  }));
}
