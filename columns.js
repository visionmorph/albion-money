// Column reordering, modelled on Carbon for IBM Products' horizontal drag-and-drop example (dnd-kit):
// - the whole header is draggable, starting once the pointer moves 4px (PointerSensor activationConstraint);
// - movement is locked to the horizontal axis and kept inside the header row (restrictToHorizontalAxis/ParentElement);
// - the target is the slot whose centre is closest to the dragged column's centre (closestCenter);
// - other columns slide aside live while dragging (horizontalListSortingStrategy), over a dashed underlay slot;
// - the order is only committed on drop (arrayMove), and Escape cancels;
// - keyboard: Space/Enter picks up, arrows move one column, Space/Enter drops, Escape cancels,
//   with dnd-kit's default screen reader announcements.
const DEFAULT_COLUMNS = ['buy', 'sell', 'black', 'materials', 'artifact', 'enchant', 'volume'];
const COLUMN_STORAGE_KEY = 'albion-money:columns';
const ACTIVATION_DISTANCE = 4;
const headerRow = document.querySelector('thead tr');
const columnTable = headerRow.closest('table');
const dragAnnouncer = document.querySelector('#drag-announcer');
const underlay = document.createElement('div');
underlay.className = 'drag-underlay';
underlay.setAttribute('aria-hidden', 'true');
underlay.hidden = true;
columnTable.parentElement.append(underlay);
let columnOrder = savedColumnOrder();
let drag = null;

function savedColumnOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem(COLUMN_STORAGE_KEY));
    // Keep a saved order, dropping unknown columns and appending any added since it was saved.
    if (Array.isArray(saved)) {
      const known = saved.filter(key => DEFAULT_COLUMNS.includes(key));
      return [...known, ...DEFAULT_COLUMNS.filter(key => !known.includes(key))];
    }
  } catch {}
  return [...DEFAULT_COLUMNS];
}

const header = key => headerRow.querySelector(`[data-col="${key}"]`);
// A column's header plus every body cell in it (cells carry the column key as their class).
const columnCells = key => [header(key), ...columnTable.querySelectorAll(`tbody td.${key}`)];
// The header's own text node (the subtitle is a child element).
const columnLabel = key => [...header(key).childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()).textContent.trim();
// The artifact column is hidden for items without an artifact, so it isn't a slot.
const isVisible = key => getComputedStyle(header(key)).display !== 'none';

function announce(message) {
  dragAnnouncer.textContent = message;
}

// Commits an order: moves the headers, re-renders the rows (cells follow columnOrder) and saves it.
function setColumnOrder(order) {
  columnOrder = order;
  for (const key of columnOrder) headerRow.append(header(key));
  // Saving can fail (e.g. storage disabled); the new order still applies for this visit.
  try { localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(columnOrder)); } catch {}
  render(...lastRender);
}

// Like dnd-kit's arrayMove: the full order with the dragged column moved to `index` among the visible ones.
function previewOrder(index) {
  const visible = drag.visible.filter(other => other !== drag.key);
  visible.splice(index, 0, drag.key);
  let next = 0;
  return columnOrder.map(other => isVisible(other) ? visible[next++] : other);
}

// Screen x where the dragged column would start if dropped at `index`.
function slotLeft(index) {
  const others = drag.visible.filter(other => other !== drag.key);
  return others.slice(0, index).reduce((sum, other) => sum + drag.slots[other].width, drag.rowLeft);
}

function startDrag(key) {
  const visible = columnOrder.filter(isVisible);
  const slots = Object.fromEntries(visible.map(other => {
    const rect = header(other).getBoundingClientRect();
    return [other, { left: rect.left, width: rect.width }];
  }));
  drag = { key, visible, slots, rowLeft: slots[visible[0]].left, index: visible.indexOf(key), original: [...columnOrder], offset: 0 };
  columnTable.classList.add('is-sorting');
  columnCells(key).forEach(cell => cell.classList.add('column-dragging'));
  layout();
}

// The dragged column follows the pointer (or keyboard slot), the others slide into their preview
// positions, and the dashed underlay marks where the dragged column will land.
function layout() {
  const preview = previewOrder(drag.index).filter(isVisible);
  let left = drag.rowLeft;
  for (const other of preview) {
    const shift = other === drag.key ? drag.offset : left - drag.slots[other].left;
    columnCells(other).forEach(cell => { cell.style.transform = shift ? `translateX(${shift}px)` : ''; });
    left += drag.slots[other].width;
  }
  const wrap = columnTable.parentElement.getBoundingClientRect();
  const head = header(drag.key).getBoundingClientRect();
  underlay.style.left = `${slotLeft(drag.index) - wrap.left}px`;
  underlay.style.top = `${head.top - wrap.top}px`;
  underlay.style.width = `${drag.slots[drag.key].width}px`;
  underlay.style.height = `${columnTable.getBoundingClientRect().bottom - head.top}px`;
  underlay.hidden = false;
}

// closestCenter: the slot whose centre is nearest the dragged column's current centre.
function closestIndex() {
  const width = drag.slots[drag.key].width;
  const centre = drag.slots[drag.key].left + drag.offset + width / 2;
  let best = 0;
  for (let index = 1; index < drag.visible.length; index++) {
    if (Math.abs(slotLeft(index) + width / 2 - centre) < Math.abs(slotLeft(best) + width / 2 - centre)) best = index;
  }
  return best;
}

// Name of the column the dragged one is currently over (its neighbour at the target slot).
function overLabel() {
  const others = drag.visible.filter(other => other !== drag.key);
  const index = drag.visible.indexOf(drag.key);
  return columnLabel(drag.index === index ? drag.key : others[drag.index > index ? drag.index - 1 : drag.index]);
}

