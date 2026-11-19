# Stat

| Field | Value |
|---|---|
| **spec-id** | northgate/stat |
| **revision** | 1 |
| **status** | approved |

## Purpose

One key figure with its label and, optionally, how it changed. For summary rows on dashboards and detail pages. Not a chart and not a table cell.

## Anatomy

Label above the value: mono Medium 11/16, capitals, text/dim. Value: SemiBold; Large 30/32 (display), Medium 23/26 (title), Small 19/22 (section). Optional change row: trend icon 12, change in mono, and a period in text/dim. The trend colours come from the status foreground tokens: Up success, Down error, Flat neutral.

## Behaviour

- Built as a description list: the label is the term, the value and change are the description.
- Direction is never colour alone: the icon shows it and a visually hidden word ("Up", "Down", "Unchanged") says it.
- Colour follows direction, not whether the change is good or bad.
- The change row is shown only when both a trend and a change are given.

## Acceptance checks

1. Type sizes and colours match the Figma component Stat for Large, Medium, Small and for Up, Down, Flat.
2. A screen reader hears the direction in words.
3. Trend text meets 4.5:1 on the page surface.
4. No raw colour or size values in code.

## Open questions for the designer

- Down is always red. For some figures (costs, failures) down is good. Do we need a "good/bad" axis separate from direction?
