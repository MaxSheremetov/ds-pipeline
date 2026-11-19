# ds-pipeline: architecture (draft 2, 2026-11-18)

A reusable pipeline in which the DESIGNER builds and owns the UI library: Figma file, tokens, React components, Storybook, and the prototypes that Claude assembles from those real components.
First proof: Northgate (the finished box). Stack for now: React only. Context: a teaching lab, so strictness is "clear and checkable", not "enterprise release process".

## 1. Principles
1. **Designer-owned.** Visual and API decisions are made in Figma and Specs; code is generated and reviewed by the designer with Claude. Developers consume the package.
2. **Tokens first.** Every value in code comes from a token. No raw colours, sizes, radii. A gate fails the build otherwise.
3. **AI-readable.** Everything Claude needs is in files it can read: CLAUDE.md, specs, the Storybook component manifest, the token JSON. Nothing important lives only in a chat or in someone's head.
4. **Host-agnostic.** Nothing depends on GitHub or Azure DevOps (section 4).
5. **Checked, not trusted.** Every rule that was learned the hard way becomes a gate (the lab already has ~15 of them for Figma files).

## 2. Layers (one direction: top feeds bottom)
| # | Layer | Source of truth for | Lives in |
|---|-------|---------------------|----------|
| 0 | Figma Specs | intent: why, behaviour, edge cases, acceptance | Figma, mirrored to `specs/` at each release |
| 1 | Figma file | look: components, states, variables | Figma (file key in `figma/system.json`) |
| 2 | Tokens | values | `packages/tokens` (DTCG JSON -> Style Dictionary -> CSS variables) |
| 3 | UI library | behaviour and markup | `packages/ui` (React; headless primitives for behaviour, our tokens for look) |
| 4 | Storybook | the catalogue and the machine-readable manifest | `apps/storybook` (static build) |
| 5 | Prototype kit | assembled screens | `prototypes/` (Claude Code in the repo; a bundled kit for artifacts later) |
| 6 | Gates | the rules | `tools/` |

Two sources of truth would be a trap, so each fact has exactly one owner: values -> Figma variables; intent -> Specs; look of a component -> Figma component, verified against the story by a visual check; behaviour -> the code and its tests.

## 3. Repo layout
```
ds-pipeline/
  README.md  CLAUDE.md  ARCHITECTURE.md  DECISIONS.md  CHANGELOG.md
  figma/            system.json (file key, version), figma-export.json, tokens.json (DTCG)
  specs/            system.md  components/<name>.md  features/<name>.md  (each with spec-id + revision)
  packages/tokens/  build config, generated css, generated ts
  packages/ui/      <Component>/ <Component>.tsx  .stories.tsx  .spec.md (link)  .test.tsx
  apps/storybook/   .storybook/  (static build output: storybook-static/)
  prototypes/       kit/  examples/
  tools/            gates (drift, a11y, raw-values, spec-drift, manifest)  figma-sync
  deploy/           github-pages.yml  azure-pipelines.yml  (thin adapters)
  method/           how a new system is created (from the lab: fasttrack, AUTONOMY lessons)
```

## 4. Portability rules (GitHub <-> Azure DevOps)
1. **All logic is in npm scripts**, never in CI YAML. `npm run ci` runs install, gates, build. A CI file only calls it.
2. **CI files are thin adapters** under `deploy/`, about ten lines each. Switching host = copy one adapter into the host's expected place.
3. **Static output only.** `storybook-static/` is a plain folder; any static host serves it.
4. **No host features in the repo content:** no `owner/repo#12` issue links, no Actions marketplace steps, no host-specific badges in docs. Links in docs are relative.
5. **Configuration by environment variables** (base URL, Figma token); no secrets in files. Names are identical on both hosts.
6. **Plain git, linear history, tags for versions** (`v0.3.0`). Moving = `git remote set-url`, push branches and tags.
7. **No package registry in the lab.** Consumers use the workspace or a git dependency; a registry is added only if a real product consumes the library.
8. **Changelog and versions live in files** (`CHANGELOG.md`, `figma/system.json`), not in release pages of a host.

