# Decisions

Each line: date, decision, who, why. Newest first.

- 2026-11-18, Button label size: Large 14 (size/body), Medium 12 (size/meta), Small 11 (size/micro); line heights from the type scale (22, 18, 16). Maksim. Why: 11px on every size was small and did not match Input.
- 2026-11-18, Button heights bound to spacing-40, spacing-32, spacing-24 in Figma. Maksim. Why: height was the only layout value not tied to a token.
- 2026-11-18, Focus ring is outside the control with a 2px gap, 2px wide, border/focus for every variant, in Button and Icon button. Maksim agreed. This replaces lab decision D3 for Northgate (2px inside). Why: an inside ring covers the border and, on Danger, was hard to see. Open: update the lab detector `rings` in check_instances.js and D3 in DECISIONS (lab), and decide whether the other boxes follow.
- 2026-11-17, Figma is the source of truth for values and component looks; the repo follows. Spec and code declare the revision they implement.

## 2026-11-18: Danger button overlay is dark (accessibility)
Found by axe on the States story: white label on the Danger fill dropped to 4.39 (hover) and 4.07 (pressed) because the press overlay was a light colour (surface-raised) mixed into a mid-tone red. Default was 5.11. Code now uses the dark overlay (text-primary) for Danger, which darkens the fill and raises contrast. The contrast gate now also checks hover and pressed (18 pairs).
Figma updated the same day: Press overlay on all 18 Danger variants is bound to text/primary, so Figma and code agree.

## 2026-11-18: Fields use the outside focus ring too
Decision (Maksim): Input and Select follow Button: ring 2px outside the field with a 2px gap, radius +4 (radius-md-8, radius-sm-6 for Small), colour border/focus. Done in Figma (the base components _Input base and _Select base, so every variant follows) and in Input code; spec northgate/input is r2. The ring is absolutely positioned, so layout does not move; it leaves 2px between the ring and the label above and the hint below. Select code does not exist yet and will start from this.
Other Input gaps noted for later: no leading/trailing icon slots (icon tokens exist), no required/optional marker, no error icon (colour is backed by the message text, so not colour-only).

## 2026-11-18: Small field label steps down to 11px
Suggested by Maksim after reviewing Storybook: the 12px uppercase label with tracking outweighed the 12px value in Small. Small Input and Select label is now 11/16 (size/micro, line/micro); Large and Medium stay 12/18. Hint stays 12 in every size so error messages do not get smaller. Done in _Input base and _Select base in Figma (Small field block 72 -> 70) and in Input code; spec northgate/input r3.

## 2026-11-18: Table, first release
- Scope r1: Table, header cells with sort, rows (zebra, hover, selected, focus for activatable rows), typed cells. Out: checkbox selection, expansion, bulk actions, filter, resize, density (Checkbox component is not built yet).
- Table keeps the INSIDE focus ring (2px, over the header cell or the whole row). Rows and header cells touch each other, so an outside ring with a gap would overlap neighbours. This is the one place the outside-ring rule from Button and fields does not apply; the rule is: ring outside when the control has free space around it, inside when it sits in a flush grid.
- Figma fix: the focus ring of Table header cell was 32 high on a 40 cell; now full cell (all 6 Focus variants).
- API: composable (Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell), not a data-driven props table, so cells can hold links, badges and actions. The table never sorts itself; the product passes sort state.
- DECIDED 2026-11-18 (spec r2): Number is the text face with equal-width digits, not mono; the Figma Cell text description is corrected. Link in a cell keeps its underline (colour is not the only signal); Figma Cell text Kind=Link is underlined to match.

