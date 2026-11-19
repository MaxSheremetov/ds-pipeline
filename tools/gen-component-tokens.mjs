// figma/figma-components.json -> packages/tokens/src/components.json (DTCG, aliases to role tokens).
// A component token is an alias: components/button/bg-primary-default -> {colour.action.default}.
import fs from 'node:fs';
const src = JSON.parse(fs.readFileSync('figma/figma-components.json', 'utf8'));
const out = { component: {} };
for (const [name, t] of Object.entries(src.tokens)) {
  const [, comp, key] = name.split('/');
  (out.component[comp] ??= {})[key] = { $type: 'color', $value: `{colour.${t.via.split('/').join('.')}}` };
}
fs.writeFileSync('packages/tokens/src/components.json', JSON.stringify(out, null, 2) + '\n');
console.log(`component tokens: ${Object.keys(src.tokens).length} written`);
