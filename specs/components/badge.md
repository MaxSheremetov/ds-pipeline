# Badge

| Field | Value |
|---|---|
| **spec-id** | northgate/badge |
| **revision** | 1 |
| **status** | approved |

## Purpose

A short status label for a record or a value: Settled, Pending, Failed. A badge labels; it does not act. For something clickable use a Chip or a Button.

## Anatomy

1. Container with a fill and a border.
2. Status dot (8 x 8, square), or an icon (12 x 12) instead of the dot.
3. Label, one or two words.

## Sizes (each value is a token)

| Size | Height | Padding left and right | Radius |
|---|---|---|---|
| Large | 24 (spacing-24) | 8 (spacing-8) | 4 (radius-xs-4) |
| Medium | 20 (spacing-20) | 6 (spacing-6) | 4 (radius-xs-4) |
| Small | 16 (spacing-16) | 4 (spacing-4) | 2 (radius-xxs-2) |

- Gap between the dot and the label is 4 (spacing-4). Border 1 (stroke/border).
- Label: IBM Plex Mono Medium, UPPERCASE, tracking track/caps, size/micro 11, line/micro 16. Write the label in normal case; the style sets the case.
- Small exists because a Medium badge in a table row reads as too heavy against the data.

## Status and style

Status: Neutral, Success, Warning, Error, Info. Style: Subtle, Outline, Solid.

| Style | Fill | Border | Label and dot |
|---|---|---|---|
| Subtle | status surface (neutral: surface/sunken) | none (transparent) | status colour (neutral: text/dim) |
| Outline | surface/raised | status colour | status colour |
| Solid | status colour | none (transparent) | surface/raised |

Status colours: Success status/positive, Warning status/warning, Error status/negative, Info status/info, Neutral text/dim.
- Use Outline on zebra rows: a Subtle fill is close to the sunken stripe and disappears there.
- Solid is for the one badge that must be seen in a view; do not fill a table with them.
- The label carries the meaning. Colour only reinforces it: a badge never says "red" instead of "Failed".

## Behaviour

- Not focusable and not interactive. The text is read as it is; the dot is hidden from assistive technology.

## Content rules

- One or two words, noun or past participle: Settled, Pending, Failed, On hold. No full stop.

## Acceptance checks

1. Heights, paddings, radius, text and colours match the Figma component in every size, status and style.
2. Label and dot colours pass 4.5:1 on their fill in all 45 combinations; Outline passes on the surface it sits on.
3. The label text is in the DOM (not an image); the dot is hidden from assistive technology.
4. No raw colour or size values in code.
