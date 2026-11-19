// Gate: text/background contrast of component token pairs (WCAG 2.x). Text 4.5:1, borders and focus 3:1.
// Pairs are fg/bg tokens of the same variant and state; backgrounds that are transparent are checked on both page colours.
import fs from 'node:fs';
const tokens = JSON.parse(fs.readFileSync('packages/tokens/src/tokens.json', 'utf8'));
const comps = JSON.parse(fs.readFileSync('packages/tokens/src/components.json', 'utf8'));
const get = (p) => p.split('.').reduce((o, k) => (o ? o[k] : undefined), tokens);
const resolve = (v) => { const m = typeof v === 'string' && v.match(/^\{(.+)\}$/); return m ? resolve(get(m[1]).$value) : v; };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = (h) => { const [r, g, b] = rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const tok = (comp, key) => comps.component[comp][key]?.$value && resolve(comps.component[comp][key].$value);
const pages = [get('colour.surface.page').$value, get('colour.surface.raised').$value].map(resolve);
const isTransparent = (key, comp) => /transparent/.test(comps.component[comp][key].$value);

const B = 'button';
const pairs = [
  ['primary default', 'fg-primary', 'bg-primary-default'], ['primary hover', 'fg-primary', 'bg-primary-hover'],
  ['secondary default', 'fg-secondary-default', 'bg-secondary-default'], ['secondary hover', 'fg-secondary-hover', 'bg-secondary-hover'],
  ['quiet default', 'fg-quiet-default', 'bg-quiet-default'], ['quiet hover', 'fg-quiet-hover', 'bg-quiet-hover'],
  ['danger default', 'fg-danger', 'bg-danger'],
  ['filled disabled', 'fg-filled-disabled', 'bg-filled-disabled'],
];
const problems = []; let n = 0;
// Pressed (and danger hover) = state overlay mixed over the hover/base background, as in Button.css.
const mixHex = (o, b, pct) => '#' + [0, 1, 2].map((i) => Math.round(rgb(o)[i] * 255 * pct + rgb(b)[i] * 255 * (1 - pct)).toString(16).padStart(2, '0')).join('');
const pct = (k) => parseFloat(resolve(get(`state.overlay.${k}`).$value)) / 100;
const ovText = resolve(get('colour.text.primary').$value), ovOnAction = resolve(get('colour.text.on-action').$value);
const overlayCases = [
  ['primary hover', 'fg-primary', ovOnAction, 'bg-primary-default', pct('hover')], ['primary pressed', 'fg-primary', ovOnAction, 'bg-primary-hover', pct('pressed')],
  ['secondary pressed', 'fg-secondary-hover', ovText, 'bg-secondary-hover', pct('pressed')],
  ['quiet pressed', 'fg-quiet-hover', ovText, 'bg-quiet-hover', pct('pressed')],
  ['danger hover', 'fg-danger', ovText, 'bg-danger', pct('hover')], ['danger pressed', 'fg-danger', ovText, 'bg-danger', pct('pressed')],
];
for (const [name, f, ov, b, p] of overlayCases) {
  const fg = tok(B, f); n++;
  const bgs = isTransparent(b, B) ? pages : [tok(B, b)];
  for (const bg of bgs) { const mixed = mixHex(ov, bg, p); const r = ratio(fg, mixed); if (r < 4.5) problems.push(`${name}: ${fg} on ${mixed} = ${r.toFixed(2)} (need 4.5)`); }
}
for (const [name, f, b] of pairs) {
  const fg = tok(B, f); n++;
  const bgs = isTransparent(b, B) ? pages : [tok(B, b)];
  for (const bg of bgs) { const r = ratio(fg, bg); if (r < 4.5) problems.push(`${name}: ${fg} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
}
// Secondary border must be visible on the page colours (non-text 3:1) in default state.
for (const pg of pages) { const r = ratio(tok(B, 'border-secondary-default'), pg); n++; if (r < 3) problems.push(`secondary border on ${pg} = ${r.toFixed(2)} (need 3)`); }
// Focus ring on both page colours.
for (const pg of pages) { const r = ratio(resolve(get('colour.border.focus').$value), pg); n++; if (r < 3) problems.push(`focus ring on ${pg} = ${r.toFixed(2)} (need 3)`); }

// Input: text on the field background in each state, label and hint on the page colours, borders and focus ring (3:1).
const I = 'input';
const inputText = [
  ['default', 'text-default-filled', 'bg-default-filled'], ['hover', 'text-hover-filled', 'bg-hover-filled'], ['focus', 'text-focus-filled', 'bg-focus-filled'],
  ['error', 'text-error-filled', 'bg-error-filled'], ['read-only', 'text-read-only-filled', 'bg-read-only-filled'],
  ['placeholder default', 'text-empty', 'bg-default-empty'], ['placeholder hover', 'text-empty', 'bg-hover-empty'], ['placeholder focus', 'text-empty', 'bg-focus-empty'],
  ['placeholder error', 'text-error-empty', 'bg-error-empty'], ['placeholder read-only', 'text-read-only-empty', 'bg-read-only-empty'],
];
for (const [name, f, b] of inputText) { n++; const r = ratio(tok(I, f), tok(I, b)); if (r < 4.5) problems.push(`input ${name}: ${tok(I, f)} on ${tok(I, b)} = ${r.toFixed(2)} (need 4.5)`); }
for (const key of ['label-filled', 'label-error-filled', 'label-read-only-filled', 'hint-filled', 'hint-error-filled', 'hint-read-only-filled'])
  for (const pg of pages) { n++; const r = ratio(tok(I, key), pg); if (r < 4.5) problems.push(`input ${key} on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
for (const key of ['border-default-filled', 'border-hover-filled', 'border-error-filled', 'border-focus-filled'])
  for (const pg of pages) { n++; const r = ratio(tok(I, key), pg); if (r < 3) problems.push(`input ${key} on ${pg} = ${r.toFixed(2)} (need 3)`); }

// Table: header text, and every cell colour on every row background (zebra, hover, selected); sort glyph and header focus ring 3:1.
const T = 'table-row', C = 'table-cell';
const rowBgs = ['bg-odd', 'bg-even', 'bg-odd-hover', 'bg-even-hover', 'bg-selected', 'bg-selected-hover'].map((k) => [k, tok(T, k)]);
const cellInks = [[T, 'text-odd'], [T, 'meta-odd'], [C, 'fg-link'], [C, 'fg-credit'], [C, 'fg-debit'], [C, 'fg-pending']];
for (const [comp, key] of cellInks) for (const [bk, bg] of rowBgs) { n++; const fg = tok(comp, key); const r = ratio(fg, bg); if (r < 4.5) problems.push(`table ${key} on ${bk}: ${fg} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
for (const [name, f, b] of [['header', 'text-header', 'bg-header'], ['header hover', 'text-header-hover', 'bg-header-hover'], ['header meta', 'meta-header', 'bg-header']]) { n++; const r = ratio(tok(T, f), tok(T, b)); if (r < 4.5) problems.push(`table ${name}: ${tok(T, f)} on ${tok(T, b)} = ${r.toFixed(2)} (need 4.5)`); }
for (const [name, k, b] of [['sort ascending', 'asc-ascending', 'bg-header'], ['sort descending', 'desc-descending', 'bg-header'], ['sort ascending hover', 'asc-ascending', 'bg-header-hover']]) { n++; const r = ratio(tok('table-sort', k), tok(T, b)); if (r < 3) problems.push(`table ${name}: ${r.toFixed(2)} (need 3)`); }
for (const [bk, bg] of [['bg-header', tok(T, 'bg-header')], ['bg-header-hover', tok(T, 'bg-header-hover')], ...rowBgs]) { n++; const r = ratio(resolve(get('colour.border.focus').$value), bg); if (r < 3) problems.push(`table focus ring on ${bk} = ${r.toFixed(2)} (need 3)`); }

// Badge: label and dot on the fill, 45 combinations (3 styles x 5 statuses; sizes share colours); outline also on both page colours.
const S = 'status';
for (const st of ['neutral', 'success', 'warning', 'error', 'info']) for (const sty of ['subtle', 'outline', 'solid']) {
  const bg = tok(S, `bg-${st}-${sty}`);
  for (const part of ['fg', 'dot']) { n++; const r = ratio(tok(S, `${part}-${st}-${sty}`), bg); if (r < (part === 'fg' ? 4.5 : 3)) problems.push(`badge ${part} ${st} ${sty}: ${tok(S, `${part}-${st}-${sty}`)} on ${bg} = ${r.toFixed(2)}`); }
  if (sty === 'outline') for (const pg of pages) { n++; const r = ratio(tok(S, `border-${st}-outline`), pg); if (r < 3) problems.push(`badge outline border ${st} on ${pg} = ${r.toFixed(2)} (need 3)`); }
}
// Checkbox: mark on the box (3:1), box border on the page colours (3:1, enabled states), label on the page colours (4.5:1), focus ring on the box and the page.
const K = 'checkbox';
for (const v of ['on', 'mixed']) for (const s of ['default', 'hover', 'disabled']) { n++; const mk = tok(K, v === 'on' ? `mark-on-on-${s}` : `mark-mixed-mixed-${s}`); const r = ratio(mk, tok(K, `box-bg-${v}-${s}`)); if (r < 3) problems.push(`checkbox mark ${v} ${s} = ${r.toFixed(2)} (need 3)`); }
for (const v of ['off', 'on', 'mixed']) for (const s of ['default', 'hover', 'focus']) for (const pg of pages) { n++; const r = ratio(tok(K, `border-${v}-${s}`), pg); if (r < 3) problems.push(`checkbox border ${v} ${s} on ${pg} = ${r.toFixed(2)} (need 3)`); }
for (const v of ['off', 'on', 'mixed']) for (const s of ['default', 'hover', 'focus', 'disabled']) for (const pg of pages) { n++; const t = tok(K, `title-${v}-${s}`); const r = ratio(t, pg); if (r < 4.5) problems.push(`checkbox title ${v} ${s} on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
for (const v of ['off', 'on', 'mixed']) { n++; const r = ratio(resolve(get('colour.border.focus').$value), tok(K, `box-bg-${v}-focus`)); if (r < 3) problems.push(`checkbox focus ring on ${v} box = ${r.toFixed(2)} (need 3)`); }
// Menu (Select options): label on the row background (4.5:1, every state), check on the selected rows (3:1), menu surface on both page colours is the raised surface itself.
const M = 'menu';
for (const s of ['default', 'hover', 'selected', 'selected-hover', 'disabled']) { n++; const r = ratio(tok(M, `fg-${s}`), tok(M, `bg-${s}`)); if (r < 4.5) problems.push(`menu label ${s} = ${r.toFixed(2)} (need 4.5)`); }
for (const s of ['selected', 'selected-hover']) { n++; const r = ratio(tok(M, `check-${s}`), tok(M, `bg-${s}`)); if (r < 3) problems.push(`menu check ${s} = ${r.toFixed(2)} (need 3)`); }
// Menu edge (border/strong) on both page colours, and the multiple-selection box: its border against the row (3:1, enabled states) and the tick against the box fill when selected (3:1).
for (const pg of pages) { n++; const r = ratio(resolve(get('colour.border.strong').$value), pg); if (r < 3) problems.push(`menu edge on ${pg} = ${r.toFixed(2)} (need 3)`); }
for (const s of ['default', 'hover', 'selected', 'selected-hover']) { n++; const r = ratio(tok(M, `box-border-${s}`), tok(M, `bg-${s}`)); if (r < 3) problems.push(`menu box border ${s} = ${r.toFixed(2)} (need 3)`); }
for (const s of ['selected', 'selected-hover']) { n++; const r = ratio(tok(M, `tick-${s}`), tok(M, `box-bg-${s}`)); if (r < 3) problems.push(`menu tick ${s} = ${r.toFixed(2)} (need 3)`); }
// Select field chevron on the field background (3:1) in the states where it is not disabled.
for (const s of ['default-filled', 'hover-filled', 'focus-filled', 'error-filled']) { n++; const bg = tok('input', `bg-${s}`); const r = ratio(tok('input', `icon-${s}`), bg); if (r < 3) problems.push(`select chevron ${s} = ${r.toFixed(2)} (need 3)`); }
// Radio uses the Checkbox tokens (circle fill, border, dot, label), so the Checkbox pairs above cover it.
for (const v of ['off', 'on']) for (const st of ['default', 'hover', 'focus']) for (const pg of pages) { n++; const r = ratio(tok(K, `box-border-${v}-${st}`), pg); if (r < 3) problems.push(`radio border ${v} ${st} on ${pg} = ${r.toFixed(2)} (need 3)`); }
// Toggle: Off track against the page colours (3:1, enabled states), On track edge against the page colours (3:1), knob against its track (3:1, enabled states).
for (const s of ['default', 'hover', 'focus']) for (const pg of pages) { n++; const r = ratio(tok(K, `track-off-${s}`), pg); if (r < 3) problems.push(`toggle off track ${s} on ${pg} = ${r.toFixed(2)} (need 3)`); }
for (const pg of pages) { n++; const r = ratio(tok(K, 'track-border-on'), pg); if (r < 3) problems.push(`toggle on track edge on ${pg} = ${r.toFixed(2)} (need 3)`); }
for (const s of ['default', 'hover', 'focus']) {
  n++; const a = ratio(tok(K, `knob-off-off-${s}`), tok(K, `track-off-${s}`)); if (a < 3) problems.push(`toggle off knob ${s} on track = ${a.toFixed(2)} (need 3)`);
  n++; const b = ratio(tok(K, `knob-on-on-${s}`), tok(K, `track-on-${s}`)); if (b < 3) problems.push(`toggle on knob ${s} on track = ${b.toFixed(2)} (need 3)`);
}
for (const pg of pages) { n++; const r = ratio(resolve(get('colour.border.focus').$value), pg); if (r < 3) problems.push(`toggle focus ring (outside the track) on ${pg} = ${r.toFixed(2)} (need 3)`); }
// Chip: label and icon on the fill (4.5:1), outline edge on the page colours (3:1), and the remove icon (a graphic, 3:1) on its hover and pressed overlay mixed over the fill; the label is never under the overlay. 15 combinations.
for (const st of ['neutral', 'success', 'warning', 'error', 'info']) for (const sty of ['subtle', 'outline', 'solid']) {
  const bg = tok(S, `bg-${st}-${sty}`); const fg = sty === 'solid' ? tok('chip', `fg-${st}-solid`) : tok(S, `fg-${st}-${sty}`);
  n++; const r = ratio(fg, bg); if (r < 4.5) problems.push(`chip ${st} ${sty}: ${fg} on ${bg} = ${r.toFixed(2)} (need 4.5)`);
  for (const k of ['hover', 'pressed']) { n++; const mixed = mixHex(tok(S, `overlay-${st}-${sty}`), bg, pct(k)); const rr = ratio(fg, mixed); if (rr < 3) problems.push(`chip ${st} ${sty} remove icon ${k}: ${fg} on ${mixed} = ${rr.toFixed(2)} (need 3)`); }
}
// Notice: title and message on the fill (4.5:1), 15 combinations x 2. The rail is decoration (the icon and the words carry the status), so it is not checked. Subtle and Outline sit on surface/sunken, Solid on bg-*-solid.
const sunken = resolve(get('colour.surface.sunken').$value);
for (const st of ['neutral', 'success', 'warning', 'error', 'info']) for (const sty of ['subtle', 'outline', 'solid']) {
  const bg = sty === 'solid' ? tok(S, `bg-${st}-solid`) : sunken;
  for (const [what, key] of [['title', `fg-${st}-${sty}`], ['message', `body-${st}-${sty}`]]) { n++; const r = ratio(tok(S, key), bg); if (r < 4.5) problems.push(`notice ${st} ${sty} ${what}: ${tok(S, key)} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
}
// Toast: text/primary on surface/raised (4.5:1), status icon and rail (fg-*-subtle) against it (3:1), 5 statuses; the close icon is the standalone colour, a graphic (3:1).
const raised = resolve(get('colour.surface.raised').$value), textP = resolve(get('colour.text.primary').$value);
n++; { const r = ratio(textP, raised); if (r < 4.5) problems.push(`toast text on raised = ${r.toFixed(2)} (need 4.5)`); }
for (const st of ['neutral', 'success', 'warning', 'error', 'info']) {
  n++; const a = ratio(tok(S, `fg-${st}-subtle`), raised); if (a < 3) problems.push(`toast ${st} icon and rail on raised = ${a.toFixed(2)} (need 3)`);
}
n++; { const r = ratio(tok(S, 'fg-standalone'), raised); if (r < 3) problems.push(`toast close icon on raised = ${r.toFixed(2)} (need 3)`); }
// Modal, Drawer, Popover: title and body text, and the supporting line, on the raised panel (4.5:1).
for (const [name, role] of [['title and body text', 'colour.text.primary'], ['supporting text', 'colour.text.dim']]) { n++; const r = ratio(resolve(get(role).$value), raised); if (r < 4.5) problems.push(`overlay ${name} on raised = ${r.toFixed(2)} (need 4.5)`); }
// Tooltip: text on its fill (4.5:1).
n++; { const r = ratio(tok('tooltip', 'fg'), tok('tooltip', 'bg')); if (r < 4.5) problems.push(`tooltip text on fill = ${r.toFixed(2)} (need 4.5)`); }
// Tabs and Page number: label on its fill in every style and state (4.5:1; transparent fills on both page colours; Disabled is exempt). The selected mark (border/action) against the fill it sits on (3:1).
for (const sty of ['underline', 'enclosed', 'segmented']) {
  const track = sty === 'segmented' ? [tok('tab', 'track-segmented')] : pages;
  for (const st of ['default', 'hover', 'selected', 'selected-hover']) {
    const bgKey = `bg-${sty}-${st}`, fgKey = `fg-${sty}-${st}`;
    const bgs = isTransparent(bgKey, 'tab') ? track : [tok('tab', bgKey)];
    for (const bg of bgs) { n++; const r = ratio(tok('tab', fgKey), bg); if (r < 4.5) problems.push(`tab ${sty} ${st}: label ${tok('tab', fgKey)} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
  }
  if (sty !== 'segmented') { n++; const r = ratio(tok('tab', `indicator-${sty}-selected`), tok('tab', `bg-${sty}-selected`)); if (r < 3) problems.push(`tab ${sty} selected mark on fill = ${r.toFixed(2)} (need 3)`); }
}
// Breadcrumb: link, hover and current label (4.5:1) and the separator and icon (a graphic, 3:1) on both page colours.
for (const k of ['fg-link', 'fg-link-hover', 'fg-current']) for (const pg of pages) { n++; const r = ratio(tok('breadcrumb', k), pg); if (r < 4.5) problems.push(`breadcrumb ${k} on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
for (const pg of pages) { n++; const r = ratio(tok('breadcrumb', 'separator'), pg); if (r < 3) problems.push(`breadcrumb separator on ${pg} = ${r.toFixed(2)} (need 3)`); }
// Pagination count: text/dim on both page colours (4.5:1).
for (const pg of pages) { n++; const r = ratio(resolve(get('colour.text.dim').$value), pg); if (r < 4.5) problems.push(`pagination count on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
// Nav: label, count and icon (nav/fg) on every fill (4.5:1).
for (const b of ['bg-default', 'bg-hover', 'bg-active', 'bg-active-hover']) { n++; const r = ratio(tok('nav', 'fg'), tok('nav', b)); if (r < 4.5) problems.push(`nav ${b}: label on fill = ${r.toFixed(2)} (need 4.5)`); }
// Step 6. Stepper: label and number (4.5:1) on the page colours or their fill, the disc border (a graphic, 3:1) on the page colours; Done shows a tick (text/primary) on its fill.
for (const st of ['upcoming', 'current', 'done']) {
  const bgs = isTransparent(`bg-${st}`, 'stepper') ? pages : [tok('stepper', `bg-${st}`)];
  for (const pg of pages) { n++; const r = ratio(tok('stepper', `label-${st}`), pg); if (r < 4.5) problems.push(`stepper ${st} label on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
  if (st !== 'done') for (const bg of bgs) { n++; const r = ratio(tok('stepper', `number-${st}`), bg); if (r < 4.5) problems.push(`stepper ${st} number on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
  if (st !== 'done') for (const pg of pages) { n++; const r = ratio(tok('stepper', `border-${st}`), pg); if (r < 3) problems.push(`stepper ${st} disc border on ${pg} = ${r.toFixed(2)} (need 3)`); }
}
n++; { const r = ratio(textP, tok('stepper', 'bg-done')); if (r < 4.5) problems.push(`stepper done tick on fill = ${r.toFixed(2)} (need 4.5)`); }
// Day: number on its fill in every state except Disabled (4.5:1); transparent fills on both page colours. In range sits beside the selected ends, so it is checked on its own fill.
for (const st of ['default', 'hover', 'selected', 'today', 'outside', 'in-range', 'range-start', 'range-end']) {
  const bgs = isTransparent(`bg-${st}`, 'calendar-day') ? pages : [tok('calendar-day', `bg-${st}`)];
  for (const bg of bgs) { n++; const r = ratio(tok('calendar-day', `fg-${st}`), bg); if (r < 4.5) problems.push(`day ${st}: number ${tok('calendar-day', `fg-${st}`)} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
}
for (const pg of pages) { n++; const r = ratio(tok('calendar-day', 'border-today'), pg); if (r < 3) problems.push(`day today border on ${pg} = ${r.toFixed(2)} (need 3)`); }
// Accordion: title on the header fill and hover fill, body text/dim on the fill (4.5:1).
for (const bg of [tok('accordion', 'bg'), tok('accordion', 'bg-hover')]) { n++; const r = ratio(tok('accordion', 'fg'), bg); if (r < 4.5) problems.push(`accordion title on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
n++; { const r = ratio(resolve(get('colour.text.dim').$value), tok('accordion', 'bg')); if (r < 4.5) problems.push(`accordion body on fill = ${r.toFixed(2)} (need 4.5)`); }
// Stat: trend colour and the dim label and period on both page colours (4.5:1).
for (const st of ['success', 'error', 'neutral']) for (const pg of pages) { n++; const r = ratio(tok(S, `fg-${st}-subtle`), pg); if (r < 4.5) problems.push(`stat ${st} trend on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
for (const pg of pages) { n++; const r = ratio(resolve(get('colour.text.dim').$value), pg); if (r < 4.5) problems.push(`stat label on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
// Avatar: initials on the standalone fill (4.5:1).
n++; { const r = ratio(tok(S, 'fg-standalone'), tok(S, 'bg-standalone')); if (r < 4.5) problems.push(`avatar initials on fill = ${r.toFixed(2)} (need 4.5)`); }
// Empty state: title (text/primary) and description (text/dim) on both page colours (4.5:1), the illustration icon (a graphic, 3:1).
for (const pg of pages) {
  for (const [what, role] of [['title', 'colour.text.primary'], ['description', 'colour.text.dim']]) { n++; const r = ratio(resolve(get(role).$value), pg); if (r < 4.5) problems.push(`empty state ${what} on ${pg} = ${r.toFixed(2)} (need 4.5)`); }
  n++; const r = ratio(tok('icon', 'fg-standalone'), pg); if (r < 3) problems.push(`empty state icon on ${pg} = ${r.toFixed(2)} (need 3)`);
}
// Dropzone: title (fg) and hint (body) on the fill, edge (fg, a graphic) against the page colours, in default, dragging and error.
for (const st of ['neutral', 'info', 'error']) {
  const bg = tok(S, `bg-${st}-subtle`);
  for (const [what, key] of [['title', `fg-${st}-subtle`], ['hint', `body-${st}-subtle`]]) { n++; const r = ratio(tok(S, key), bg); if (r < 4.5) problems.push(`dropzone ${st} ${what} on fill = ${r.toFixed(2)} (need 4.5)`); }
  for (const pg of pages) { n++; const r = ratio(tok(S, `fg-${st}-subtle`), pg); if (r < 3) problems.push(`dropzone ${st} edge on ${pg} = ${r.toFixed(2)} (need 3)`); }
}
// File row: name (text/primary), size (text/dim) on the row fill, message and status icon (fg-error-subtle) on the error fill.
{ const rowBgs = [raised, tok(S, 'bg-success-subtle'), tok(S, 'bg-error-subtle')];
  for (const bg of rowBgs) for (const [what, c] of [['name', textP], ['size', resolve(get('colour.text.dim').$value)]]) { n++; const r = ratio(c, bg); if (r < 4.5) problems.push(`file row ${what} on ${bg} = ${r.toFixed(2)} (need 4.5)`); }
  n++; const r = ratio(tok(S, 'fg-error-subtle'), tok(S, 'bg-error-subtle')); if (r < 4.5) problems.push(`file row error message on fill = ${r.toFixed(2)} (need 4.5)`); }
// Date picker and Date range: month title (text/primary), weekday heads and the chosen-date text (text/dim) on the raised panel (4.5:1). The Day cells are checked above.
n++; { const r = ratio(textP, raised); if (r < 4.5) problems.push(`calendar month title on raised = ${r.toFixed(2)} (need 4.5)`); }
n++; { const r = ratio(resolve(get('colour.text.dim').$value), raised); if (r < 4.5) problems.push(`calendar weekdays and chosen date on raised = ${r.toFixed(2)} (need 4.5)`); }
// Findings the designer has seen and accepted for now, with the reason, in figma/known-contrast.json (key = start of the message).
const known = fs.existsSync('figma/known-contrast.json') ? JSON.parse(fs.readFileSync('figma/known-contrast.json', 'utf8')) : {};
const accepted = [];
for (let i = problems.length - 1; i >= 0; i--) { const k = Object.keys(known).find((x) => problems[i].startsWith(x)); if (k) { accepted.push(`${problems[i]} (accepted: ${known[k]})`); problems.splice(i, 1); } }
if (problems.length) { console.error(`contrast: ${problems.length} problem(s)\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`contrast: OK (${n} pairs${accepted.length ? `, ${accepted.length} accepted: ${accepted.join(' | ')}` : ''})`);
