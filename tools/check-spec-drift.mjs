// Gate: every component declares the spec revision it implements (`@spec <id> r<N>` in its .tsx),
// and that must equal the revision in the mirrored spec (specs/components/*.md).
// The mirror itself is refreshed from Figma Specs by /sync-specs; this gate only compares repo files.
import fs from 'node:fs';
import path from 'node:path';

const specs = {};
for (const f of fs.readdirSync('specs/components')) {
  const md = fs.readFileSync(path.join('specs/components', f), 'utf8');
  const id = md.match(/\*\*spec-id\*\*\s*\|\s*([^\s|]+)/)?.[1];
  const rev = Number(md.match(/\*\*revision\*\*\s*\|\s*(\d+)/)?.[1]);
  const status = md.match(/\*\*status\*\*\s*\|\s*([^\s|]+)/)?.[1];
  if (!id || !rev) { console.error(`spec-drift: ${f} has no spec-id or revision`); process.exit(1); }
  specs[id] = { rev, status, file: f, marker: /\[\/?comment:/.test(md) };
}
const problems = []; const seen = new Set();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) return walk(p);
  if (!/\.tsx$/.test(e.name) || /\.(stories|test)\./.test(e.name)) return;
  const m = fs.readFileSync(p, 'utf8').match(/@spec\s+(\S+)\s+r(\d+)/);
  if (!m) return;
  seen.add(m[1]);
  const s = specs[m[1]];
  if (!s) problems.push(`${p}: declares ${m[1]} but no such spec is mirrored`);
  else if (s.rev !== Number(m[2])) problems.push(`${p}: implements ${m[1]} r${m[2]}, spec is at r${s.rev}${s.rev > Number(m[2]) ? ' (spec is newer than code)' : ''}`);
});
walk('packages/ui/src');
for (const [id, s] of Object.entries(specs)) {
  if (!seen.has(id)) problems.push(`${s.file}: spec ${id} has no component declaring it`);
  if (s.marker) problems.push(`${s.file}: contains [comment:] markers, strip them when mirroring`);
}
if (problems.length) { console.error(`spec-drift: ${problems.length} problem(s)\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`spec-drift: OK (${Object.keys(specs).length} spec(s), all implemented at the mirrored revision)`);
