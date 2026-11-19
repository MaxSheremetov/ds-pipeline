// Gate: axe-core (WCAG 2.0, 2.1 and 2.2 level A and AA, plus best practices) on every story of the built Storybook,
// in the light colour scheme and in forced-colors mode, and no play function may throw.
// Needs Playwright + Chromium, axe-core and a built Storybook (apps/storybook/storybook-static). Skips with a message if they are missing.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve('apps/storybook/storybook-static');
if (!fs.existsSync(root)) { console.log('a11y: SKIPPED (storybook-static not built)'); process.exit(0); }
const require = createRequire(import.meta.url);
let chromium, axeSrc;
try { ({ chromium } = require('playwright')); axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'); }
catch { console.log('a11y: SKIPPED (playwright or axe-core not installed)'); process.exit(0); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

// Known, accepted results: { "<story id>": "<why>" } (whole story) or { "<story id>#<rule>": "<why>" }.
const known = fs.existsSync('figma/known-a11y.json') ? JSON.parse(fs.readFileSync('figma/known-a11y.json', 'utf8')) : {};
const index = JSON.parse(fs.readFileSync(path.join(root, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story').map((e) => e.id);

const browser = await chromium.launch();
const problems = []; const accepted = []; let checked = 0;
const modes = [['light', {}], ['forced-colors', { forcedColors: 'active' }]];

async function run(id, [mode, media], page) {
  await page.emulateMedia({ forcedColors: media.forcedColors || 'none', colorScheme: 'light' });
  await page.addInitScript(() => { window.__ev = []; const iv = setInterval(() => { const ch = window.__STORYBOOK_ADDONS_CHANNEL__; if (ch) { clearInterval(iv); ['playFunctionThrewException', 'storyThrewException', 'storyErrored', 'storyMissing'].forEach((e) => ch.on(e, (a) => window.__ev.push(e + ': ' + String((a && (a.message || a.id)) || '').slice(0, 200)))); } }, 5); });
  await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`);
  await page.waitForSelector('#storybook-root > *, .sb-show-errordisplay', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(700);
  await page.evaluate((s) => { if (!window.axe) { const e = document.createElement('script'); e.textContent = s; document.head.appendChild(e); } }, axeSrc);
  // axe does not model system colours, so colour contrast is checked in the light mode only (the contrast gate and the forced-colors gate cover the rest).
  const res = await page.evaluate(async (isForced) => {
    // The Storybook a11y addon may be running axe on the same page; wait for it.
    // Open Radix overlays render in a portal outside the story root: check those too.
    const ctx = ['#storybook-root', ...['[role="dialog"]', '[role="tooltip"]', '[role="listbox"]'].filter((q) => document.querySelector(q) && !document.querySelector('#storybook-root').contains(document.querySelector(q)))];
    let r; for (let i = 0; i < 20; i++) { try { r = await window.axe.run(ctx.length > 1 ? { include: ctx.map((q) => [q]) } : (document.querySelector('#storybook-root') || document), {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      rules: { region: { enabled: false }, 'landmark-one-main': { enabled: false }, 'page-has-heading-one': { enabled: false }, 'color-contrast': { enabled: !isForced } },
    }); break; } catch (e) { if (!/already running/.test(String(e.message))) throw e; await new Promise((ok) => setTimeout(ok, 400)); } }
    return { v: r.violations.map((x) => ({ id: x.id, n: x.nodes.length, html: x.nodes[0].html.slice(0, 140), msg: (x.nodes[0].any[0] || x.nodes[0].all[0] || x.nodes[0].none[0] || {}).message })), ev: window.__ev };
  }, !!media.forcedColors);
  const out = [];
  for (const e of res.ev) out.push(`${id} [${mode}]: ${e}`);
  for (const x of res.v) out.push(`${id} [${mode}] ${x.id} x${x.n}: ${x.msg} | ${x.html}`);
  return out.map((line) => ({ line, rule: (/\] ([a-z-]+) x\d/.exec(line) || [])[1] }));
}

const queue = [...stories]; const workers = [];
for (let w = 0; w < 4; w++) workers.push((async () => {
  while (queue.length) {
    const id = queue.shift();
    for (const m of modes) {
      const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
      try {
        checked++;
        let results = await run(id, m, page);
        // A play function can time out when four browsers share a slow machine: look once more, alone on a fresh page, before calling it a finding.
        if (results.some((r) => /playFunctionThrewException/.test(r.line))) { const again = await browser.newPage({ viewport: { width: 900, height: 700 } }); try { results = await run(id, m, again); } finally { await again.close(); } }
        for (const { line, rule } of results) {
          const k = known[id] ? id : known[`${id}#${rule}`] ? `${id}#${rule}` : null;
          if (k) accepted.push(`${k}: ${known[k]}`); else problems.push(line);
        }
      } catch (e) { problems.push(`${id} [${m[0]}]: ${String(e.message).split('\n')[0]}`); }
      await page.close();
    }
  }
})());
await Promise.all(workers);
await browser.close(); server.close();
if (problems.length) { console.error(`a11y: FAILED (${problems.length} finding(s) in ${stories.length} stories)\n  ` + problems.sort().join('\n  ')); process.exit(1); }
console.log(`a11y: OK (${stories.length} stories x light and forced-colors, axe WCAG 2.2 AA + best practice${accepted.length ? `, ${accepted.length} accepted` : ''})`);
