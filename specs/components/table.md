# Table

| Field | Value |
|---|---|
| **spec-id** | northgate/table |
| **revision** | 3 |
| **status** | approved |

## Purpose

Shows records as rows and columns so they can be scanned, compared and sorted. Use it for lists of like items with several attributes (transactions, accounts). For a single record use a Card; for a handful of values use a list.

## Anatomy

1. Table with a name (caption, hidden visually, read by screen readers).
2. Header row of column headers, optionally sortable.
3. Body rows. Zebra stripes by position: odd rows raised, even rows sunken.
4. Cells that hold text, a figure, a link, an icon with text, a badge or row actions.
5. Optional first column with a selection checkbox, and select all in the header.

A table wider than its frame scrolls sideways. Columns never hide and never collapse: every column keeps a minimum width of 64 (spacing-64).

## Dimensions (each value is a token)

| Part | Height | Padding left and right | Text |
|---|---|---|---|
| Header cell | 40 (spacing-40) | 10 (spacing-10) | IBM Plex Sans Regular 12 (size/meta), line/meta 18, text/dim |
| Cell | 40 (spacing-40) | 10 (spacing-10) | IBM Plex Sans Regular 14 (size/body), line/body 22 |

- Header bottom border 1 (stroke/border) in border/default; row bottom border 1 in border/subtle.
- Gap between the label and the sort glyph is 4 (spacing-4); the glyph is 8 (spacing-8).
- Height is fixed at 40. There is one density.

## Header cell

Align: Start for words, End for figures (and then the column cells are End too).
Sort: none (both arrows, dim), ascending (up arrow, text/primary), descending (down arrow, text/primary). The sort state is carried by the arrow shape, never by colour alone.
States: default, hover (sortable columns only: background surface/hover, label text/primary), focus (2 ring inside the cell, border/focus, over the full cell).

## Row

Stripe: odd and even by position, not set by hand.
Selected: background action/surface. Hover: surface/hover; selected hover: action/surface-hover. Selection and hover both outrank the stripe, so an even row on hover is never the same grey as the stripe.
Focus (only for a row that can be activated): 2 ring inside the row, border/focus.

## Cell kinds

| Kind | Use | Ink |
|---|---|---|
| Primary | Main value in prose | text/primary |
| Secondary | Supporting value (a date, a reference) | text/dim |
| Number | A figure; right-aligned; set in the text face (IBM Plex Sans) with equal-width digits so a column lines up. Not the mono face | text/primary |
| Link | A reference to another page; always underlined, so it is not told apart by colour alone | text/action |
| Credit | Money in | status/positive |
| Debit | Money out | status/negative |
| Pending | Money not yet settled | status/warning |

Credit, Debit and Pending are colour reinforcement only. The sign (+ or the minus sign) stays in the text, so colour never alone says whether money came in or went out. Colour an amount column only when its sign varies.

## Behaviour

- The table has a name. Column headers are real column headers (scope col).
- Sort is announced: the header exposes ascending, descending or none to assistive technology. A sortable header is a button; Enter and Space activate it. The product sorts the data and passes the new sort state; the table never reorders itself.
- Selection is shown by background and exposed as selected on the row. The person changes it with the checkbox in the first column; the product owns the selected set.
- The selection column is 40 wide (spacing-40) with a Large Checkbox (24) centred; it is the one column narrower than 64. Every row checkbox has an accessible name that says which row ("Select Current account 4412").
- Select all sits in the header cell of that column. It is Off when no row is selected, Mixed when some are, On when all are. Activating Mixed selects all.
- Toggling a checkbox, or pressing a button inside a row, never activates the row.
- A row with an action is reachable with Tab and activated with Enter or Space. A row without an action is not focusable. Controls inside a row (links, buttons) keep their own focus.
- Keep row actions in the last cell, Align End, in the same order in every row.

## Cell content

A cell may hold more than text. Content sits on one line, centred in the 40 high cell.

| Content | Rule |
|---|---|
| Icon with text | Icon 16 (spacing-16) before the text, gap 8 (spacing-8). The icon repeats what the text says; it never replaces it |
| Badge | Small (16) or Medium (20). Use Outline on zebra rows, a Subtle fill is close to the sunken stripe and disappears there |
| Icon button | Small (24) or Medium (32), Quiet by default. Gap 4 (spacing-4) between actions |
| Button | Small (24), Secondary or Quiet. A primary button does not belong in a row |

The 40 row height stays fixed: nothing taller than 32 goes in a cell. A cell that needs more is a sign the record belongs in a Card.

## Content rules

- Column header: noun, short, no punctuation. Name figure columns with their unit when it is not obvious.
- Right-align every figure and set it as Number or a money kind.
- Dates and amounts use one format throughout a table.

## Out of scope for revision 3

Row expansion panel, bulk actions bar, column filter, column menu, column resize, row density switch, sticky header, pagination (a separate component).

## Acceptance checks

1. Header and cell sizes, paddings, text and colours match the Figma components.
2. The table has a name; headers expose column scope.
3. A sorted column exposes its sort state; a sortable header works with the keyboard.
4. Zebra is by position; hover and selected outrank it.
5. A row with an action is reachable by Tab and activates with Enter and Space; others are skipped.
6. Credit, Debit and Pending keep the sign in the text. Link cells are underlined.
7. A row checkbox and select all have accessible names; select all shows mixed when some rows are selected; toggling a checkbox or pressing a button in a row does not activate the row.
8. Every text and cell colour passes 4.5:1 on every row background (stripe, hover, selected); sort glyphs and the focus ring pass 3:1.
9. No raw colour or size values in code; everything resolves through tokens.