## 5. Figma Specs in the chain
Specs (open beta) is a markdown surface in Figma that agents can read and update through the Figma MCP. Three kinds of spec:
- **System spec** (`specs/system.md`): principles, token rules, accessibility floor, the 12 structure options, the lessons of the lab. Claude reads it before any work.
- **Component spec** (`specs/components/<name>.md`): purpose, anatomy, variants and states, behaviour and keyboard, content rules, edge cases, **acceptance checks**. The checks become story play-tests and a11y tests.
- **Feature spec** (`specs/features/<name>.md`): goal, flow, business rules, empty and error states, copy, acceptance. Claude builds a prototype from Storybook components and reports against the acceptance list.

Versioning: each spec carries `spec-id` and `revision`. A component records the revision it implements; the `spec-drift` gate says "spec is newer than code". Specs are written in Figma and mirrored into `specs/` at release, so the repo always holds the revision an agent actually read.

## 6. Commands (Claude skills in `.claude/`)
- `/new-system`: create a system from a Figma file (the lab's method, automated).
- `/sync-tokens`: Figma variables -> DTCG -> CSS, as a reviewable change.
- `/new-component`: spec -> component -> stories -> tests -> manifest entry.
- `/check`: all gates, one report.
- `/release`: bump the version, update CHANGELOG, build the static Storybook.
- `/prototype`: build a screen from a feature spec using only library components.

## 7. Gates
tokens drift (Figma vs generated), no raw values in `packages/ui`, a11y (axe) on every story, contrast of token pairs, manifest complete (every component has props docs and stories), spec drift, visual check (added later; Chromatic is an option, not a requirement), and the Figma-file gates the lab already runs.

## 8. Versioning (lab grade)
Semver per system, bumped by `/release`. Breaking = a token renamed or a prop removed. `CHANGELOG.md` is generated from the commits since the tag. "Which is the latest?" is answered by `figma/system.json` and the newest tag.

## 9. Plan
**Phase 1, proof on Northgate (3 components: Button, Input, Table).** Success = (a) tokens flow Figma -> CSS with no hand edits; (b) each component has a spec, a story and tests; (c) the manifest is readable through the Storybook MCP; (d) Claude builds one screen from a feature spec using only those components; (e) a gate catches a deliberate raw value and a deliberate spec drift.
**Phase 2, extract the template** (`/new-system` on a second box, Rove or Lumo). **Phase 3, coverage** of the remaining components with the proven loop.

### Phase 1 status (2026-11-18)
Done for Button, Input, Table, Icon, Icon button, Badge, Checkbox and Select, plus Foundations pages (colour, type, spacing, shape, elevation, state) as the first thing in Storybook: (a) tokens Figma -> DTCG -> CSS with no hand edits (109 roles, 284 component tokens: Button 41, Input 60, Table 42, Checkbox 25, Badge 60, Menu 36, all matched against the Figma export; Icon button reuses Button); (b) each has a spec in Figma Specs (button r6, input r3, table r3, icon r1, icon-button r1, badge r1, checkbox r2, select r3; keys in `figma/system.json` specFiles), a React component, stories, tests (69), accessibility checks; (c) the manifest with props is served by the Storybook MCP server (7 tools) and checked by a gate; (e) gates caught a deliberate token change, a raw colour and size (it also caught a raw 1px in Table), and a spec newer than code.
Gates: tokens-drift, component-tokens, contrast (349 pairs, incl. every Tab, Page number, Breadcrumb and Nav label and one finding accepted in figma/known-contrast.json, incl. Radio border, Toggle track and knob, 45 Chip combinations with the remove-button overlay, menu options, the menu edge, the multiple-selection box and tick, and the Select chevron, incl. 45 badge combinations, checkbox mark, border and label, hover, pressed, labels, hints, borders, every table ink on every row background), spec-drift, manifest, raw-values, typecheck (tsc over components, stories, tests), forced-colors (Windows high contrast, Playwright), figma-metrics (computed box, padding, radius, gap and type metrics against `figma/metrics.json` read from Figma; Button, Checkbox, Select, Input, Icon button, Badge, Table, Radio, Toggle and Chip, 357 values), motion (every stylesheet with a transition or animation handles prefers-reduced-motion), a11y (every story, light and forced-colors, through axe-core: WCAG 2.2 A/AA and best practice; also fails on exceptions in play functions; accepted findings are listed with a reason in `figma/known-a11y.json`).
Accessibility found real defects by check, not by eye: Solid Badge text 2.5:1 and a Badge with no fill, border or padding in Figma (fixed in Figma); Button Danger hover 4.39 and pressed 4.07 (fixed in code and Figma). Figma vs Storybook compared for all three components by screenshot and DOM metrics; fixes went to Figma first when Figma was wrong (Table header focus ring height; Small label size 11 for Input and Select).
(d) done 2026-11-18: feature spec `specs/features/transfer-between-accounts.md`, a screen built from the library through the Storybook MCP only (story Prototypes / Transfer between accounts, four play-function scenarios from the acceptance list, axe clean in three states), a build report with the gaps (Notice, empty state, page and form layout) and doc defects found; a client with no repo files and the Claude CLI from an empty directory both connect to the MCP server.
Not done: a screen built by a second agent from the report alone; the missing components above.
Lessons: the Figma component is the truth, not the lab CSS; a hand-made spec disagreed with Figma until compared; component tokens are aliases to role tokens; react-docgen reads forwardRef; contrast must be checked in hover and pressed too; measure with the browser's resolved colours (my first script misread `color(srgb ...)`); focus ring placement depends on context (outside with free space, inside in flush grids).

## 10. Open items and risks
- Storybook's MCP and manifest features are in preview and React-first; the API may change.
- Specs through the MCP: **verified 2026-11-17 (step 0)**. Through `use_figma` and `figma.spec.*` we can create a standalone spec (`create_new_file`, editorType `figspec`), read it as markdown, replace it, edit it surgically, and create and read anchored comments. Test file: Lab · ds-pipeline · Specs test (key p4tYHvIDOvmvit231kIeni). API: `figma.spec.getContent()` returns an object `{markdown, specNodeId, ...}`, `figma.spec.setContent({content: markdown})` replaces it. One standalone spec file per component (keys in `figma/system.json` specFiles). Quirks: (1) right after an edit, a comment in the same script fails with "anchor is stale", so comment in a separate call; (2) comments insert `[comment:uuid]` markers into the markdown, so the repo mirror must strip them; (3) tables come back normalised (`|---|---|`); (4) a spec is created in the plan chosen at creation (here a company org, because the personal plan has a View seat). Not tested: embedded specs inside a Design file, and Specs on Figma branches.
- Complex behaviour (Date picker, Modal focus, Select menu) comes from headless primitives (Radix or React Aria); the designer owns styling and the contract, not the keyboard handling.
- Repo host: GitHub (decided 2026-11-19); section 4 keeps the choice reversible.
- A bundled prototype kit for Claude artifacts (single page) is a separate piece of work, after Phase 1.

## 11. What we reuse
`shared/build.py` and the generated CSS as the reference look; `check_drift` and the Figma gates; `figma-export.json`; the lessons in `AUTONOMY.md`; the per-component documentation and accessibility tables as the seed of the specs.


Step 2 of the component order done 2026-11-18: Radio (with RadioGroup), Toggle (role switch) and Chip (status tag with a remove button). Specs `specs/components/{radio,toggle,chip}.md` mirrored to Figma Specs (keys in `figma/system.json`), 92 tests, 10 gates green.

Step 3 done 2026-11-18 (container size tokens, Chip r2 and the Notice and Toast fixes added the same day): Interactive icon (shared, used by Chip, Notice and Toast), Notice, Toast, Spinner (now also the Button loading icon), Progress bar, Skeleton and Tooltip (Radix). Specs `specs/components/{interactive-icon,notice,toast,spinner,progress-bar,skeleton,tooltip}.md` mirrored to Figma Specs (keys in `figma/system.json`). 18 components, 319 contrast pairs, 302 Figma values, forced-colors checks for notice, toast, progress bar, spinner and tooltip. The Transfer screen now shows its success message with Notice.

Step 4 done 2026-11-18: Tabs (Tab item in three styles, the bar and the Segmented control, on Radix Tabs), Breadcrumbs, Pagination (count, Previous, Next, a page run of constant length) and Nav (Nav item, Nav rail item with a tooltip, and the nav landmark). 58 new component tokens (components/tab, nav, breadcrumb), container-nav (248) added to Figma and the repo, four new Figma Specs files. Open questions for the designer are written in each spec (Segmented Default contrast, Disabled tab look, Nav rail marker on every state, marker width 3, Breadcrumb Current weight). The accessibility gate now has 5 accepted findings (the Select menu and the Segmented contrast).

Step 4 decisions (2026-11-18, specs tabs, nav and breadcrumb at r2): Segmented label text/primary; Disabled tab is a surface/sunken fill with text/dim (no opacity); the Nav rail marker is drawn on the active item only; the Nav active fill is action/default with the marker in border/action; the Breadcrumb Current crumb is SemiBold. All changed in Figma first, then tokens and code; the two accepted contrast and a11y exceptions for Segmented are gone.

Step 5 done 2026-11-18: Modal, Drawer (Radix Dialog) and Popover (Radix Popover), sharing internal Overlay parts, with container size tokens (modal-small/medium/large, drawer, popover) in Figma and code. Specs `specs/components/{modal,drawer,popover}.md` mirrored to Figma Specs (keys in `figma/system.json`). 25 components, 465 Figma values, 182 tests, a11y gate extended to portal overlays. Nav active label and count are SemiBold (nav spec r3).

Step 5 decisions (2026-11-18, specs modal, drawer and popover at r2): footer actions right-aligned (Figma first), optional title icon on Modal and Drawer, scrim confirmed as already drawn in Figma (text/primary 40%), initial focus on Close kept, bottom Drawer spans the viewport, Chip Small stays Regular. Breadcrumb overflow collapse is planned, not built.

Step 6 done 2026-11-18: Card, Avatar, Stat, Empty state, Stepper, Accordion (Radix), Dropzone, File row and the Day cell, each with a spec (r1) mirrored to Figma Specs. 34 components, 498 Figma values, 247 tests, 197 stories in the a11y gate, contrast 415 pairs. New container tokens: stepper-disc, day-width, day-height, empty-text. Calendar grids (Date picker, Date range) are the next step. Open designer questions are in each spec under "Open questions for the designer".

Step 7 done 2026-11-18: Date picker and Date range on the Day cell, through one internal calendar with grid keyboard behaviour and no date library (dates are ISO text). Specs `specs/components/{date-picker,date-range}.md` mirrored to Figma Specs. 36 components, 515 Figma values, 277 tests, 206 stories in the a11y gate. The Figma Date range panel was corrected to hug its months (618).

Step 7 r2 (2026-11-19): calendars reserve six rows, Date range previews its end on hover/focus, shows Outside days, ships default shortcuts. Specs date-picker and date-range at r2.

Breadcrumb overflow done 2026-11-19 (breadcrumb spec r3): collapsed trail with an ellipsis button that opens the hidden crumbs in a Popover. Overflow crumb drawn in Figma by Claude, waiting for designer review.

Repo host decided 2026-11-19: GitHub (adapter `deploy/github-pages.yml`, not yet run on the host). `playwright` is now a root devDependency so the gates run in CI.
