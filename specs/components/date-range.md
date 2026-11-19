# Date range

| Field | Value |
|---|---|
| **spec-id** | northgate/date-range |
| **revision** | 2 |
| **status** | approved |

## Purpose

Picks a start and an end date from two months side by side, because a range that crosses a month is the normal case. For reports, filters and periods. Not for one date (use Date picker).

## Anatomy

Panel: as the Date picker, but gap 12. Header: Icon button Quiet Medium either side, nothing between. Two month columns, 32 apart (spacing-32), each with the month and year (Medium 14/22), the weekday row and a grid as in the Date picker. Days of the neighbouring months are drawn as Day Outside in both months; the copy of a day in the neighbouring grid is hidden from screen readers and is not a tab stop, so no day is announced twice. The ends are Day Range start and Range end; the days between are In range (tinted, square) so the run reads as one band. A one-day range shows as Selected. Footer: 1 border/subtle above, padding-top 8, gap 8. Grid area is always six rows high (6 x 36 + 5 x 2 = 226), so the panel does not change height from month to month. Shortcut buttons on the left (Button Quiet Small, 4 apart: Last 7 days, This month, Last quarter), the range in words and its length on the right (mono 12/18, text/dim): "18 Sep – 6 Oct 2026 · 19 days". Both ends are counted.

## Behaviour

- The first click sets the start. The second sets the end; if it is earlier than the start the two swap. A click after a complete range starts a new one. Clicking the start day again makes a range of one day.
- While only the start is chosen the footer says "From 18 Sep 2026".
- While only the start is chosen, the days between the start and the day under the pointer (or keyboard focus) show as a preview band, with the same Range start, In range and Range end states as a finished range (Figma frame Date range, footer "From 18 Sep 2026"). An earlier day under the pointer previews a band ending at the start. The preview goes when the pointer leaves the months.
- Shortcuts pick their range from today and move the view to its start. The three above are the default; a product can pass its own list or an empty one.
- The two grids are one tab stop. The keys of the Date picker apply across both months. The view shifts by one month only when focus leaves the two months.
- The month buttons move both months by one.
- Min, max and a rule make days unpickable (Day Disabled).
- The range is "YYYY-MM-DD" text for both ends.

## Acceptance checks

1. Panel, month columns, footer and band match the Figma component Date range (618 x 399).
2. The range is readable in words and length in the footer, and the end of a range across a year says both years.
3. The whole picker works with the keyboard alone, with one tab stop.
4. In-range days differ from default days by more than colour in forced-colors mode.
5. No raw colour or size values in code.

## Decisions by the designer (2026-11-19)

- Six rows reserved. Hover preview drawn and built. Neighbouring days shown as Outside. Hug-width panel (618). Shortcuts: the three stay as default, a product may replace them.
