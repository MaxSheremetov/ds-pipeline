# Interactive icon

| Field | Value |
|---|---|
| **spec-id** | northgate/interactive-icon |
| **revision** | 1 |
| **status** | approved |

## Purpose

A small round icon button that lives inside another component: the remove of a Chip, the close of a Notice or Toast. It is not a toolbar button (use Icon button, which has a square shape and its own variants).

## Anatomy

1. Round target: Large 40 (spacing-40), Medium 32 (spacing-32), Small 24 (spacing-24); fully round.
2. Icon: 20, 16 or 12, centred, drawn in the colour of the host text (currentColor).

## States

| State | Look |
|---|---|
| Default | no fill; icon in the host text colour |
| Hover | host overlay colour at 8% (state-overlay/hover) |
| Pressed | host overlay colour at 12% (state-overlay/pressed) |
| Focus | 2 (stroke/focus) ring in border/focus, drawn inside the circle |
| Disabled | 40% opacity (state-opacity/disabled) |

Standalone (no host) the icon uses components/status/fg-standalone and the overlay is components/status/overlay-standalone. A host sets its own text and overlay colours.

## Behaviour

- A real button, reachable with Tab, activated with Enter or Space. It always has an accessible name (a required label); the browser also shows it as a tooltip.
- Size follows the host: Large in a Notice, Medium in a Toast, Small in a Chip.

## Acceptance checks

1. Target, icon size and colours match Figma in every size and state.
2. Without a label the component does not compile; with a label a screen reader reads it as a button.
3. In forced-colors mode hover and focus are visible.
