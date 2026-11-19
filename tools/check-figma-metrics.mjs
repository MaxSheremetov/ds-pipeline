// Gate: computed styles of the built components must equal the geometry in figma/metrics.json
// (read from Figma). Not a pixel diff: it compares boxes, paddings, radius, gap and type metrics.
// Accepted differences go to figma/known-drift.json under "metrics/<component>/<size>/<field>".
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve('apps/storybook/storybook-static');
if (!fs.existsSync(root)) { console.log('figma-metrics: SKIPPED (storybook-static not built)'); process.exit(0); }
let chromium;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); } catch {
  console.log('figma-metrics: SKIPPED (playwright not installed)'); process.exit(0);
}
const metrics = JSON.parse(fs.readFileSync('figma/metrics.json', 'utf8'));
const known = fs.existsSync('figma/known-drift.json') ? JSON.parse(fs.readFileSync('figma/known-drift.json', 'utf8')) : {};

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
const open = async (id) => { await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`); await page.waitForSelector('#storybook-root *'); await page.waitForTimeout(300); };
const px = (v) => Math.round(parseFloat(v) * 100) / 100;

const readers = {
  button: (size) => page.evaluate((s) => {
    const el = document.querySelector(`.ds-button[data-size="${s}"]:not(.ds-icon-button)`); if (!el) return null;
    const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('.ds-button__label'));
    return { h: el.getBoundingClientRect().height, px: c.paddingLeft, gap: c.columnGap, radius: c.borderTopLeftRadius, fs: l.fontSize, lh: l.lineHeight };
  }, size),
  checkbox: (size) => page.evaluate((s) => {
    const wrap = document.querySelector(`.ds-checkbox[data-size="${s}"]`); if (!wrap) return null;
    const i = wrap.querySelector('.ds-checkbox__input'), m = getComputedStyle(i, '::after'), l = getComputedStyle(wrap.querySelector('.ds-checkbox__label'));
    return { box: i.getBoundingClientRect().width, mark: m.width, radius: getComputedStyle(i).borderTopLeftRadius, gap: getComputedStyle(wrap).columnGap, fs: l.fontSize, lh: l.lineHeight };
  }, size),
};
readers.select = async (size) => {
  const root = await page.evaluate((s) => {
    const el = document.querySelector(`.ds-select[data-size="${s}"]`); if (!el) return null;
    const f = el.querySelector('.ds-input__field'), t = el.querySelector('.ds-select__trigger');
    return { h: f.getBoundingClientRect().height, px: getComputedStyle(f).paddingLeft, gap: getComputedStyle(t).columnGap, radius: getComputedStyle(f).borderTopLeftRadius, fs: getComputedStyle(t).fontSize, lh: getComputedStyle(t).lineHeight };
  }, size);
  if (!root) return null;
  await page.locator(`.ds-select[data-size="${size}"] .ds-select__trigger`).click();
  const opt = await page.evaluate(() => {
    const o = document.querySelector('.ds-select-option'); const c = getComputedStyle(o);
    const f = document.querySelector('.ds-select__trigger').getBoundingClientRect(), m = document.querySelector('.ds-select-menu').getBoundingClientRect();
    // Spec: the menu is as wide as the field, starts at its left edge and opens below it with a gap of at least 8 (clears the focus ring).
    return { oh: o.getBoundingClientRect().height, opx: c.paddingLeft, ofs: c.fontSize, olh: c.lineHeight, menuLeft: m.x - f.x, menuWidth: m.width - f.width, menuGap: Math.min(m.y - (f.y + f.height), 8) };
  });
  await page.keyboard.press('Escape');
  return { ...root, ...opt };
};
readers.input = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-input[data-size="${s}"]:not(.ds-select)`); if (!el) return null;
  const f = el.querySelector('.ds-input__field'), c = el.querySelector('.ds-input__control'), l = el.querySelector('.ds-input__label'), m = el.querySelector('.ds-input__message');
  const lb = l.getBoundingClientRect(), fb = f.getBoundingClientRect(), mb = m.getBoundingClientRect();
  return { h: fb.height, px: getComputedStyle(f).paddingLeft, radius: getComputedStyle(f).borderTopLeftRadius, fs: getComputedStyle(c).fontSize, lh: getComputedStyle(c).lineHeight,
    labelFs: getComputedStyle(l).fontSize, labelLh: getComputedStyle(l).lineHeight, hintFs: getComputedStyle(m).fontSize, hintLh: getComputedStyle(m).lineHeight,
    stack: Math.min(fb.top - lb.bottom, mb.top - fb.bottom) };
}, size);
readers.iconButton = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-icon-button[data-size="${s}"][data-variant="primary"]`); if (!el) return null;
  const b = el.getBoundingClientRect(), i = el.querySelector('svg').getBoundingClientRect();
  return { box: b.width, h: b.height, radius: getComputedStyle(el).borderTopLeftRadius, icon: i.width };
}, size);
readers.badge = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-badge[data-size="${s}"][data-style="subtle"][data-status="neutral"]`); if (!el) return null;
  const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('.ds-badge__label'));
  return { h: el.getBoundingClientRect().height, px: c.paddingLeft, gap: c.columnGap, radius: c.borderTopLeftRadius, dot: el.querySelector('.ds-badge__dot').getBoundingClientRect().width, fs: l.fontSize, lh: l.lineHeight };
}, size);
readers.table = (part) => page.evaluate((p) => {
  if (p === 'cell') { const el = document.querySelector('.ds-table__body .ds-table__td:not(.ds-table__select)'); if (!el) return null; const c = getComputedStyle(el); return { h: el.getBoundingClientRect().height, px: c.paddingLeft, fs: c.fontSize, lh: c.lineHeight }; }
  if (p === 'header') { const el = document.querySelector('.ds-table__head .ds-table__th:not(.ds-table__select)'); if (!el) return null; const c = getComputedStyle(el); return { h: el.getBoundingClientRect().height, px: c.paddingLeft, fs: c.fontSize, lh: c.lineHeight }; }
  const el = document.querySelector('.ds-table__body .ds-table__row'); return el ? { h: el.getBoundingClientRect().height } : null;
}, part);
readers.selectPanel = async (size) => {
  await page.goto(`http://localhost:${port}/iframe.html?id=components-select--multiple-searchable&viewMode=story&args=size:${size}`);
  await page.waitForSelector('.ds-select__trigger'); await page.waitForTimeout(300);
  await page.locator('.ds-select__trigger').click(); await page.waitForSelector('.ds-select-menu');
  const r = await page.evaluate(() => {
    const f = document.querySelector('.ds-select__trigger').getBoundingClientRect(), m = document.querySelector('.ds-select-menu').getBoundingClientRect();
    const box = document.querySelector('.ds-select-option__box'), tick = document.querySelector('.ds-select-option__tick');
    return { searchH: document.querySelector('.ds-select-search').getBoundingClientRect().height, boxW: box.getBoundingClientRect().width, boxH: box.getBoundingClientRect().height, boxRadius: getComputedStyle(box).borderTopLeftRadius, tickW: tick.getBoundingClientRect().width,
      footerH: document.querySelector('.ds-select-footer').getBoundingClientRect().height, menuLeft: m.x - f.x, menuWidth: m.width - f.width, menuGap: Math.min(m.y - (f.y + f.height), 8) };
  });
  await page.keyboard.press('Escape');
  return r;
};
readers.radio = (size) => page.evaluate((s) => {
  const wrap = document.querySelector(`.ds-radio[data-size="${s}"]`); if (!wrap) return null;
  const i = wrap.querySelector('.ds-radio__input'), l = getComputedStyle(wrap.querySelector('.ds-radio__label'));
  return { box: i.getBoundingClientRect().width, dot: getComputedStyle(i, '::after').width, gap: getComputedStyle(wrap).columnGap, fs: l.fontSize, lh: l.lineHeight };
}, size);
readers.toggle = (size) => page.evaluate((s) => {
  const wrap = document.querySelector(`.ds-toggle[data-size="${s}"]`); if (!wrap) return null;
  const i = wrap.querySelector('.ds-toggle__input'), b = i.getBoundingClientRect(), k = getComputedStyle(i, '::after'), l = getComputedStyle(wrap.querySelector('.ds-toggle__label'));
  // inset: distance from the track edge to the knob, from the knob offsets plus the 1px border the box model counts
  return { w: b.width, h: b.height, knob: k.width, inset: parseFloat(k.left) + parseFloat(getComputedStyle(i).borderLeftWidth), gap: getComputedStyle(wrap).columnGap, fs: l.fontSize, lh: l.lineHeight };
}, size);
readers.chip = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-chip[data-size="${s}"][data-style="subtle"][data-status="neutral"][data-removable="true"]`); if (!el) return null;
  const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('.ds-chip__label'));
  return { h: el.getBoundingClientRect().height, pl: c.paddingLeft, pr: c.paddingRight, gap: c.columnGap, radius: c.borderTopLeftRadius, icon: el.querySelector(':scope > svg').getBoundingClientRect().width, action: el.querySelector('.ds-chip__remove').getBoundingClientRect().width, fs: l.fontSize, lh: l.lineHeight };
}, size);
readers.notice = () => page.evaluate(() => {
  const el = document.querySelector('.ds-notice[data-status="neutral"][data-style="subtle"]'); if (!el) return null;
  const c = getComputedStyle(el), r = el.getBoundingClientRect(), ic = el.querySelector('.ds-notice__icon').getBoundingClientRect();
  const t = getComputedStyle(el.querySelector('.ds-notice__title')), m = getComputedStyle(el.querySelector('.ds-notice__message'));
  return { h: r.height, icon: ic.width, iconLeft: ic.left - r.left, pt: c.paddingTop, gap: c.columnGap, radius: c.borderTopLeftRadius, rail: c.borderLeftWidth, titleFs: t.fontSize, titleLh: t.lineHeight, msgFs: m.fontSize, msgLh: m.lineHeight };
});
readers.toast = () => page.evaluate(() => {
  const el = document.querySelector('.ds-toast[data-status="neutral"]'); if (!el) return null;
  const c = getComputedStyle(el), r = el.getBoundingClientRect(), ic = el.querySelector('.ds-toast__icon').getBoundingClientRect(), t = getComputedStyle(el.querySelector('.ds-toast__text'));
  return { w: r.width, h: r.height, pl: c.paddingLeft, pr: c.paddingRight, pt: c.paddingTop, gap: c.columnGap, radius: c.borderTopLeftRadius, icon: ic.width, iconLeft: ic.left - r.left, fs: t.fontSize, lh: t.lineHeight, close: el.querySelector('.ds-toast__close').getBoundingClientRect().width, rail: getComputedStyle(el, '::before').width };
});
readers.interactiveIcon = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-interactive-icon[data-size="${s}"]`); if (!el) return null;
  return { box: el.getBoundingClientRect().width, icon: el.querySelector('svg').getBoundingClientRect().width };
}, size);
readers.progress = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-progress[data-size="${s}"]`); if (!el) return null;
  const row = el.querySelector('.ds-progress__row'), l = getComputedStyle(el.querySelector('.ds-progress__label'));
  return { track: el.querySelector('.ds-progress__track').getBoundingClientRect().height, gap: getComputedStyle(el).rowGap, row: row.getBoundingClientRect().height, fs: l.fontSize, lh: getComputedStyle(row).lineHeight };
}, size);
readers.skeleton = (shape) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-skeleton[data-shape="${s}"]`); if (!el) return null;
  const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, radius: getComputedStyle(el).borderTopLeftRadius };
}, shape);
readers.tooltip = () => page.evaluate(() => {
  const el = document.querySelector('.ds-tooltip'); if (!el) return null;
  const c = getComputedStyle(el), a = el.querySelector('svg').getBoundingClientRect();
  return { h: el.getBoundingClientRect().height, pl: c.paddingLeft, pt: c.paddingTop, radius: c.borderTopLeftRadius, fs: c.fontSize, lh: c.lineHeight, arrowW: a.width, arrowH: a.height };
});
readers.spinner = (size) => page.evaluate((s) => {
  const el = document.querySelector(`.ds-spinner[data-size="${s}"]`); if (!el) return null;
  return { box: el.getBoundingClientRect().width };
}, size);
readers.tabs = (style) => page.evaluate((s) => {
  const root = document.querySelector(`.ds-tabs[data-appearance="${s}"]`); if (!root) return null;
  const el = root.querySelector('.ds-tab[data-state="active"]') || root.querySelector('.ds-tab'), bar = root.querySelector('.ds-tab-list');
  const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('.ds-tab__label')), cnt = el.querySelector('.ds-tab__count'), ic = el.querySelector(':scope > svg');
  return { h: el.getBoundingClientRect().height, pl: c.paddingLeft, pr: c.paddingRight, gap: c.columnGap, radius: c.borderTopLeftRadius, icon: ic ? ic.getBoundingClientRect().width : 0, fs: l.fontSize, lh: l.lineHeight, countFs: cnt ? getComputedStyle(cnt).fontSize : 0, countLh: cnt ? getComputedStyle(cnt).lineHeight : 0, mark: getComputedStyle(el, '::after').height, bar: bar.getBoundingClientRect().height, trackGap: getComputedStyle(bar).columnGap, trackRadius: getComputedStyle(bar).borderTopLeftRadius };
}, style);
readers.breadcrumb = (size) => page.evaluate((size) => {
  const el = document.querySelector(size === 'overflow' ? '.ds-breadcrumb--overflow' : '.ds-breadcrumb'); if (!el) return null;
  if (size === 'overflow') { const c = getComputedStyle(el); return { h: el.getBoundingClientRect().height, pl: c.paddingLeft, pr: c.paddingRight, fs: c.fontSize, lh: c.lineHeight }; }
  const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('span'));
  return { h: el.getBoundingClientRect().height, pl: c.paddingLeft, pr: c.paddingRight, gap: c.columnGap, icon: el.querySelector('svg').getBoundingClientRect().width, sep: document.querySelector('.ds-breadcrumbs__sep').getBoundingClientRect().width, fs: l.fontSize, lh: l.lineHeight };
}, size);
readers.pagination = () => page.evaluate(() => {
  const bar = document.querySelector('.ds-pagination'), pg = document.querySelector('.ds-page'); if (!bar || !pg) return null;
  const r = pg.getBoundingClientRect(), cnt = getComputedStyle(document.querySelector('.ds-pagination__count'));
  return { page: r.width, pageH: r.height, pageRadius: getComputedStyle(pg).borderTopLeftRadius, pageFs: getComputedStyle(pg).fontSize, pageLh: getComputedStyle(pg).lineHeight, pt: getComputedStyle(bar).paddingTop, gap: getComputedStyle(bar).columnGap, controlsGap: getComputedStyle(document.querySelector('.ds-pagination__controls')).columnGap, pagesGap: getComputedStyle(document.querySelector('.ds-pagination__pages')).columnGap, countFs: cnt.fontSize, countLh: cnt.lineHeight };
});
readers.nav = (kind) => page.evaluate((k) => {
  if (k === 'rail') { const el = document.querySelector('.ds-nav-item[data-rail="true"]'); if (!el) return null; const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, icon: el.querySelector('svg').getBoundingClientRect().width }; }
  const el = document.querySelector('.ds-nav-item[aria-current="page"]'); if (!el) return null;
  const c = getComputedStyle(el), l = getComputedStyle(el.querySelector('.ds-nav-item__label')), cnt = el.querySelector('.ds-nav-item__count');
  return { h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width, pl: c.paddingLeft, pr: c.paddingRight, gap: c.columnGap, icon: el.querySelector('svg').getBoundingClientRect().width, fs: l.fontSize, lh: l.lineHeight, countFs: getComputedStyle(cnt).fontSize, countLh: getComputedStyle(cnt).lineHeight, marker: getComputedStyle(el, '::before').width, listGap: getComputedStyle(el.closest('.ds-nav__list')).rowGap };
}, kind);
const panelRead = (sel) => page.evaluate((q) => {
  const el = document.querySelector(q); if (!el) return null;
  const c = getComputedStyle(el), h = el.querySelector('.ds-overlay__header'), b = el.querySelector('.ds-overlay__body'), f = el.querySelector('.ds-overlay__footer');
  const o = { w: el.getBoundingClientRect().width, radius: c.borderTopLeftRadius, rTL: c.borderTopLeftRadius, rTR: c.borderTopRightRadius, rBL: c.borderBottomLeftRadius, rBR: c.borderBottomRightRadius, bp: getComputedStyle(b).paddingLeft, bGap: getComputedStyle(b).rowGap, fp: f ? getComputedStyle(f).paddingLeft : 0, fH: f ? f.getBoundingClientRect().height : 0 };
  if (h) { const ch = getComputedStyle(h), t = getComputedStyle(h.querySelector('.ds-overlay__title')), d = h.querySelector('.ds-overlay__description'), cl = h.querySelector('.ds-overlay__close'); Object.assign(o, { hp: ch.paddingLeft, hGap: ch.columnGap, hH: h.getBoundingClientRect().height, titleFs: t.fontSize, titleLh: t.lineHeight, descFs: getComputedStyle(d).fontSize, descLh: getComputedStyle(d).lineHeight, textGap: getComputedStyle(h.querySelector('.ds-overlay__text')).rowGap, close: cl.getBoundingClientRect().width }); }
  return o;
}, sel);
readers.modal = (size) => panelRead(`.ds-modal[data-size="${size}"]`);
readers.drawer = (side) => panelRead(`.ds-drawer[data-side="${side}"]`);
readers.popover = (actions) => panelRead('.ds-popover');

