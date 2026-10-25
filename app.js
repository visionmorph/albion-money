// Page wiring: sidebar state, item switching, search and loading. Loads after items.js, market.js and table.js.
let currentItem = 'bag';
let variants = buildVariants(ITEMS[currentItem]);
const rows = document.querySelector('#prices');
const status = document.querySelector('#status');
const search = document.querySelector('#search');
const returnRateValue = document.querySelector('#return-rate');
const refresh = document.querySelector('#refresh');
// Checkbox groups share a name, so namedItem returns a list of their boxes.
const filters = document.querySelector('#filters').elements;
const city = filters.namedItem('city');
const quality = filters.namedItem('quality');
const focus = document.querySelector('#focus');
const bonusDay = filters.namedItem('bonus-day');
const bonusCity = document.querySelector('#bonus-city');
let lastRender = [[], false, new Map()];

// Checkbox groups: every checked value, e.g. ['Lymhurst', 'Martlock'].
function checked(group) {
  return Array.from(group).filter(box => box.checked).map(box => box.value);
}

function returnRate() {
  return RETURN_RATES[focus.checked ? 'yes' : 'no'][bonusDay.value][bonusCity.checked ? 1 : 0];
}

let activeRequest;

async function loadPrices() {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const timeout = setTimeout(() => controller.abort(), 20000);
  refresh.disabled = true;
  rows.setAttribute('aria-busy', 'true');
  status.className = '';
  status.textContent = '';
  render(undefined, true);
  const locations = checked(city);
  const qualities = checked(quality).map(Number);
  try {
    const result = await fetchMarket(variants, locations, qualities, Array.from(city, box => box.value), controller.signal);
    if (activeRequest !== controller) return;
    render(result.market, false, result.materialPrices, result.enchantPrices, result.artifactPrices);
  } catch (error) {
    if (activeRequest !== controller) return;
    render();
    status.className = 'error';
    status.textContent = error.name === 'AbortError' ? 'Request timed out. Refresh to try again.' : error instanceof TypeError ? 'Could not connect to market data. Check your connection and refresh.' : error.message;
  } finally {
    clearTimeout(timeout);
    if (activeRequest === controller) {
      refresh.disabled = false;
      rows.setAttribute('aria-busy', 'false');
    }
  }
}

document.querySelector('#filters').addEventListener('submit', event => { event.preventDefault(); loadPrices(); });
function showItem() {
  const item = ITEMS[currentItem];
  variants = buildVariants(item);
  document.querySelector('#item-name').textContent = titleCase(item.name);
  document.querySelector('.item-art img').src = `https://render.albiononline.com/v1/item/T4_${item.base}.png?quality=1&size=217`;
  document.querySelector('.item-art img').alt = `${item.name} in Albion Online`;
  document.title = `${item.name} prices · Albion market`;
}

// Each checkbox group needs at least one box checked.
[city, quality].forEach(group => group.forEach(box => box.addEventListener('change', () => {
  if (!checked(group).length) box.checked = true;
})));
[city, quality].forEach(group => group.forEach(box => box.addEventListener('change', loadPrices)));
// Search bar: a combobox over ITEMS; choosing a result switches the page to that item.
const searchResults = document.querySelector('#search-results');
let activeResult = -1;

function showResults() {
  const query = search.value.trim().toLowerCase();
  if (!query) return hideResults();
  const matches = Object.entries(ITEMS).filter(([, item]) => item.name.toLowerCase().includes(query));
  activeResult = Math.min(activeResult, matches.length - 1);
  searchResults.replaceChildren(...matches.map(([key, item], index) => {
    const result = document.createElement('li');
    result.setAttribute('role', 'option');
    result.id = `result-${key}`;
    result.dataset.value = key;
    result.setAttribute('aria-selected', String(index === activeResult));
    const name = document.createElement('span');
    name.textContent = item.name;
    const group = document.createElement('small');
    group.textContent = item.group || '';
    result.append(name, group);
    return result;
  }));
  if (!matches.length) searchResults.innerHTML = '<li class="empty">No matching items</li>';
  searchResults.hidden = false;
  search.setAttribute('aria-expanded', 'true');
  if (activeResult >= 0) search.setAttribute('aria-activedescendant', searchResults.children[activeResult].id);
  else search.removeAttribute('aria-activedescendant');
}

