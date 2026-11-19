// Gate: component tokens in the repo (aliases) resolve to the same colour Figma shows for them.
import fs from 'node:fs';
const tokens = JSON.parse(fs.readFileSync('packages/tokens/src/tokens.json', 'utf8'));
const comps = JSON.parse(fs.readFileSync('packages/tokens/src/components.json', 'utf8'));
const figma = JSON.parse(fs.readFileSync('figma/figma-components.json', 'utf8'));
const get = (p) => p.split('.').reduce((o, k) => (o ? o[k] : undefined), tokens);
const resolve = (v) => { const m = typeof v === 'string' && v.match(/^\{(.+)\}$/); return m ? resolve(get(m[1])?.$value) : v; };
const problems = [];
let n = 0;
for (const [name, t] of Object.entries(figma.tokens)) {
  const [, comp, key] = name.split('/');
  const node = comps.component?.[comp]?.[key];
  if (!node) { problems.push(`${name}: in Figma, missing in repo`); continue; }
  n++;
  if (/transparent$/.test(t.via)) continue; // alpha is not in the hex we read
  const got = resolve(node.$value);
  if (String(got).toUpperCase() !== t.v.toUpperCase()) problems.push(`${name}: Figma ${t.v} via ${t.via}, repo ${got}`);
}
for (const comp of Object.keys(comps.component))
  for (const key of Object.keys(comps.component[comp]))
    if (!figma.tokens[`components/${comp}/${key}`]) problems.push(`components/${comp}/${key}: in repo, missing in Figma`);
if (problems.length) { console.error(`component-tokens: ${problems.length} problem(s)\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`component-tokens: OK (${n} tokens match Figma)`);
