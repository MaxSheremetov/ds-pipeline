# Select

| Field | Value |
|---|---|
| **spec-id** | northgate/select |
| **revision** | 3 |
| **status** | approved |

## Purpose

Lets a person choose exactly one value from a list of about 4 to 15 options, with a visible label, an optional hint and an error message. For fewer than 4 options and room on screen use radio buttons; for more than about 15 turn on search (searchable Select, below); for several values at once turn on multiple selection (below); for a handful of independent yes or no choices a checkbox group is clearer.

## Anatomy

1. Label, always visible, above the field.
2. Field, a button that shows the chosen value (or the placeholder) and a chevron on the right. An optional leading icon sits on the left, before the value.
3. Hint, one line under the field. In the error state the error message replaces the hint.
4. Menu, a list of options that opens under the field. Each option has a label and, for the chosen one, a check on the right. A searchable Select has a search field at the top of the menu.

Spacing between label row, field and hint is 6 (spacing-6). The field is Input without the text cursor: same label, field, hint, sizes and state tokens (components/input/*).

## Sizes (each value is a token)

| Size | Field height | Padding left and right | Radius | Value size | Option height | Option label |
|---|---|---|---|---|---|---|
| Large | 40 (spacing-40) | 12 (spacing-12) | 4 (radius-xs-4) | 16 (size/body-lg), line 24 | 40 | 14 (size/body), line 22 |
| Medium | 32 (spacing-32) | 10 (spacing-10) | 4 (radius-xs-4) | 14 (size/body), line 22 | 32 | 14 (size/body), line 22 |
| Small | 24 (spacing-24) | 8 (spacing-8) | 2 (radius-xxs-2) | 12 (size/meta), line 18 | 24 | 12 (size/meta), line 18 |

- Label: as Input (UPPERCASE, Medium weight, 12 or 11 for Small).
- Chevron: 16 (spacing-16), colour components/input/icon-*, gap to the value 8 (spacing-8). The chevron turns when the menu is open.
- Leading icon: optional, 16 (spacing-16), same colour tokens as the chevron (components/input/icon-*), gap to the value 8 (spacing-8). It describes the field (a bank, a calendar), not the chosen option, so it does not change with the value.
- Menu: radius 8 (radius-md-8), border 1 (stroke/border) in border/strong, background surface/raised, shadow elevation/lifted (the Figma effect style Elevation/2 Lifted is the same three layers as the token). The menu is exactly as wide as the field and starts at its left edge. It opens 8 (spacing-8) below the field, so it never touches the field's border or its focus ring (the ring reaches 4 beyond the border), and it flips above when there is no room. Option padding left and right is the same as the field.
- The value and the options never wrap; long text is cut with an ellipsis. The full text is available as the option's accessible name.

## Search in the menu

Set `searchable` for long lists. The field then opens a panel instead of a plain list: a search field on top, a divider, the options below. The panel has the same width, gap and radius as the plain menu.

- Search field: an Input of the same size (leading search icon 16, placeholder "Search" by default, a prop for other languages), inside the panel with 8 (spacing-8) padding on every side and a 1 (stroke/border) divider in border/subtle underneath. The search area is therefore field height plus 16 plus 1: 57 (Large), 49 (Medium), 41 (Small).
- Typing filters the options by label, ignoring case. The first enabled match is highlighted. When nothing matches, the list shows one row "No results" (a prop for other languages) in menu/fg-disabled, the same height and padding as an option (component Select empty in Figma).
- Focus stays in the search field; the highlighted option is announced through the active option of the list. The number of options left is announced politely when it changes ("3 options", "No results").
- The query is cleared each time the panel opens, and the highlight starts on the chosen option.
- The field of a searchable Select announces that it opens a dialog, because the panel holds a search field and a list. The chosen value is shown in the field as for a plain Select.

## Multiple selection

Set `multiple` when the person may choose several options. The trigger is the same field; what changes is what the value says and how the menu works.

- Field: nothing chosen shows the placeholder; one chosen shows its label; two or more show a count ("2 selected", a prop for other languages and for wording such as "2 accounts selected"). No tags: tags reflow the field, break its height and turn a form field into a block of variable size.
- Rows: a checkbox box 16 (spacing-16, radius-xs-4) with a tick 8 by 6 on the left, gap 8 (spacing-8) to the label, no check on the right. Box and tick colours are components/menu/box-bg, box-border and tick in the row's state; the selected box is filled and keeps a border/strong edge, so it is visible on the selected row tint.
- The menu stays open while choosing. A search field is optional (`searchable`) and works as above.
- Footer: the count on the left (IBM Plex Mono 12, text/dim) and a Clear button (quiet, small) on the right, padding 8 and 12, a 1 (stroke/border) divider in border/subtle above. Height 41: 8, the 24 button, 8, and the divider. Clear empties the choice, is disabled when nothing is chosen, and sends focus back to the search field or the list.
- Keyboard: focus starts in the search field, or on the list when there is no search. Arrow Up and Down move the highlight, Home and End jump (list focused), Space and Enter toggle the highlighted row, Escape closes and returns focus to the field. Tab moves on to Clear (it does not close the panel, because Clear is there to be reached).
- Announcements: the list is multiselectable and each row says whether it is selected; the count is read from the footer. The field announces that it opens a dialog.
- Values are controlled (values and change handler) or left to the component (default values). Every chosen value is sent with the form. Values are kept in the order of the options, not the order of clicking.

## States of the field

Default, hover, focus, error, error focus, disabled, read-only, each with a placeholder (empty) and with a value (filled): exactly as Input (colours, ring, hint), because the tokens are the same. Open is not a separate visual state: the field keeps its focus state while the menu is open.

## States of an option

| State | Background | Label | Check |
|---|---|---|---|
| Default | menu/bg-default | menu/fg-default | none |
| Hover (pointer) and Focus (keyboard highlight) | menu/bg-hover | menu/fg-hover | none |
| Selected | menu/bg-selected | menu/fg-selected | menu/check-selected, 12 by 8 (multiple: box with tick on the left instead) |
| Selected hover | menu/bg-selected-hover | menu/fg-selected-hover | menu/check-selected-hover |
| Disabled | menu/bg-disabled | menu/fg-disabled | none |

The highlighted option (keyboard or pointer) is shown by background only; the focus ring is on the field, and the highlighted option is announced through the list's active option.

## Behaviour

- A plain Select is a select-only combobox: a button that opens a list of options (role combobox, popup listbox, options with selected state). A searchable Select is a button that opens a dialog with a search combobox and a listbox. Behaviour comes from a headless primitive; the styles and the contract are ours.
- The label is a real label for the field (clicking it focuses the field).
- Keyboard on the field: Enter, Space, Arrow Down and Arrow Up open the menu; typing a letter jumps to the option that starts with it. In the open menu: Arrow Up and Down move, Home and End go to the first and last option, Enter or Space chooses, Escape closes without changing, Tab closes and moves on. Focus returns to the field after closing. In the searchable panel: Arrow Up and Down move the highlight among enabled matches, Enter chooses, Escape closes, Tab closes and moves focus to the field.
- Choosing an option closes the menu and puts the value in the field. The menu does not close the page's scroll or shift the layout.
- The hint and the error message are linked to the field so a screen reader reads them with it. The error state sets the field as invalid. The message says what is wrong and how to fix it. Colour is never the only signal.
- Disabled cannot be focused or opened. Read-only can be focused but not opened.
- The chosen value is controlled by the product (value and change handler) or left to the component (default value). Without a value the placeholder is shown in text/dim.
- Options that cannot be chosen are shown as disabled and skipped by the keyboard.

## Content rules

- Label: noun or short noun phrase, no colon. Placeholder: "Select an account", an instruction is fine here because the label already names the field. Options: nouns in normal case, the most likely first, or a natural order (alphabetical, by size).
- Do not use a Select to navigate or to run actions; use a menu button for that.

## Out of scope for revision 3

Option groups and separators, icons and descriptions in options, create-new option, required and optional markers, loading options from a server.

## Acceptance checks

1. Every size and state matches the Figma component: field height, padding, radius, value size, option height, option label size, colours.
2. Label is connected to the field; clicking it focuses the field.
3. The menu opens and closes with the keys listed in Behaviour; Escape returns focus to the field; typing a letter jumps to the option.
4. The chosen option is announced as selected; the field announces its label, value, and that it opens a list.
5. Hint is read with the field; in the error state the message is read instead and the field is invalid.
6. Disabled is skipped by Tab and cannot be opened; read-only is reachable by Tab and cannot be opened.
7. The menu flips above the field when there is no room below and never leaves the viewport.
8. All text pairs pass 4.5:1 in every option state; the field border and the chevron pass 3:1; the check passes 3:1 against its row. The menu edge is border/strong, 3:1 on both page colours, plus the lifted shadow. In the multiple menu the unselected box border passes 3:1 on the row and the tick passes 3:1 on the selected box.
9. Windows high contrast: the check, the chevron, the highlighted and the selected option stay distinguishable.
10. No raw colour or size values in code; everything resolves through tokens.
11. The menu is exactly as wide as the field, starts at its left edge and sits 8 below it in every size, with and without focus ring, plain and searchable.
12. With a leading icon, the icon and the value are on one line with a gap of 8, and the chevron stays on the right.
13. Search: typing filters, the first match is highlighted, Enter chooses it, "No results" appears when nothing matches, Escape and Tab close the panel and return focus to the field, and the result count is announced.
14. Multiple: the field shows the placeholder, one label, or a count; the menu stays open while choosing; checkboxes, tick and footer match the Figma menu in every size (box 16, tick 8, footer 41); Clear empties the choice and is disabled when empty; every chosen value is sent with the form.
15. Multiple keyboard: focus starts in the search field or on the list; arrows, Home, End, Space and Enter work as listed; Escape closes and returns focus to the field; Tab reaches Clear.
16. Windows high contrast: the box edge, the tick and the highlighted row stay distinguishable in the multiple menu.
