// Gate: no raw colours or pixel sizes in packages/ui. Everything comes from tokens (var(--ds-*)).
import fs from 'node:fs';
import path from 'node:path';

const root = 'packages/ui';
const ALLOW_PX = new Set(['0px', '1px']); // hairlines are a token too, but 0 and 1 are never "design values"
const files = [];
const walk = (d) => { if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== 'dist') walk(p); }
    else if (/\.(css|tsx|ts)$/.test(e.name) && !/\.(stories|test)\./.test(e.name)) files.push(p);
  } };
walk(root);

const problems = [];
for (const f of files) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g))
      problems.push(`${f}:${i + 1} raw colour ${m[0]}`);
    for (const m of code.matchAll(/(?<![\w.-])-?\d*\.?\d+px\b/g))
      if (!ALLOW_PX.has(m[0])) problems.push(`${f}:${i + 1} raw size ${m[0]}`);
  });
}
if (problems.length) { console.error(`raw-values: ${problems.length} problem(s)\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`raw-values: OK (${files.length} files scanned)`);
