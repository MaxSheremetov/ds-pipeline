# Progress bar

| Field | Value |
|---|---|
| **spec-id** | northgate/progress-bar |
| **revision** | 1 |
| **status** | approved |

## Purpose

Shows how far along something is when the amount is known: a step count, an upload, an onboarding checklist. Not for work of unknown length (use Spinner).

## Anatomy

1. Label row (optional): the label on the left, the percentage on the right; gap between row and track 6 (spacing-6).
2. Track: fully round (radius-full), fill surface/sunken.
3. Hatch (optional): diagonal lines on the track, 2 wide every 6, leaning 20 degrees, colour border/subtle. The fill covers it.
4. Fill: fully round, colour components/status/fg-standalone, width equal to the value.

| Size | Track height |
|---|---|
| Large | 8 (spacing-8) |
| Medium | 6 (spacing-6) |
| Small | 4 (spacing-4) |

Label: IBM Plex Sans Regular 12 (size/meta), line/meta 18, text/dim. Percentage: IBM Plex Mono Regular 12, text/primary.

## Behaviour

- It is a progressbar (value 0 to 100) named by the label. The label is required; the percentage is a visual extra and is hidden from assistive technology.
- Values outside 0 to 100 are held at the ends.
- The product updates the value; the component does not animate it by itself.

## Acceptance checks

1. Heights, gap, radius, type and colours match Figma in every size, with and without the label row and the hatch.
2. A screen reader reads the label and the value.
3. In forced-colors mode the track edge and the fill stay visible.
