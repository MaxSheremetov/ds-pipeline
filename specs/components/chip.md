# Chip

| Field | Value |
|---|---|
| **spec-id** | northgate/chip |
| **revision** | 2 |
| **status** | approved |

## Purpose

A short tag the person can take away: a chosen filter, an applied value, a label on an item. It has the same statuses and styles as Badge. Badge labels a record and is never interactive; a Chip may carry a remove button. Not for choosing between options (use a radio group or select) and not for navigation.

## Anatomy

1. Container with a border and a fill.
2. Optional icon, 16 (spacing-16).
3. Label, one to three words.
4. Optional remove button: a 24 circle with a 12 icon (Figma "Interactive icon", Small).
Gap 4 (spacing-4) between parts. Padding 8 (spacing-8) on the left; on the right 8, or 4 when the remove button is shown.

## Sizes (each value is a token)

| Size | Height | Radius | Label |
|---|---|---|---|
| Large | 40 (spacing-40) | 4 (radius-xs-4) | IBM Plex Sans Regular 14 (size/body), line/body 22 |
| Medium | 32 (spacing-32) | 4 (radius-xs-4) | 12 (size/meta), line/meta 18 |
| Small | 24 (spacing-24) | 2 (radius-xxs-2) | 11 (size/micro), line/micro 16, Regular weight |

- Heights equal Button heights so a chip sits on one line with a button of the same size. The label follows the Button scale (14, 12, 11), so a chip and a button of the same size read as one row. Small is for dense filter bars. Border 1 (stroke/border).

## Status and style

Status: Neutral, Success, Warning, Error, Info. Style: Subtle, Outline, Solid. Fill, border and text are the Badge tokens (components/status/bg-*, border-*, fg-*); Solid text is components/chip/fg-*-solid (text/inverse).

## Remove button

| State | Look |
|---|---|
| Default | no overlay; icon in the chip text colour |
| Hover | overlay 8% (state-overlay/hover) in the chip's overlay token (components/status/overlay-*) |
| Pressed | overlay 12% (state-overlay/pressed) |
| Focus | 2 (stroke/focus) ring in border/focus, drawn inside the 24 circle |
| Disabled | 40% opacity (state-opacity/disabled) |

## Behaviour

- The chip is not interactive; only the remove button is. It is a real button, reachable with Tab, activated with Enter or Space.
- The remove button is named "Remove" plus the label (for example "Remove Savings"), or the product gives a better name.
- After removal the product moves focus to a sensible place (the next chip or the field that owns the list); the chip does not do this itself.
- A long label is cut with an ellipsis; give the chip a max width in its container, not a smaller font.

## Content rules

- Label: a noun or short value in normal case, no trailing punctuation. Do not use it for sentences.
- Status colours carry meaning (success, warning, error, info); use Neutral for plain filters. Colour is never the only signal: the label or icon says it too.

## Acceptance checks

1. Height, radius, padding, icon, label and colours match the Figma component in every size, status and style.
2. A read-only chip has no button; a removable chip has one with an accessible name.
3. The remove button works with the mouse and the keyboard and calls onRemove once.
4. Label passes 4.5:1 on the fill in every status and style; focus ring 3:1. The remove icon on its hover and pressed overlay passes 3:1 (it is a graphic, WCAG 1.4.11, and the label is never under the overlay).
5. No raw colour or size values in code.
