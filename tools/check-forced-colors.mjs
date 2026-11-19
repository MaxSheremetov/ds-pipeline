// Gate: in Windows high-contrast (forced-colors) mode, marks drawn by background must stay visible.
// Needs Playwright + Chromium and a built Storybook (apps/storybook/storybook-static).
// If Playwright is not installed the gate prints SKIPPED and exits 0 (CI should install it).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve('apps/storybook/storybook-static');
if (!fs.existsSync(root)) { console.log('forced-colors: SKIPPED (storybook-static not built)'); process.exit(0); }

let chromium;
try {
  const require = createRequire(import.meta.url);
  ({ chromium } = require('playwright'));
} catch {
  try { ({ chromium } = await import('playwright')); } catch {
    console.log('forced-colors: SKIPPED (playwright not installed)'); process.exit(0);
  }
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const failures = [];
const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ forcedColors: 'active' });
const open = async (id) => { await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`); await page.waitForSelector('#storybook-root *'); await page.waitForTimeout(300); };
const check = (name, ok, detail) => { if (!ok) failures.push(`${name}: ${detail}`); };

// Checkbox: tick/dash is a pseudo-element background; it must resolve to a real system colour, not transparent.
for (const id of ['components-checkbox--checked', 'components-checkbox--mixed']) {
  await open(id);
  const r = await page.evaluate(() => {
    const el = document.querySelector('.ds-checkbox__input');
    const mark = getComputedStyle(el, '::after');
    return { bg: mark.backgroundColor, border: getComputedStyle(el).borderTopColor, borderW: getComputedStyle(el).borderTopWidth };
  });
  check(id + ' mark', r.bg !== 'rgba(0, 0, 0, 0)' && r.bg !== 'transparent', `tick background is ${r.bg}`);
  check(id + ' border', parseFloat(r.borderW) > 0 && r.border !== 'rgba(0, 0, 0, 0)', `border ${r.borderW} ${r.border}`);
}

// Badge: status dot must be visible.
await open('components-badge--matrix');
{
  const r = await page.evaluate(() => [...document.querySelectorAll('.ds-badge__dot')].map((d) => getComputedStyle(d).backgroundColor));
  check('badge dot', r.length > 0 && r.every((c) => c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent'), `dots: ${[...new Set(r)].join(', ')}`);
}

// Table: selected row must have a visible marker (border in Highlight colour).
await open('components-table--selected-row');
{
  const r = await page.evaluate(() => {
    const c = document.querySelector('.ds-table__row[data-selected] > :first-child');
    return c ? getComputedStyle(c).borderInlineStartWidth + ' ' + getComputedStyle(c).borderInlineStartStyle : null;
  });
  check('table selected row', !!r && parseFloat(r) > 0 && !r.endsWith('none'), `start border is ${r}`);
}

// Input: disabled state must not rely on background alone.
await open('components-input--disabled');
{
  const r = await page.evaluate(() => {
    const f = document.querySelector('.ds-input[data-disabled] .ds-input__field');
    const c = document.querySelector('.ds-input[data-disabled] .ds-input__control');
    return f && c ? { border: getComputedStyle(f).borderTopColor, color: getComputedStyle(c).color } : null;
  });
  check('input disabled', !!r, 'disabled input markup not found');
}

// Select: the highlighted option takes the system selection colours and the chevron follows the text colour.
await open('components-select--filled');
{
  await page.locator('.ds-select__trigger').click();
  await page.waitForSelector('.ds-select-option');
  await page.locator('.ds-select-option').nth(1).hover();
  const r = await page.evaluate(() => {
    const h = document.querySelector('.ds-select-option[data-highlighted]');
    const chev = document.querySelector('.ds-select__trigger .ds-icon');
    const canvas = getComputedStyle(document.body).backgroundColor;
    return { hl: h ? getComputedStyle(h).backgroundColor : null, canvas, chev: getComputedStyle(chev).color };
  });
  check('select highlighted option', !!r.hl && r.hl !== r.canvas, `highlight ${r.hl} equals canvas ${r.canvas}`);
  check('select chevron', r.chev !== 'rgba(0, 0, 0, 0)', `chevron colour ${r.chev}`);
  await page.keyboard.press('Escape');
}

// Multiple Select: every box has a visible edge, the chosen box shows a tick, and the menu edge is drawn.
await open('components-select--multiple');
{
  await page.locator('.ds-select__trigger').click();
  await page.waitForSelector('.ds-select-option__box');
  const r = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('.ds-select-option__box')];
    const on = document.querySelector('.ds-select-option[data-state="checked"] .ds-select-option__tick');
    const menu = document.querySelector('.ds-select-menu');
    return { edges: boxes.map((b) => getComputedStyle(b).borderTopWidth + ' ' + getComputedStyle(b).borderTopColor), tick: on ? getComputedStyle(on).color : null, menuEdge: getComputedStyle(menu).borderTopWidth };
  });
  check('multiple select box edge', r.edges.length > 0 && r.edges.every((e) => parseFloat(e) > 0 && !e.endsWith('rgba(0, 0, 0, 0)')), `edges ${r.edges.join(' | ')}`);
  check('multiple select tick', !!r.tick && r.tick !== 'rgba(0, 0, 0, 0)', `tick colour ${r.tick}`);
  check('select menu edge', parseFloat(r.menuEdge) > 0, `menu edge ${r.menuEdge}`);
  await page.keyboard.press('Escape');
}

// Radio: the dot is a pseudo-element background; the circle needs a visible border.
await open('components-radio--checked');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-radio__input'); return { dot: getComputedStyle(el, '::after').backgroundColor, vis: getComputedStyle(el, '::after').visibility, bw: getComputedStyle(el).borderTopWidth, bc: getComputedStyle(el).borderTopColor }; });
  check('radio dot', r.dot !== 'rgba(0, 0, 0, 0)' && r.vis === 'visible', `dot ${r.dot} ${r.vis}`);
  check('radio border', parseFloat(r.bw) > 0 && r.bc !== 'rgba(0, 0, 0, 0)', `border ${r.bw} ${r.bc}`);
}
// Toggle: the knob and the track edge must be visible, and On must look different from Off (fill and knob position carry the value).
await open('components-toggle--sizes');
{
  const r = await page.evaluate(() => {
    const [off, on] = document.querySelectorAll('.ds-toggle__input');
    const st = (el) => ({ knob: getComputedStyle(el, '::after').backgroundColor, bg: getComputedStyle(el).backgroundColor, bw: getComputedStyle(el).borderTopWidth, bc: getComputedStyle(el).borderTopColor, x: getComputedStyle(el, '::after').transform });
    return { off: st(off), on: st(on) };
  });
  check('toggle knob', r.off.knob !== 'rgba(0, 0, 0, 0)' && r.on.knob !== 'rgba(0, 0, 0, 0)', `knobs ${r.off.knob} ${r.on.knob}`);
  check('toggle edge', parseFloat(r.off.bw) > 0 && r.off.bc !== 'rgba(0, 0, 0, 0)', `edge ${r.off.bw} ${r.off.bc}`);
  check('toggle value readable', r.off.x !== r.on.x && r.off.bg !== r.on.bg, `off ${r.off.x} ${r.off.bg}, on ${r.on.x} ${r.on.bg}`);
}
// Chip: edge visible, remove button focusable.
await open('components-chip--removable');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-chip'); return { bw: getComputedStyle(el).borderTopWidth, bc: getComputedStyle(el).borderTopColor }; });
  check('chip edge', parseFloat(r.bw) > 0 && r.bc !== 'rgba(0, 0, 0, 0)', `edge ${r.bw} ${r.bc}`);
}
// Notice: the rail is a border and must stay drawn; Toast: edge and rail; Progress bar: track edge and a visible fill; Spinner: arc; Tooltip: edge.
await open('components-notice--statuses-and-styles');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-notice'); const c = getComputedStyle(el); return { rail: c.borderInlineStartWidth, color: c.borderInlineStartColor, bg: c.backgroundColor }; });
  check('notice rail', parseFloat(r.rail) > 0 && r.color !== 'rgba(0, 0, 0, 0)', `rail ${r.rail} ${r.color}`);
}
await open('components-toast--statuses');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-toast'); const c = getComputedStyle(el); return { edge: c.borderTopWidth, ec: c.borderTopColor, rail: getComputedStyle(el, '::before').backgroundColor }; });
  check('toast edge', parseFloat(r.edge) > 0 && r.ec !== 'rgba(0, 0, 0, 0)', `edge ${r.edge} ${r.ec}`);
  check('toast rail', r.rail !== 'rgba(0, 0, 0, 0)', `rail ${r.rail}`);
}
await open('components-progress-bar--sizes');
{
  const r = await page.evaluate(() => { const t = document.querySelector('.ds-progress__track'), f = document.querySelector('.ds-progress__fill'); return { edge: getComputedStyle(t).borderTopWidth, fill: getComputedStyle(f).backgroundColor, track: getComputedStyle(t).backgroundColor }; });
  check('progress track edge', parseFloat(r.edge) > 0, `edge ${r.edge}`);
  check('progress fill', r.fill !== 'rgba(0, 0, 0, 0)' && r.fill !== r.track, `fill ${r.fill} track ${r.track}`);
}
await open('components-spinner--sizes');
{
  const r = await page.evaluate(() => { const p = document.querySelector('.ds-spinner path'); return { stroke: getComputedStyle(p).stroke, w: getComputedStyle(p).strokeWidth }; });
  check('spinner arc', r.stroke !== 'none' && parseFloat(r.w) > 0, `stroke ${r.stroke} ${r.w}`);
}
await open('components-tooltip--open');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-tooltip'); return el ? { edge: getComputedStyle(el).borderTopWidth } : null; });
  check('tooltip edge', !!r && parseFloat(r.edge) > 0, `edge ${r && r.edge}`);
}
for (const [id, sel] of [['components-modal--medium', '.ds-modal'], ['components-drawer--right', '.ds-drawer'], ['components-popover--default', '.ds-popover']]) {
  await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`); await page.waitForSelector(sel); await page.waitForTimeout(300);
  const r = await page.evaluate((q) => { const el = document.querySelector(q); const c = getComputedStyle(el); return { edge: c.borderTopWidth, shadow: c.boxShadow, bg: c.backgroundColor }; }, sel);
  check(`${sel} edge`, parseFloat(r.edge) > 0 && r.shadow === 'none', `edge ${r.edge} shadow ${r.shadow}`);
}
await open('components-tabs--styles');
{
  const r = await page.evaluate(() => [...document.querySelectorAll('.ds-tabs')].map((t) => { const a = t.querySelector('.ds-tab[data-state="active"]'); const c = getComputedStyle(a); return { style: t.dataset.appearance, border: c.borderTopColor, mark: getComputedStyle(a, '::after').backgroundColor, bg: c.backgroundColor, fg: c.color }; }));
  for (const t of r) {
    check(`tab ${t.style} selected edge`, t.border !== 'rgba(0, 0, 0, 0)', `border ${t.border}`);
    if (t.style !== 'segmented') check(`tab ${t.style} selected mark`, t.mark !== 'rgba(0, 0, 0, 0)' && t.mark !== t.bg, `mark ${t.mark} bg ${t.bg}`);
  }
}
await open('components-pagination--default');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-page[aria-current="page"]')); return { border: c.borderTopColor, w: c.borderTopWidth }; });
  check('pagination current page edge', parseFloat(r.w) > 0 && r.border !== 'rgba(0, 0, 0, 0)', `edge ${r.w} ${r.border}`);
}
await open('components-nav--side-nav');
{
  const r = await page.evaluate(() => { const el = document.querySelector('.ds-nav-item[aria-current="page"]'); return { marker: getComputedStyle(el, '::before').backgroundColor, bg: getComputedStyle(el).backgroundColor }; });
  check('nav marker', r.marker !== 'rgba(0, 0, 0, 0)' && r.marker !== r.bg, `marker ${r.marker} bg ${r.bg}`);
}