// Step 6 readers.
readers.card = (size) => page.evaluate((s) => { const el = document.querySelector(`.ds-card[data-size="${s}"]`); if (!el) return null; const c = getComputedStyle(el); return { pad: c.paddingLeft, gap: c.rowGap, radius: c.borderTopLeftRadius }; }, size);
readers.avatar = (size) => page.evaluate((s) => { const el = document.querySelector(`.ds-avatar[data-size="${s}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { box: r.width }; }, size);
readers.step = () => page.evaluate(() => { const el = document.querySelector('.ds-step__disc'); if (!el) return null; return { disc: el.getBoundingClientRect().width, itemGap: getComputedStyle(document.querySelector('.ds-step__item')).rowGap }; });
readers.day = () => page.evaluate(() => { const el = document.querySelector('.ds-day[data-state="default"]'); if (!el) return null; const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, radius: getComputedStyle(el).borderTopLeftRadius }; });
readers.accordion = () => page.evaluate(() => { const t = document.querySelector('.ds-accordion__trigger'), b = document.querySelector('.ds-accordion__body'); if (!t || !b) return null; return { headerH: t.getBoundingClientRect().height, bodyPl: getComputedStyle(b).paddingLeft }; });
readers.dropzone = () => page.evaluate(() => { const el = document.querySelector('.ds-dropzone'); if (!el) return null; const c = getComputedStyle(el); return { pt: c.paddingTop, pl: c.paddingLeft, gap: c.rowGap, radius: c.borderTopLeftRadius }; });
readers.fileRow = () => page.evaluate(() => { const el = document.querySelector('.ds-file-row[data-status="done"]'); if (!el) return null; const c = getComputedStyle(el); return { pad: c.paddingLeft, gap: c.columnGap, radius: c.borderTopLeftRadius, h: el.getBoundingClientRect().height }; });
readers.empty = () => page.evaluate(() => { const el = document.querySelector('.ds-empty'); if (!el) return null; const c = getComputedStyle(el); return { pt: c.paddingTop, pl: c.paddingLeft, gap: c.rowGap, textGap: getComputedStyle(el.querySelector('.ds-empty__text')).rowGap, icon: el.querySelector('.ds-empty__icon').getBoundingClientRect().width, textMax: getComputedStyle(el.querySelector('.ds-empty__description')).maxWidth }; });

// Step 7 readers.
const calRead = () => page.evaluate(() => { const el = document.querySelector('.ds-calendar'); if (!el) return null; const c = getComputedStyle(el), r = el.getBoundingClientRect(); const wk = el.querySelector('.ds-calendar__weeks'), wd = el.querySelector('.ds-calendar__weekdays'), ft = el.querySelector('.ds-calendar__footer'), hd = el.querySelector('.ds-calendar__header'); return { w: r.width, h: r.height, pad: c.paddingLeft, gap: c.rowGap, radius: c.borderTopLeftRadius, rowGap: getComputedStyle(wk).rowGap, weekdayH: wd.getBoundingClientRect().height, footerH: ft.getBoundingClientRect().height, headerH: hd.getBoundingClientRect().height, gridH: wk.getBoundingClientRect().height, monthsGap: getComputedStyle(el.querySelector('.ds-calendar__months')).columnGap }; });
readers.datePicker = calRead;
readers.dateRange = calRead;
const stories = { notice: 'components-notice--statuses-and-styles', toast: 'components-toast--statuses', interactiveIcon: 'components-interactive-icon--sizes', progress: 'components-progress-bar--sizes', skeleton: 'components-skeleton--shapes', tooltip: 'components-tooltip--open', spinner: 'components-spinner--sizes', radio: 'components-radio--sizes', toggle: 'components-toggle--sizes', chip: 'components-chip--sizes', button: 'components-button--sizes', checkbox: 'components-checkbox--sizes', select: 'components-select--sizes', input: 'components-input--sizes', iconButton: 'components-icon-button--variants', badge: 'components-badge--matrix', table: 'components-table--default', selectPanel: 'components-select--sizes', tabs: { underline: 'components-tabs--with-icons', segmented: 'components-tabs--segmented' }, breadcrumb: { default: 'components-breadcrumbs--default', overflow: 'components-breadcrumbs--collapsed' }, pagination: 'components-pagination--default', nav: { item: 'components-nav--side-nav', rail: 'components-nav--rail' }, modal: { small: 'components-modal--small', medium: 'components-modal--medium', large: 'components-modal--large' }, drawer: { right: 'components-drawer--right', left: 'components-drawer--left', bottom: 'components-drawer--bottom' }, popover: { off: 'components-popover--default', on: 'components-popover--with-actions' }, card: { small: 'components-card--small', medium: 'components-card--medium', large: 'components-card--large' }, avatar: 'components-avatar--sizes', step: 'components-stepper--default', day: 'components-day--all-states', accordion: 'components-accordion--default', dropzone: 'components-dropzone--default', fileRow: 'components-file-row--list', empty: 'components-empty-state--default', datePicker: 'components-date-picker--default', dateRange: 'components-date-range--default' };

const rows = []; const failures = []; let compared = 0, accepted = 0;
for (const comp of Object.keys(readers)) {
  if (typeof stories[comp] === 'string') await open(stories[comp]);
  for (const [size, want] of Object.entries(metrics[comp])) {
    if (typeof stories[comp] !== 'string') await open(stories[comp][size]);
    const got = await readers[comp](size);
    if (!got) { failures.push(`${comp}/${size}: not found in story ${JSON.stringify(stories[comp])}`); continue; }
    for (const [field, w] of Object.entries(want)) {
      compared++;
      const g = px(got[field]); if (g === w) continue;
      const key = `metrics/${comp}/${size}/${field}`;
      if (known[key]) { accepted++; continue; }
      failures.push(`${key}: Figma ${w}, code ${g}`);
    }
  }
}
await browser.close(); server.close();
if (failures.length) { console.error('figma-metrics: FAILED\n  ' + failures.join('\n  ')); process.exit(1); }
console.log(`figma-metrics: OK (${compared} values, Button, Checkbox, Select (menu panel too), Input, Icon button, Badge, Table, Radio, Toggle, Chip, Notice, Toast, Interactive icon, Progress bar, Skeleton, Tooltip, Spinner, Tabs, Breadcrumb, Pagination, Nav, Modal, Drawer, Popover, Card, Avatar, Stepper, Day, Accordion, Dropzone, File row, Empty state, Date picker and Date range, ${accepted} accepted drift)`);
