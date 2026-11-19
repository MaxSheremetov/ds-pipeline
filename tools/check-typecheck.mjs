// Gate: TypeScript is clean for components, stories, tests and the Foundations pages.
import { spawnSync } from 'node:child_process';
const r = spawnSync('npx', ['--no-install', 'tsc', '-p', 'tsconfig.typecheck.json'], { encoding: 'utf8' });
const out = (r.stdout + r.stderr).trim();
if (r.status !== 0) { const n = out.split('\n').filter((l) => /error TS/.test(l)).length; console.error(`typecheck: ${n} error(s)\n${out.split('\n').slice(0, 25).join('\n')}`); process.exit(1); }
console.log('typecheck: OK');