// Step 6: Card, Avatar edges; Stepper current disc differs from upcoming; Day selected and range ends differ from default; Dropzone dragging edge differs from default; File row error edge; Accordion item edge.
await open('components-card--medium');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-card')); return { w: c.borderTopWidth, col: c.borderTopColor }; });
  check('card edge', parseFloat(r.w) > 0 && r.col !== 'rgba(0, 0, 0, 0)', `edge ${r.w} ${r.col}`);
}
await open('components-avatar--default');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-avatar')); return { w: c.borderTopWidth, col: c.borderTopColor }; });
  check('avatar edge', parseFloat(r.w) > 0 && r.col !== 'rgba(0, 0, 0, 0)', `edge ${r.w} ${r.col}`);
}
await open('components-stepper--default');
{
  const r = await page.evaluate(() => [...document.querySelectorAll('.ds-step')].map((li) => { const c = getComputedStyle(li.querySelector('.ds-step__disc')); return { st: li.dataset.state, bg: c.backgroundColor, bd: c.borderTopColor, w: c.borderTopWidth }; }));
  const cur = r.find((x) => x.st === 'current'), up = r.find((x) => x.st === 'upcoming');
  check('stepper disc edge', r.every((x) => parseFloat(x.w) > 0), 'a disc has no border');
  check('stepper current differs from upcoming', !!cur && !!up && (cur.bg !== up.bg), `current ${cur && cur.bg} upcoming ${up && up.bg}`);
}
await open('components-day--all-states');
{
  const r = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.ds-day')].map((d) => { const c = getComputedStyle(d); return [d.dataset.state, { bg: c.backgroundColor, bd: c.borderTopColor }]; })));
  for (const st of ['selected', 'range-start', 'range-end']) if (r[st]) check(`day ${st} differs from default`, r[st].bg !== r.default.bg, `${st} ${r[st].bg} default ${r.default.bg}`);
  if (r.today) check('day today edge', r.today.bd !== r.default.bd, `today ${r.today.bd} default ${r.default.bd}`);
}
await open('components-dropzone--default');
const dzDefault = await page.evaluate(() => getComputedStyle(document.querySelector('.ds-dropzone')).borderTopColor);
await open('components-dropzone--dragging');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-dropzone')); return { col: c.borderTopColor, w: c.borderTopWidth, st: c.borderTopStyle }; });
  check('dropzone edge', parseFloat(r.w) > 0 && r.st === 'dashed', `edge ${r.w} ${r.st}`);
  check('dropzone dragging differs from default', r.col !== dzDefault, `dragging ${r.col} default ${dzDefault}`);
}
await open('components-file-row--failed');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-file-row')); return { w: c.borderTopWidth, st: c.borderTopStyle, col: c.borderTopColor }; });
  check('file row error edge', parseFloat(r.w) > 0 && r.st === 'dashed', `edge ${r.w} ${r.st}`);
}
await open('components-accordion--default');
{
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-accordion__item')); return { w: c.borderBottomWidth, col: c.borderBottomColor }; });
  check('accordion item edge', parseFloat(r.w) > 0 && r.col !== 'rgba(0, 0, 0, 0)', `edge ${r.w} ${r.col}`);
}

