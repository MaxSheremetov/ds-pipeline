# Build report: Transfer between own accounts

Built 2026-11-18 by Claude, from `transfer-between-accounts.md` r1, reading the library only through the Storybook MCP server. Story: Prototypes / Transfer between accounts (`apps/storybook/src/prototypes/Transfer.stories.tsx`).

## How it was built

- A client with no repo files connected to `http://localhost:6006/mcp` (also checked with the Claude CLI from an empty directory: `claude mcp add --transport http storybook ...` shows Connected). It listed the 7 tools, read `docs-list`, then `docs-show` for Select, Input, Button, Checkbox, Table and Badge and `docs-show-story` for the Table rich cells.
- The screen uses only: Select (x2, with icons), Input (x2), Checkbox, Button (x2, one loading), Table, Badge. Layout is inline CSS with `var(--ds-*)` tokens only.

## Acceptance (from the spec)

| # | Check | Result |
|---|---|---|
| 1 | Library components only, no raw colours or sizes | Pass for controls; layout glue is inline token styles (see Gaps 3) |
| 2 | Empty Confirm: three errors, focus to From | Pass (story EmptyFormErrors, play function) |
| 3 | Same account in To | Pass (SameAccountAndTooMuch) |
| 4 | Amount above balance shows the balance | Pass (SameAccountAndTooMuch) |
| 5 | Valid form: loading, success, new first row Pending, focus back to From | Pass (Success) |
| 6 | Keyboard only, labels, hints and errors read | Pass in the play functions through labels and roles; not tested with a real screen reader |
| 7 | No axe violations in empty, error and success states | Pass (axe-core on the story root, 0 violations in all three) |
| 8 | One column at most 560 wide, no horizontal scroll at 320 | Pass for the page (scrollWidth 320); the Table scrolls inside its own container, as designed |

## Gaps: what was missing, and what is proposed

The rule is to say so and propose a component, not to improvise. Three pieces were missing:

1. **Notice (inline message).** The success message ("Transfer of 250.00 ... was accepted") is a plain paragraph with `role="status"`, in dim text. It needs a Notice with status (success, error, info, warning), icon, optional action and a close button. Figma already has Notice (15 variants); this is item 3 of the agreed order.
2. **Empty state.** "No transfers yet" cannot be shown, because Table has no empty state. Figma has an Empty state page with no component sets yet; it needs designing first.
3. **Page and form layout.** The page title, the form column and the button row are inline token styles. A small set is proposed: Heading (levels, sizes from the type scale), Stack (vertical or horizontal gap from the spacing scale), Form actions (right-aligned button row that stacks on a phone). Without them every screen repeats this glue.

## What the MCP docs got wrong or left out (fixed or listed)

- Select's description still said "Choose one value" after search and multiple were added. Fixed.
- `icon` props show as `unknown` in the Props block (react-docgen does not resolve the `IconName` type from another file). The JSDoc of Select and Badge now says "an icon name from the Icon set, such as 'wallet'". Open: show the real union in the manifest.
- The Table docs import every Table part in every example and refer to a `rows` array that is not defined in the snippet. An agent has to guess the row shape. Open: make the stories self-contained.
- `Input` accepts native input props (`inputMode`, `step`, `min`) but the Props block lists only the five documented ones. The screen used them and they worked. Open: say in the Input docs that native attributes pass through.
