// Gate: colour roles in the repo tokens (DTCG) must equal the roles read from Figma
// (figma/figma-export.json, refreshed by /sync-tokens). Exit 1 on any difference.
import fs from 'node:fs';

const tokens = JSON.parse(fs.readFileSync('packages/tokens/src/tokens.json', 'utf8'));
const figma = JSON.parse(fs.readFileSync('figma/figma-export.json', 'utf8'));

const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), tokens);
const resolve = (v, depth = 0) => {
  if (depth > 8) throw new Error('reference loop');
  const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
  return m ? resolve(get(m[1]).$value, depth + 1) : v;
};

const norm = (h) => String(h).trim().toUpperCase();
// Known, accepted differences: { "<role>": "<why>" }. Anything not listed here fails the gate.
const known = fs.existsSync('figma/known-drift.json')
  ? JSON.parse(fs.readFileSync('figma/known-drift.json', 'utf8')) : {};

// Figma export keys -> DTCG path. Colours are "group/name"; scales are "spacing-8", "radius-md-8", "container-notice".
const toPath = (role) => {
  if (role.startsWith('spacing-')) return 'spacing.' + role.slice('spacing-'.length);
  if (role.startsWith('container-')) return 'container.' + role.slice('container-'.length);
  if (role.startsWith('radius-')) return 'radius.' + role.slice('radius-'.length);
  if (/^(size|line|track|weight|face)\//.test(role)) { const [g, n] = role.split('/'); return 'type.' + ({ size: 'fs', line: 'line', track: 'track', weight: 'weight', face: 'font' })[g] + '-' + n; }
  if (role.startsWith('state-')) return 'state.' + role.slice('state-'.length).split('/').join('.');
  if (role.startsWith('stroke/')) return 'stroke.' + role.slice('stroke/'.length);
  return 'colour.' + role.split('/').join('.');
};
const sameValue = (a, b) => typeof a === 'number' || typeof b === 'number'
  ? Number(a) === Number(b) : norm(a) === norm(b);

const problems = [];
const accepted = [];
const report = (role, msg) => (role in known ? accepted.push(`${role}: ${known[role]}`) : problems.push(`${role}: ${msg}`));
let checked = 0;
for (const [role, val] of Object.entries(figma.roles)) {
  const node = get(toPath(role));
  if (!node) { report(role, 'in Figma, missing in repo tokens'); continue; }
  const got = resolve(node.$value);
  checked++;
  if (!sameValue(got, val)) report(role, `Figma ${val}, repo ${got}`);
}
// And the other way: type tokens in the repo that Figma does not have.
const typeFromFigma = new Set(Object.keys(figma.roles).filter((r) => /^(size|line|track|weight|face)\//.test(r)).map(toPath));
for (const key of Object.keys(tokens.type)) if (!key.startsWith('$') && !typeFromFigma.has('type.' + key)) report('type/' + key, 'in repo tokens, missing in Figma');
// And colour roles in the repo that Figma does not have.
const walk = (o, p = []) => Object.entries(o).flatMap(([k, v]) =>
  k.startsWith('$') ? [] : '$value' in v ? [[...p, k].join('/')] : walk(v, [...p, k]));
for (const role of walk(tokens.colour)) {
  if (!(role in figma.roles)) report(role, 'in repo tokens, missing in Figma');
}

if (problems.length) {
  console.error(`tokens-drift: ${problems.length} problem(s)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`tokens-drift: OK (${checked} roles match Figma export of ${figma.exported}` +
  (accepted.length ? `; ${accepted.length} known: ${accepted.join(' | ')}` : '') + ')');