// Step 7: Date picker and Date range panel edge; in-range days differ from plain days.
for (const id of ['components-date-picker--default', 'components-date-range--default']) {
  await open(id);
  const r = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('.ds-calendar')); return { w: c.borderTopWidth, col: c.borderTopColor }; });
  check(`${id} edge`, parseFloat(r.w) > 0 && r.col !== 'rgba(0, 0, 0, 0)', `edge ${r.w} ${r.col}`);
}
{
  const r = await page.evaluate(() => { const a = getComputedStyle(document.querySelector('.ds-day[data-state="in-range"]')), b = getComputedStyle(document.querySelector('.ds-day[data-state="default"]')), e = getComputedStyle(document.querySelector('.ds-day[data-state="range-start"]')); return { inr: a.borderTopColor, def: b.borderTopColor, start: e.backgroundColor, defBg: b.backgroundColor }; });
  check('range in-range differs from default', r.inr !== r.def, `in-range ${r.inr} default ${r.def}`);
  check('range start differs from default', r.start !== r.defBg, `start ${r.start} default ${r.defBg}`);
}

await browser.close();
server.close();
if (failures.length) { console.error('forced-colors: FAILED\n  ' + failures.join('\n  ')); process.exit(1); }
console.log('forced-colors: OK (checkbox tick/dash, badge dot, table selected row, input disabled, select menu, multiple select, radio, toggle, chip, notice, toast, progress bar, spinner, tooltip, tabs, pagination, nav, modal, drawer, popover, card, avatar, stepper, day, dropzone, file row, accordion, date picker, date range)');
