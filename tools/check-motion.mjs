// Gate: every component stylesheet that moves (transition or animation) must also handle prefers-reduced-motion.
import fs from 'node:fs';
import path from 'node:path';

const root = 'packages/ui/src';
const files = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())
  .flatMap((d) => fs.readdirSync(path.join(root, d.name)).filter((f) => f.endsWith('.css')).map((f) => path.join(root, d.name, f)));
const problems = []; let moving = 0;
for (const f of files) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const moves = /(^|[\s;{])(transition|animation)\s*:/.test(css);
  if (!moves) continue;
  moving++;
  if (!/prefers-reduced-motion\s*:\s*reduce/.test(css)) problems.push(`${f}: has transition or animation but no prefers-reduced-motion block`);
}
if (problems.length) { console.error('motion: FAILED\n  ' + problems.join('\n  ')); process.exit(1); }
console.log(`motion: OK (${files.length} stylesheets, ${moving} with motion, all handle reduced motion)`);