function endDrag(commit) {
  const order = commit ? previewOrder(drag.index) : drag.original;
  columnTable.classList.remove('is-sorting');
  columnTable.querySelectorAll('.column-dragging').forEach(cell => cell.classList.remove('column-dragging'));
  columnTable.querySelectorAll('thead th, tbody td').forEach(cell => { cell.style.transform = ''; });
  underlay.hidden = true;
  drag = null;
  if (order.join() !== columnOrder.join()) setColumnOrder(order);
}

function onPointerDown(event, key) {
  if (event.button !== 0 || drag) return;
  const th = header(key);
  const startX = event.clientX;
  let active = false;
  th.setPointerCapture(event.pointerId);
  const move = moveEvent => {
    const dx = moveEvent.clientX - startX;
    if (!active) {
      if (Math.abs(dx) < ACTIVATION_DISTANCE) return;
      active = true;
      startDrag(key);
      announce(`Picked up draggable item ${columnLabel(key)}.`);
    }
    // Keep the column inside the header row.
    drag.offset = Math.min(slotLeft(drag.visible.length - 1), Math.max(drag.rowLeft, drag.slots[key].left + dx)) - drag.slots[key].left;
    drag.index = closestIndex();
    layout();
  };
  const finish = commit => {
    th.removeEventListener('pointermove', move);
    if (!active) return;
    const label = columnLabel(key);
    const over = overLabel();
    endDrag(commit);
    announce(commit ? `Draggable item ${label} was dropped over droppable area ${over}.` : `Dragging was cancelled. Draggable item ${label} was dropped.`);
  };
  th.addEventListener('pointermove', move);
  th.addEventListener('pointerup', () => finish(true), { once: true });
  th.addEventListener('pointercancel', () => finish(false), { once: true });
}

function onKeyDown(event, key) {
  const pickKey = event.key === ' ' || event.key === 'Enter';
  if (!drag && pickKey) {
    event.preventDefault();
    startDrag(key);
    announce(`Picked up draggable item ${columnLabel(key)}.`);
  } else if (drag?.key === key && pickKey) {
    event.preventDefault();
    const label = columnLabel(key);
    const over = overLabel();
    endDrag(true);
    header(key).focus();
    announce(`Draggable item ${label} was dropped over droppable area ${over}.`);
  } else if (drag?.key === key && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault();
    const index = drag.index + (event.key === 'ArrowLeft' ? -1 : 1);
    if (index < 0 || index >= drag.visible.length) return;
    // Keyboard moves land exactly on a slot, like dnd-kit's coordinateGetter stepping by item width.
    drag.index = index;
    drag.offset = slotLeft(index) - drag.slots[key].left;
    layout();
    announce(`Draggable item ${columnLabel(key)} was moved over droppable area ${overLabel()}.`);
  } else if (drag?.key === key && event.key === 'Escape') {
    event.preventDefault();
    endDrag(false);
    header(key).focus();
    announce(`Dragging was cancelled. Draggable item ${columnLabel(key)} was dropped.`);
  }
}

for (const key of DEFAULT_COLUMNS) {
  const th = header(key);
  th.tabIndex = 0;
  th.classList.add('draggable-column');
  th.setAttribute('aria-roledescription', 'sortable');
  th.setAttribute('aria-describedby', 'drag-help');
  th.addEventListener('pointerdown', event => onPointerDown(event, key));
  th.addEventListener('keydown', event => onKeyDown(event, key));
  // Losing focus mid keyboard drag cancels it.
  th.addEventListener('blur', () => { if (drag?.key === key) endDrag(false); });
}
for (const key of columnOrder) headerRow.append(header(key));

// Column filter: a menu of checkboxes, one per column; unticking one hides that column.
const HIDDEN_STORAGE_KEY = 'albion-money:hidden-columns';
const filterButton = document.querySelector('#column-filter');
const columnMenu = document.querySelector('#column-menu');
let hiddenColumns = [];
try { hiddenColumns = (JSON.parse(localStorage.getItem(HIDDEN_STORAGE_KEY)) || []).filter(key => DEFAULT_COLUMNS.includes(key)); } catch {}

function applyHiddenColumns() {
  for (const key of DEFAULT_COLUMNS) columnTable.classList.toggle(`hide-${key}`, hiddenColumns.includes(key));
  try { localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(hiddenColumns)); } catch {}
}

columnMenu.querySelector('fieldset').append(...DEFAULT_COLUMNS.map(key => {
  const label = document.createElement('label');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.value = key;
  box.checked = !hiddenColumns.includes(key);
  box.addEventListener('change', () => {
    hiddenColumns = DEFAULT_COLUMNS.filter(other => other === key ? !box.checked : hiddenColumns.includes(other));
    applyHiddenColumns();
  });
  const text = document.createElement('span');
  text.textContent = columnLabel(key);
  label.append(box, text);
  return label;
}));
applyHiddenColumns();

function setMenuOpen(open) {
  columnMenu.hidden = !open;
  filterButton.setAttribute('aria-expanded', String(open));
  if (open) columnMenu.querySelector('input').focus();
}
filterButton.addEventListener('click', () => setMenuOpen(columnMenu.hidden));
// Close on Escape (returning focus to the button) or on a click outside the menu.
columnMenu.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  setMenuOpen(false);
  filterButton.focus();
});
document.addEventListener('pointerdown', event => {
  if (!columnMenu.hidden && !event.target.closest('.filter-wrap')) setMenuOpen(false);
});