function hideResults() {
  searchResults.hidden = true;
  search.setAttribute('aria-expanded', 'false');
  search.removeAttribute('aria-activedescendant');
  activeResult = -1;
}

function chooseResult(value) {
  search.value = '';
  searchClear.hidden = true;
  search.blur();
  if (currentItem === value) return;
  currentItem = value;
  showItem();
  loadPrices();
}

search.addEventListener('focus', showResults);
const searchClear = document.querySelector('#search-clear');
search.addEventListener('input', () => { activeResult = -1; searchClear.hidden = !search.value; showResults(); });
// mousedown keeps focus in the input, so clearing doesn't close and reopen the list.
searchClear.addEventListener('mousedown', event => event.preventDefault());
searchClear.addEventListener('click', () => {
  search.value = '';
  searchClear.hidden = true;
  hideResults();
  search.focus();
});
search.addEventListener('blur', hideResults);
search.addEventListener('keydown', event => {
  const options = searchResults.hidden ? [] : [...searchResults.querySelectorAll('[role="option"]')];
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!options.length) return;
    activeResult = (activeResult + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    showResults();
  } else if (event.key === 'Enter' && options.length) {
    event.preventDefault();
    chooseResult(options[Math.max(activeResult, 0)].dataset.value);
  } else if (event.key === 'Escape') {
    search.blur();
  }
});
// mousedown fires before the input's blur, so the choice lands before the list closes.
searchResults.addEventListener('mousedown', event => {
  event.preventDefault();
  const option = event.target.closest('[role="option"]');
  if (option) chooseResult(option.dataset.value);
});
[focus, ...bonusDay, bonusCity].forEach(input => input.addEventListener('change', () => render(...lastRender)));
showItem();
loadPrices();

// Cell selection, like Google Sheets: click selects a cell, Ctrl/Cmd+click adds or removes cells,
// and with two or more numeric cells selected a "Sum" tag shows their total. Escape or clicking off the table clears.
const sumTag = document.querySelector('#sum-tag');

// A cell's number: its main price, or the total sold for Sales cells; null for empty cells.
function cellValue(cell) {
  const text = cell.classList.contains('volume') ? cell.querySelector('.age')?.textContent : cell.querySelector('.price')?.textContent;
  const value = Number((text || '').replace(/[^\d.]/g, ''));
  return text && /\d/.test(text) ? value : null;
}

function updateSum() {
  const values = [...rows.querySelectorAll('td.selected')].map(cellValue).filter(value => value !== null);
  sumTag.hidden = values.length < 2;
  sumTag.textContent = `Sum ${formatter.format(values.reduce((sum, value) => sum + value, 0))}`;
}

function clearSelection() {
  rows.querySelectorAll('td.selected').forEach(cell => cell.classList.remove('selected'));
  updateSum();
}

rows.addEventListener('click', event => {
  const cell = event.target.closest('td');
  // The tier column and empty cells have nothing to add up.
  if (!cell || cell === cell.parentElement.firstElementChild || cellValue(cell) === null) return;
  if (event.ctrlKey || event.metaKey) {
    cell.classList.toggle('selected');
  } else {
    const only = cell.classList.contains('selected') && rows.querySelectorAll('td.selected').length === 1;
    clearSelection();
    if (!only) cell.classList.add('selected');
  }
  updateSum();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') clearSelection(); });
document.addEventListener('pointerdown', event => { if (!event.target.closest('#prices')) clearSelection(); });
// Re-rendering replaces the cells, so the old selection no longer exists.
new MutationObserver(updateSum).observe(rows, { childList: true });