## 2026-11-18: Foundations, Icon, Icon button, Badge, Checkbox, Table r3
- Storybook now opens with Foundations (Colour, Typography, Spacing/shape/state), generated from tokens.json so they cannot drift. They are tagged out of the component manifest. Swatch hex labels sit on a neutral chip: mid-tone fills fail contrast with either ink.
- Icon: the 140 Figma icons as Lucide glyphs in a registry; sizes 12/16/20/24 from spacing tokens; stroke stays 1.5 at every size (non-scaling stroke). Decorative icons are aria-hidden; a label makes one an image.
- Icon button reuses the Button CSS and tokens (square), so variants and states cannot drift from Button. The accessible name is a required prop and also the tooltip.
- Badge, Figma fix 1: the public Badge had no fill, border or padding, so Subtle, Outline and Solid looked identical and Solid was invisible. Fill and stroke are now bound to components/status/* in all 45 variants. Padding 8/6/4 (Large/Medium/Small) is my choice, to confirm.
- Badge, Figma fix 2: Solid text was text/on-action on status colours, 2.5:1. Fg, dot, body and overlay of every Solid are now surface/raised (5.5:1 and up).
- Checkbox: focus ring moved OUTSIDE (2 ring, 2 gap) in Figma and code, like Button, Icon button, Input, Select (decided 2026-11-18). Mark made bigger: 16/12/10 for Large/Medium/Small (was 12/10/8), spec r2. Badge paddings 8/6/4 confirmed.
- Checkbox without a visible label must have aria-label and should be Large (24 = WCAG 2.2 minimum target).
- Table r3: selection column (40 wide, Large checkbox, select-all with Mixed), TableCellContent and TableActions for icons, badges, buttons in cells; clicks on a checkbox or action never activate the row. Badges in zebra rows are Outline.
- Spec files: one Figma spec per component (icon, icon-button, badge, checkbox added), listed in figma/system.json.

## 2026-11-18: Forced-colors fixes and two new gates
- Windows high contrast: Checkbox tick/dash and Badge dot use CanvasText/GrayText, Input disabled/placeholder use GrayText, Table selected row uses a Highlight start border (box-shadow is forced to none in this mode, so a shadow marker vanishes).
- New gate `check-typecheck`: tsc over components, stories, tests and Foundations (tsconfig.typecheck.json maps Storybook types, which are not hoisted).
- New gate `check-forced-colors`: Playwright with forcedColors emulation against the built Storybook; skips with a message if Playwright is not installed. CI must install Playwright + Chromium.
- Next: automatic Figma-vs-code metrics comparison; reduced-motion and Button leftovers go together with Select.

## 2026-11-18: Figma-vs-code metrics gate
- `figma/metrics.json` holds geometry read from Figma per size (Button 72 variants and Checkbox 36 variants carry identical geometry in every state, so one entry per size). `tools/figma-metrics-export.js` re-reads it through use_figma.
- `tools/check-figma-metrics.mjs` renders the Sizes stories in Chromium and compares height, padding, gap, radius, font size and line height (Checkbox: box, mark). Not a pixel diff: deterministic, no anti-aliasing noise. Accepted differences go to `figma/known-drift.json` as `metrics/<component>/<size>/<field>`.
- Proven by changing one value in metrics.json: the gate failed with "Figma 6, code 4".
- Checkbox forced-colors check fixed to read the mark from the input's ::after.
- Next: extend metrics to Input, Icon button, Badge, Table; colours stay with the token gates.

## 2026-11-18: Select r1, Button r6, motion gate
- Select: select-only combobox on Radix Select (headless; styles and contract are ours). Field reuses Input (label, field, message, sizes, state tokens components/input/*); menu uses components/menu/* (36 tokens added, 284 total), border/default, radius 8, shadow elevation/lifted. Search in the menu is out of scope for r1 and becomes its own Combobox spec later (decided with Maksim).
- Spec in Figma Specs: https://www.figma.com/spec/kFPqhQZPkST7fKuJCJ1V5G (specFiles key northgate/select).
- Figma fixes made first: Small option label 14 -> 12/18 (Meta style) in the option base, as the Small field.
- Label click only focuses the field (no htmlFor: a label click on a Radix trigger would open the menu).
- A11y: Radix hides the page while the menu is open; the MenuOpen story disables axe aria-hidden-focus with the reason in the story (focus stays inside the menu).
- Accepted: menu edge border/default is below 3:1 on the page; the shadow and the option text carry it. Open point for the designer: change the Figma menu border to border/strong if a stronger edge is wanted.
- Found, not fixed: Figma effect styles "Elevation/2 Lifted" and "Elevation/3 Overlay" have fewer layers than the tokens elevation/lifted and overlay (Figma Lifted is one shadow 0 12 32; the token has three). Select menu follows the token. Needs a decision on which one is right.
- Button r6: height is a minimum (enlarged text grows the button), min width 24, Loading adds a hidden word to the name (prop loadingLabel) and a polite status message.
- New gate check-motion: a stylesheet with transition or animation must have a prefers-reduced-motion block. Proven by adding a transition to Select.css (failed), then reverted.
- Gates now: 10. Contrast 200 pairs. Metrics 66 values (later 147, see below).

## 2026-11-18: Select r2 (alignment, icon, search), metrics for every component
- Menu alignment bug: Radix anchored the menu to the inner trigger, which sat inside the padded field, so the menu was narrower and shifted. The trigger is now the field itself (same box as Input), so the menu is exactly as wide as the field and starts at its left edge. Gap is 8, not 4: the focus ring reaches 4 beyond the border, so 4 made the menu touch the ring. The gate measures left edge, width and gap in the browser (Figma has no menu geometry, the numbers come from the spec).
- Leading icon: prop `icon` (an Icon name), 16, gap 8, same colour tokens as the chevron.
- Search: prop `searchable`. A plain Select stays a Radix Select (role combobox). A searchable one is a button with `aria-haspopup="dialog"` that opens a Radix Popover with a search combobox and a listbox, because a real select-only combobox cannot hold a text field. Filtering by label, first match highlighted, "No results" row, polite count announcement, Tab closes and returns focus to the field. Texts are props (`searchPlaceholder`, `noResultsLabel`).
- Figma: new component set "Select empty" (Large 40, Medium 32, Small 24) for the "No results" row, bound to components/menu/bg-default and fg-disabled.
- Spec select r2 in Figma Specs and `specs/components/select.md`; acceptance 11 to 13 added.
- Metrics gate now covers Input (field, label, hint, spacing), Icon button (box, icon), Badge (height, padding, gap, radius, dot, label) and Table (cell, header, row): 147 values. Proven by a negative test with four wrong numbers (all four reported), then restored. Input icon gap is not compared: the code Input has no icon slots.

## 2026-11-18: Select r3 (multiple selection, strong menu edge, shadows from tokens)
- Decided with Maksim: the menu edge is border/strong (3:1 on both pages; the gate now checks it). Figma menu base stroke changed. The accepted-drift note about border/default is gone.
- Shadows follow the tokens: Figma effect styles Elevation/1 Raised, 2 Lifted and 3 Overlay now have the same layers as elevation/raised, lifted and overlay (they differed). This changes every Figma component that uses those styles (Toast, Popover and others); a look at them is worth a minute.
- Multiple selection was already designed in Figma (Show checkbox row, count in the trigger, footer with count and Clear, no tags). Code follows it: prop `multiple` with `values`, `defaultValues`, `onValuesChange`, `selectedLabel(count)`, `clearLabel`. A multiple Select is the Popover panel (the same one as search): a button with aria-haspopup="dialog", a multiselectable listbox, optional search. Radix Select cannot do multiple. One chosen shows its label; two or more show the count.
- Tab in a single-choice panel closes it; in a multiple panel Tab moves to Clear and Escape closes.
- Figma: menu footer now hugs its content (it was 33 high with a 24 button inside, which overflowed); real height 41, the same in code. Selected box border tokens components/menu/box-border-selected and selected-hover now alias border/strong (the lime border on a light green row was 1.1:1).
- Metrics gate: new group selectPanel (search area 57/49/41, box 16, radius 4, tick 8, footer 41, menu left, width and gap), 174 values. Negative test: two wrong numbers, both reported.
- Spec select r3 in Figma Specs and `specs/components/select.md`; acceptance 14 to 16.

## 2026-11-18: Phase 1 (d), the screen
- Feature spec before the screen: `specs/features/transfer-between-accounts.md` (goal, flow, rules, copy, states, acceptance). The screen is a Storybook story (Prototypes / Transfer between accounts) whose play functions are the acceptance list. Prototypes live in `apps/storybook/src/prototypes/` for now; a separate `prototypes/` folder comes when there is a second host.
- Built through the MCP server only (7 tools). Result: screen works with 8 library components; missing pieces are reported, not improvised: Notice, an empty state for Table, and page and form layout (Heading, Stack, Form actions). Details and doc defects in `specs/features/transfer-between-accounts.build-report.md`.
- Feature specs are not mirrored to Figma Specs yet (the spec-drift gate covers component specs only). Decide when the first feature spec goes to Figma.


## 2026-11-18: Radio, Toggle, Chip (step 2 of the component order)
- Radio and Toggle reuse the Checkbox tokens (components/checkbox/*), as Figma does. 24 tokens added to the repo from Figma (track, knob, box-border, track-border-on); Chip adds components/chip/fg-*-solid and the status overlay tokens (16). Component tokens: 343.
- Radio is native radios: RadioGroup is a fieldset with role radiogroup and a legend, one shared name, so the browser gives Tab, arrows and wrap. Legend is styled as the Input label. Hint or error under the legend, error replaces hint.
- Toggle is a native checkbox with role switch; the knob slides by a transform (120 ms, none under reduced motion).
- Found by the contrast gate: the light On knob on the light action track was 1.28:1. Figma variables components/checkbox/knob-on-on-* now point to text/on-action (disabled: text/dim), the same as the Checkbox mark. Also corrected in Figma: Toggle Off/Focus ring was text/primary, now border/focus like every other ring.
- Chip is a status tag (Status x Style as Badge, heights 40/32/24 as Button) with an optional remove button, the Figma Interactive icon. Only the button is interactive. The label is 14/22 in all three sizes because Figma has it so; Button uses 12 in Medium and Small, so this may be a Figma slip (open question).
- Contrast gate: the Chip remove icon on its hover and pressed overlay is checked at 3:1 (it is a graphic and the label is never under the overlay); at 4.5:1 twenty combinations would fail.
- Figma metrics gate: Radio, Toggle and Chip added (237 values). Spec files: Northgate Radio, Toggle and Chip spec (organization plan).

## 2026-11-18: Step 3 (Interactive icon, Notice, Toast, Spinner, Progress bar, Skeleton, Tooltip)
- Interactive icon is one component (sizes 40, 32, 24; label required) shared by Chip's remove button, Notice's close and Toast's close. A host tints it with --ds-interactive-fg and --ds-interactive-overlay; standalone it uses status fg-standalone (Toast's close) as Figma does.
- Notice: the only edge is a 6 rail on the start side, coloured components/status/border-*-<style> (Figma: left stroke 6, inside). In Subtle the rail is almost the fill colour; that is the Figma token, and the icon and words carry the status, so the rail is not in the contrast gate. Error is role alert, the rest role status.
- Toast is presentational: no timer, queue or position (WCAG 2.2.1). A toast host is a separate component to design when a product needs it. Figma Toast is 40 tall with a 32 close button reaching into the padding; the edge is an inset shadow so it does not add height. One accepted drift: icon x 13 in Figma, 12 in code.
- Spinner replaces the Button's own CSS spinner (Medium, 16 slot, decorative). Under reduced motion it turns three times slower instead of stopping.
- Progress bar is determinate only (Figma has no indeterminate); name comes from the required label. Hatch is a repeating gradient in border/subtle.
- Skeleton is decorative and hidden from assistive technology; pulse stops under reduced motion.
- Tooltip uses @radix-ui/react-tooltip (hover delay 400 ms, focus at once, Escape, aria-describedby). Fixed widths 560 (Notice) and 420 (Toast) are written in rem (35rem, 26.25rem) so they follow the reader's text size; there is no px token for them.
- Not found by tests but by comparing with Figma: Toast height (42 vs 40), Notice rail and title weight, Toast icon and close colours. The metrics gate now covers all seven (302 values).

## 2026-11-18: Decisions on the step 3 questions
- Notice Subtle: the rail uses components/status/border-*-solid (visible), changed in Figma (5 variants) and code. Outline keeps border-*-outline.
- Toast: Figma content no longer shifts by the inside stroke (strokes not included in layout); icon at x 12, height still 40. The accepted drift is gone (0 accepted).
- Container widths are tokens now: container/notice 560, container/toast 420, container/skeleton 240 (Figma variables in "4 Spacing", DTCG group `container`, CSS --ds-container-*). The Figma widths of Notice, Toast and the Skeleton text and block are bound to them. Modal, Drawer and Popover (step 5) will add theirs.
- Chip r2: the label follows the Button scale, 14/22 Large, 12/18 Medium (text style Meta), 11/16 Small (size and line of Micro, Regular weight), in Figma and code. Heights are unchanged.
- Chip remove icon on its hover and pressed overlay stays at 3:1 (graphic, WCAG 1.4.11); the rule is now in the spec (acceptance 4).

## 2026-11-18: Accessibility gate
- New gate `check-a11y`: axe-core over all 123 stories, in light and in forced-colors mode (tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice).
- Colour contrast is not run by axe in forced-colors (axe does not model system colours; screenshots confirmed black on white). Contrast stays with the contrast and forced-colors gates.
- Fixed: Select searchable/multiple trigger accessible name now includes the visible value (WCAG 2.5.3 Label in Name).
- Accepted (figma/known-a11y.json): Select menu-open, Radix hides the trigger with aria-hidden while the modal menu is open.

## 2026-11-18: Step 4 (Tabs, Breadcrumbs, Pagination, Nav)
- Tabs run on Radix Tabs (roving focus, arrow keys, Home and End, aria-controls). Segmented is a style of the same component, not a separate radio group, as in Figma.
- Pagination: Previous and Next are the Secondary Large Icon button; the page run keeps a constant length (7 slots by default) so the bar does not move; the current page is a focusable button with aria-current and does nothing.
- Nav: item with href is a link, without it a button; the rail item always has a tooltip (Figma doc requires it).
- Found in Figma and kept as drawn, flagged in the specs: (1) Segmented Default label text/dim on the track is 4.40:1 (Figma's own audit measured it on white); accepted in figma/known-contrast.json and known-a11y.json. (2) Disabled tab looks like Default in Figma; the library adds state-opacity/disabled. (3) The rail marker is visible on every state in Figma; the library draws it on the active item only. (4) The marker is 3 wide, not a spacing token; built as spacing-2 plus stroke/border. (5) Breadcrumb Current is Regular in the file but bold in the Figma docs; the file is followed.
- Also noted: the active Nav item is distinguished only by a very light tint and the marker (action/default on action/surface, about 1.3:1); aria-current carries it for assistive technology. Worth a designer's decision.
- Breadcrumb overflow (collapse the middle) is specified, not built; the trail wraps.
- check-a11y retries a play function that times out once, alone, before reporting it.

## 2026-11-18: Step 4 decisions by the designer (spec revision 2)
- Segmented Default label darkened to text/primary (was text/dim, 4.40:1 on the track); the accepted exception was removed from known-contrast.json and known-a11y.json.
- Disabled tab: fill surface/sunken with text/dim in all three styles, the same rule as Button and Input (grey fill, no opacity). The library no longer fades it with state-opacity/disabled.
- Nav rail marker only on the active item (fixed in Figma, it was on every state).
- Marker stays 3 wide, built from spacing-2 plus stroke/border; no new token.
- Breadcrumb Current is SemiBold (the system has no Bold weight; Figma changed from Regular).
- Nav active fill strengthened: action/default (hover action/hover) instead of action/surface (1.3:1). Marker moved to border/action so it still shows on the lime fill (3.9:1 on the raised fill).

## 2026-11-18: Step 5 (Modal, Drawer, Popover) and Nav active weight
- Nav active item: label and count SemiBold (Figma Active and Active hover; nav spec r3).
- Modal and Drawer are Radix Dialog (focus trap, return, Escape, inert page); Popover is Radix Popover (non-modal). They share the Overlay panel, header, body and footer parts (internal, packages/ui/src/Overlay).
- Container tokens added in Figma (container/modal-small 420, modal-medium 560, modal-large 760, drawer 560, popover 320) and bound to the component widths; the Panel, Header, Body and Footer in Figma now fill the width, so the variable drives them.
- The Figma title row is 24 tall (it holds an optional 16 icon, hidden in the Modal): built as min-height spacing-24 on the title, so the header is 71 like Figma. The optional title icon is not built.
- Footer actions are laid out left to right, secondary first, as drawn in Figma (many systems right-align them): kept as drawn, flagged to the designer.
- Figma draws no scrim: the library uses text/primary at state-opacity/scrim (40%). Flagged.
- a11y gate now also checks open overlays that render in a portal (dialog, tooltip, listbox). It found a real defect in Select search: the "No results" text sat inside the listbox (axe aria-required-children); moved outside the listbox.
- The Drawer bottom width in Figma (900) is a demo width; in code it spans the viewport.

## 2026-11-18 Step 5 decisions (modal, drawer, popover at r2)
- Footer actions are right-aligned. Changed in Figma first (`_Overlay footer base`: primary axis MAX, Hint fills the free width), then CSS (`justify-content: flex-end`) and the three specs.
- Scrim: Figma already draws it (master Scrim, text/primary at 40%); the spec wrongly said it did not. Code matches.
- Optional 16 icon before the title (Figma Show icon) added as `icon` on Modal and Drawer; decorative. Popover has no header, so no icon there.
- Initial focus stays on the Close button (first focusable); ring visible on open. Decided by me, not the designer: the library default.
- Drawer bottom spans the viewport; the Figma 900 is the demo frame width.
- Chip Small label is Regular like Medium and Large in Figma and code; the open question is closed.
- Breadcrumb overflow collapse stays specified and not built; needs an Overflow crumb drawn in Figma first (planned).

## 2026-11-18 Step 6 (card, avatar, stat, empty state, stepper, accordion, dropzone, file row, day)
- Built from Figma, one spec each (`specs/components/*.md`, r1, mirrored to Figma Specs, keys in `figma/system.json`). 34 components, 498 Figma values, 247 tests, 197 stories in the a11y gate.
- Calendar compositions (Date picker, Date range) are deferred: they need grid keyboard behaviour and a headless primitive. Only the Day cell is built now.
- New container tokens for sizes off the spacing scale: stepper-disc 28, day-width 40, day-height 36, empty-text 420. Question to the designer: snap to the scale?
- Accordion uses Radix Accordion (single by default and collapsible, or multiple). Chevron rotates; Figma swaps the icon.
- Icon gained size 48 (Empty state). Progress bar gained `showLabel` (File row hides the label, keeps the accessible name).
- Dropzone: CSS dashed border (Figma dash 6/4 cannot be reproduced exactly). Error text replaces the hint, as in Figma.
- Day: Disabled has no grey fill, as in Figma (unlike Tabs). Today ring is lime on white, 1.3:1; accepted in `figma/known-contrast.json` because the text colour and aria-current also mark today.
- Stat colour follows direction, not good or bad. Open question to the designer.
- Storybook stories run in a real browser: a plain object in place of DataTransfer fails there (Dropzone Dragging story uses a native DragEvent).

## 2026-11-18 Step 7 (date picker, date range)
- Both built on the Day cell through one internal calendar (`packages/ui/src/Calendar`): month header, weekday row, grid, footer slot and keyboard. Specs `date-picker.md` and `date-range.md` (r1) mirrored to Figma Specs.
- No date library. Dates are "YYYY-MM-DD" strings (no time zone, sort as text, what forms send); month and weekday names come from Intl, in the order day, month, year.
- Keyboard follows the grid pattern: one tab stop, arrows by day and week, Home and End, Page Up and Page Down by a month (Shift: a year), disabled days skipped, the view follows focus.
- Date picker shows neighbouring days as Day Outside. Date range leaves them blank so no day appears twice.
- Figma fix: the Date range panel was 650 wide with a fixed 624 header and months 592; now it hugs its months (618). The grid row gap (2) was a raw number and is bound to spacing-2 in both components.
- A month grid is at least five rows tall, so short months do not shrink the panel. Question to the designer: reserve six rows always?
- Date range has no hover preview of the band (not in Figma). Presets are a prop; `defaultRangePresets` holds the Figma three.

## 2026-11-19 Step 7 r2 (designer answers)
- Date picker and Date range grids always reserve six rows (226 high): Date picker 306x361, Date range 618x399. Figma updated first.
- Date range previews the band from the first click to the day under the pointer or keyboard focus (same Day states as a finished range). Figma frame "Date range" shows it.
- Date range shows neighbouring-month days as Outside like Date picker; the copies in the other grid are aria-hidden and not tab stops.
- Date range ships the three shortcuts by default (`presets={[]}` for none). Today keeps picking and moving the view. Hug-width Date range (618) confirmed.
- Specs r2 mirrored to Figma Specs; metrics gridH added; 278 tests, 206 stories in the a11y gate.

## 2026-11-19 Breadcrumb overflow (spec breadcrumb r3)
- Figma first: state Overflow in Breadcrumb item ("…" crumb), frame "Breadcrumbs, collapsed", component Breadcrumb menu shown in a Popover panel (Content swap). Drawn by Claude, waits for designer review.
- Code: `maxItems` (default 4) collapses the middle crumbs, keeping the first and last two; the ellipsis is a button "Show hidden pages" opening a Popover with the skipped links. Collapse by crumb count, not width.
- 282 tests, 207 stories in a11y gate, 522 Figma values.

## 2026-11-19 Repo host: GitHub
- Chosen by the designer (lab: free Pages for Storybook, trainees need no company account). Adapter `deploy/github-pages.yml` (copy to `.github/workflows/ci.yml`; Pages source "GitHub Actions"). It installs Chromium and runs `npm run ci`, then publishes `apps/storybook/storybook-static`.
- Found and fixed: `playwright` was not a declared dependency (it worked only from a global install), so the gates would have failed in CI. Now a root devDependency; all 11 gates pass without a global path. The adapter has not run on GitHub yet.
- Azure DevOps stays possible (section 4 of ARCHITECTURE.md); an adapter is added only if needed.
