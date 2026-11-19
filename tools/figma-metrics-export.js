// Run through mcp use_figma on the Northgate file. Prints geometry per size for figma/metrics.json.
const R = (x) => Math.round(x * 100) / 100;
const page = (n) => figma.root.children.find((p) => p.name === n);
await figma.setCurrentPageAsync(page('Button'));
const button = {};
for (const v of (await figma.getNodeByIdAsync('22:129')).children) {
  const size = /Size=(\w+)/.exec(v.name)[1].toLowerCase(); const b = v.children[0]; const t = b.findOne((x) => x.type === 'TEXT');
  button[size] = { h: R(b.height), px: b.paddingLeft, gap: b.itemSpacing, radius: b.cornerRadius, fs: t.fontSize, lh: t.lineHeight.value };
}
await figma.setCurrentPageAsync(page('Checkbox'));
const checkbox = {};
for (const v of (await figma.getNodeByIdAsync('68:351')).children) {
  const size = /Size=(\w+)/.exec(v.name)[1].toLowerCase(); const b = v.children[0];
  const box = b.findOne((x) => x.name === 'Box'); const t = b.findOne((x) => x.type === 'TEXT');
  checkbox[size] = { box: R(box.width), mark: R(box.findOne((x) => x.name === 'Mark').width), radius: box.cornerRadius, gap: b.itemSpacing, fs: t.fontSize, lh: t.lineHeight.value };
}
// Input, Icon button, Badge, Table (pages are looked up by node id; use_figma resolves them across pages)
const g = (id) => figma.getNodeByIdAsync(id); const sz = (n) => /Size=(\w+)/.exec(n)[1].toLowerCase();
const input = {}; const iconButton = {}; const badge = {};
for (const v of (await g('48:568')).children) {
  if (!/State=Default, Content=Filled/.test(v.name)) continue;
  const b = v.children[0], lab = b.findOne((x) => x.name === 'Label'), f = b.findOne((x) => x.name === 'Field'), val = b.findOne((x) => x.name === 'Value'), h = b.findOne((x) => x.name === 'Hint');
  input[sz(v.name)] = { h: R(f.height), px: f.paddingLeft, radius: f.cornerRadius, fs: val.fontSize, lh: val.lineHeight.value, labelFs: lab.fontSize, labelLh: lab.lineHeight.value, hintFs: h.fontSize, hintLh: h.lineHeight.value, stack: b.itemSpacing };
}
for (const v of (await g('56:373')).children) {
  if (!/Variant=Primary, Size=\w+, State=Default/.test(v.name)) continue;
  const b = v.children[0], ic = b.findOne((x) => x.name === 'Icon');
  iconButton[sz(v.name)] = { box: R(b.width), h: R(b.height), radius: b.cornerRadius, icon: R(ic.width) };
}
for (const v of (await g('79:292')).children) {
  if (!/Status=Neutral, Style=Subtle/.test(v.name)) continue;
  const b = v.children[0], d = b.findOne((x) => x.name === 'Dot'), t = b.findOne((x) => x.type === 'TEXT');
  badge[sz(v.name)] = { h: R(b.height), px: b.paddingLeft, gap: b.itemSpacing, radius: b.cornerRadius, dot: R(d.width), fs: t.fontSize, lh: t.lineHeight.value };
}
const cell = (await g('89:54')).children[0].children[0], ct = (await g('89:36')).children[0].findOne((x) => x.type === 'TEXT');
const hd = (await g('91:223')).children[0].children[0], hl = hd.findOne((x) => x.type === 'TEXT');
const row = (await g('92:236')).children[0].children[0];
const table = { cell: { h: R(cell.height), px: cell.paddingLeft, fs: ct.fontSize, lh: ct.lineHeight.value }, header: { h: R(hd.height), px: hd.paddingLeft, fs: hl.fontSize, lh: hl.lineHeight.value }, row: { h: R(row.height) } };
// Radio, Toggle, Chip (Default state; sizes share geometry across values and states)
const radio = {}; const toggle = {}; const chip = {};
for (const v of (await g('71:207')).children) {
  if (!/Checked=On, State=Default/.test(v.name)) continue;
  const b = v.children[0], box = b.findOne((x) => x.name === 'Box'), t = b.findOne((x) => x.type === 'TEXT');
  radio[sz(v.name)] = { box: R(box.width), dot: R(box.findOne((x) => x.name === 'Dot').width), gap: b.itemSpacing, fs: t.fontSize, lh: t.lineHeight.value };
}
for (const v of (await g('71:437')).children) {
  if (!/Checked=Off, State=Default/.test(v.name)) continue;
  const b = v.children[0], tr = b.findOne((x) => x.name === 'Track'), t = b.findOne((x) => x.type === 'TEXT');
  toggle[sz(v.name)] = { w: R(tr.width), h: R(tr.height), knob: R(tr.findOne((x) => x.name === 'Knob off').width), inset: tr.paddingLeft, gap: b.itemSpacing, fs: t.fontSize, lh: t.lineHeight.value };
}
for (const v of (await g('86:1028')).children) {
  if (!/Status=Neutral, Style=Subtle/.test(v.name)) continue;
  const b = v.children[0], t = b.findOne((x) => x.type === 'TEXT');
  chip[sz(v.name)] = { h: R(b.height), pl: b.paddingLeft, pr: b.paddingRight, gap: b.itemSpacing, radius: b.cornerRadius, icon: R(b.findOne((x) => x.name === 'Icon').width), action: R(b.findOne((x) => x.name === 'Action 2').width), fs: t.fontSize, lh: t.lineHeight.value };
}
// Notice, Toast, Interactive icon, Progress bar, Skeleton, Tooltip, Spinner
const notice = {}, toast = {}, interactiveIcon = {}, progress = {}, skeleton = {}, tooltip = {}, spinner = {};
{
  const nb = (await g('80:246')).children.find((x) => x.name === 'Status=Neutral, Style=Subtle').children[0];
  const nt = nb.findOne((x) => x.name === 'Title'), nm = nb.findOne((x) => x.name === 'Message'), ni = nb.findOne((x) => x.name === 'icon / info');
  notice.default = { h: R(nb.height), icon: R(ni.width), iconLeft: R(ni.x), pt: nb.paddingTop, gap: nb.itemSpacing, radius: nb.cornerRadius, rail: nb.strokeLeftWeight, titleFs: nt.fontSize, titleLh: nt.lineHeight.value, msgFs: nm.fontSize, msgLh: nm.lineHeight.value };
  const tb = (await g('134:168')).children.find((x) => x.name === 'Status=Neutral').children[0], tt = tb.findOne((x) => x.name === 'Text');
  toast.default = { w: R(tb.width), h: R(tb.height), pl: tb.paddingLeft, pr: tb.paddingRight, pt: tb.paddingTop, gap: tb.itemSpacing, radius: tb.cornerRadius, icon: R(tb.findOne((x) => x.name === 'Icon').width), iconLeft: R(tb.findOne((x) => x.name === 'Icon').x), fs: tt.fontSize, lh: tt.lineHeight.value, close: R(tb.findOne((x) => x.name === 'Close').width), rail: R(tb.findOne((x) => x.name === 'Rail').width) };
  for (const v of (await g('83:109')).children) { if (!/State=Default/.test(v.name)) continue; interactiveIcon[sz(v.name)] = { box: R(v.width), icon: R(v.findOne((x) => x.name === 'Icon').width) }; }
  for (const v of (await g('159:474')).children) { const b = v.children[0], row = b.findOne((x) => x.name === 'Label row'), tr = b.findOne((x) => x.name === 'Track'), lb = b.findOne((x) => x.name === 'Label'); progress[sz(v.name)] = { track: R(tr.height), gap: b.itemSpacing, row: R(row.height), fs: lb.fontSize, lh: lb.lineHeight.value }; }
  for (const v of (await g('191:12')).children) { if (!/Pulse=Dim/.test(v.name)) continue; skeleton[v.name.match(/Shape=([A-Za-z ]+),/)[1].toLowerCase().replace('text line', 'text')] = { w: R(v.width), h: R(v.height), radius: v.cornerRadius }; }
  const tp = (await g('133:1284')).children.find((x) => x.name === 'Side=Top'), bub = tp.findOne((x) => x.name === 'Bubble'), bt = bub.findOne((x) => x.type === 'TEXT'), ar = tp.findOne((x) => x.name === 'Arrow');
  tooltip.default = { h: R(bub.height), pl: bub.paddingLeft, pt: bub.paddingTop, radius: bub.cornerRadius, fs: bt.fontSize, lh: bt.lineHeight.value, arrowW: R(ar.width), arrowH: R(ar.height) };
  for (const v of (await g('2270:308')).children) { if (!/Frame=1/.test(v.name)) continue; spinner[sz(v.name)] = { box: R(v.width) }; }
}
// Tabs, Breadcrumb, Pagination, Nav (Default or Selected/Active state; geometry is shared across states)
const tabs = {}, breadcrumb = {}, pagination = {}, nav = {};
{
  const tabItem = (await g('101:1401')).children;
  for (const [key, style] of [['underline', 'Underline'], ['segmented', 'Segmented']]) {
    const v = tabItem.find((x) => x.name === `Style=${style}, State=Selected`), b = v.children[0], t = b.findOne((x) => x.name === 'Label');
    tabs[key] = { h: R(b.height), pl: b.paddingLeft, pr: b.paddingRight, gap: b.itemSpacing, radius: b.topLeftRadius, fs: t.fontSize, lh: t.lineHeight.value };
    if (key === 'underline') { tabs[key].icon = 16; tabs[key].countFs = b.findOne((x) => x.name === 'Count').fontSize; tabs[key].countLh = b.findOne((x) => x.name === 'Count').lineHeight.value; tabs[key].mark = R(b.findOne((x) => x.name === 'Indicator').height); tabs[key].bar = R((await g('101:1508')).children[0].height); }
    else { tabs[key].bar = 42; tabs[key].trackGap = 2; tabs[key].trackRadius = 4; }
  }
  const bc = (await g('104:208')).children[0].children[0], bl = bc.findOne((x) => x.name === 'Label');
  breadcrumb.default = { h: R(bc.height), pl: bc.paddingLeft, pr: bc.paddingRight, gap: bc.itemSpacing, icon: 16, sep: 16, fs: bl.fontSize, lh: bl.lineHeight.value };
  const pn = (await g('133:1207')).children[0].children[0], pt = pn.findOne((x) => x.type === 'TEXT');
  pagination.default = { page: R(pn.width), pageH: R(pn.height), pageRadius: pn.cornerRadius, pageFs: pt.fontSize, pageLh: pt.lineHeight.value, pt: 8, gap: 12, controlsGap: 4, pagesGap: 4, countFs: 12, countLh: 18 };
  const ni = (await g('150:44')).children.find((x) => x.name === 'State=Active').children[0], nl = ni.findOne((x) => x.name === 'Label'), nc = ni.findOne((x) => x.name === 'Count');
  nav.item = { h: R(ni.height), w: R(ni.width), pl: ni.paddingLeft, pr: ni.paddingRight, gap: ni.itemSpacing, icon: R(ni.findOne((x) => x.name === 'Icon').width), fs: nl.fontSize, lh: nl.lineHeight.value, countFs: nc.fontSize, countLh: nc.lineHeight.value, marker: R(ni.findOne((x) => x.name === 'Marker').width), listGap: 2 };
  const rb = (await g('150:69')).children[0].children[0];
  nav.rail = { w: R(rb.width), h: R(rb.height), icon: R(rb.findOne((x) => x.name === 'Icon').width) };
}
return { button, checkbox, input, iconButton, badge, table, radio, toggle, chip, notice, toast, interactiveIcon, progress, skeleton, tooltip, spinner, tabs, breadcrumb, pagination, nav };
