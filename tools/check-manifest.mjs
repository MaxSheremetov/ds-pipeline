// Gate: the Storybook components manifest (what agents read through the MCP server) is complete:
// no docgen error, a description, and every prop documented. Needs `npm run storybook:build` first.
import fs from 'node:fs';
const file = 'apps/storybook/storybook-static/manifests/components.json';
if (!fs.existsSync(file)) { console.error(`manifest: ${file} not found, run npm run storybook:build first`); process.exit(1); }
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
const problems = []; let n = 0;
for (const c of Object.values(m.components)) {
  n++;
  if (c.error) { problems.push(`${c.name}: ${c.error.name}`); continue; }
  if (!c.description?.trim()) problems.push(`${c.name}: no description (add a JSDoc comment above the story meta)`);
  if (!c.stories?.length) problems.push(`${c.name}: no stories`);
  const props = c.reactDocgen?.props ?? {};
  const own = Object.entries(props).filter(([, p]) => !/node_modules/.test(p.parent?.fileName ?? ''));
  for (const [k, p] of own) if (!p.description?.trim() && !['className', 'style'].includes(k)) problems.push(`${c.name}.${k}: prop has no description`);
}
if (problems.length) { console.error(`manifest: ${problems.length} problem(s)\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`manifest: OK (${n} component(s) fully documented)`);
