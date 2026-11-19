# Date picker

| Field | Value |
|---|---|
| **spec-id** | northgate/date-picker |
| **revision** | 2 |
| **status** | approved |

## Purpose

Picks one date from a month grid, for dates the person knows by their place in a calendar (a due date, a booking day). Not for far dates such as a birth year (use typed fields) and not for a range (use Date range).

## Anatomy

Panel: surface/raised, 1 border/default, radius 8 (radius-md-8), padding 12 (spacing-12), gap 8. Header: Icon button Quiet Medium (32) for the previous and next month, the month and year between them (Medium 14/22, text/primary). Weekday row: two letters in capitals, mono Medium 11/16 with tracking, text/dim, one 40 wide cell per day, 20 tall. Grid: seven columns of Day cells (40 x 36), rows 2 apart (spacing-2); always six rows tall (6 x 36 + 5 x 2 = 226) so the panel does not change height between months. Days of the neighbouring months fill the rows and use the Day Outside state. Footer: 1 border/subtle above, padding-top 8, a Button Quiet Small "Today" on the left and the chosen date in words on the right (mono Regular 12/18, text/dim), for example "18 Sep 2026".

## Behaviour

- The week starts on Monday (configurable).
- The panel is a named group; each month is a grid named by its month. Each day is a button named by its full date ("18 September 2026"); the weekday heads have the full day name for screen readers.
- The grid is one tab stop: the chosen day, else today if it is in the month, else the first day. Arrow Left and Right move one day, Up and Down one week, Home and End the start and end of the week, Page Up and Page Down one month (Shift: one year). The day is kept, or the last day of a shorter month. Focus follows into the next month and the view follows focus. Days that cannot be picked are skipped.
- Enter or Space, or a click, picks the day. A click on an Outside day picks it and moves the view to its month.
- Today picks today and moves the view to it. It is disabled when today cannot be picked.
- The footer text is announced when it changes; the month title is announced when the month changes.
- Min, max and a rule (weekends, holidays) make days unpickable; they use the Day Disabled state. The month buttons are disabled when no pickable month is left that way.
- Dates are "YYYY-MM-DD" text, with no time zone.

## Acceptance checks

1. Panel, header, weekday row, grid and footer match the Figma component Date picker (306 x 361).
2. The whole picker works with the keyboard alone, with one tab stop in the grid.
3. A screen reader hears the full date of each day, the chosen date in the footer, and the month when it changes.
4. Text meets 4.5:1; in forced-colors mode the panel has an edge and the chosen day is distinguishable.
5. No raw colour or size values in code.

## Decisions by the designer (2026-11-19)

- Six rows are always reserved in the grid (226 high), so the panel is 361 high and does not jump between months. The Today button picks today and moves the view to it.
