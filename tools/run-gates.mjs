// Runs every gate, prints one report, exits non-zero if any gate fails.
import { spawnSync } from 'node:child_process';
const gates = ['check-tokens-drift', 'check-component-tokens', 'check-contrast', 'check-spec-drift', 'check-manifest', 'check-raw-values', 'check-typecheck', 'check-forced-colors', 'check-figma-metrics', 'check-motion', 'check-a11y'];
let failed = 0;
for (const g of gates) {
  const r = spawnSync('node', [`tools/${g}.mjs`], { encoding: 'utf8' });
  process.stdout.write(r.stdout); process.stderr.write(r.stderr);
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n${failed} gate(s) FAILED` : '\nall gates passed');
process.exit(failed ? 1 : 0);
