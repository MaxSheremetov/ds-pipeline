# Popover

| Field | Value |
|---|---|
| **spec-id** | northgate/popover |
| **revision** | 2 |
| **status** | approved |

## Purpose

A small floating panel opened from a button: a few fields, a short explanation with an action, a set of filters. Not a menu of choices (use Select), not a hint on hover (use Tooltip), and not a task that needs the whole attention (use a Modal).

## Anatomy

Panel: 320 wide (container-popover), surface/raised, radius 8 (radius-md-8), shadow Elevation/3 Overlay. Body: padding 12 (spacing-12), gap 8 (spacing-8), text/primary. Optional footer (Actions=On): padding 12, gap 8, 1 (stroke/border) line above in border/subtle, actions aligned to the right (Button Medium, 32). There is no header and no close button.

## Placement

Opens below its trigger, aligned to its start edge, 8 (spacing-8) away. It flips to the other side when there is no room and keeps 16 (spacing-16) from the viewport edge.

## Behaviour

- Non-modal: the page stays usable. Focus moves into the panel when it opens, Tab stays reachable, Escape closes it and focus returns to the trigger; a click outside closes it.
- The trigger announces that it opens a dialog (aria-haspopup, aria-expanded); the panel has an accessible name given by the product ("Filters", "Edit owner") because it has no visible title.
- Content is not clipped: the body scrolls when the panel is taller than the room it has.

## Acceptance checks

1. Width, padding, gap, radius and footer match the Figma component Popover for Actions Off and On.
2. Escape closes it and returns focus; the panel has an accessible name.
3. Text meets 4.5:1 on raised; in forced-colors mode the panel has an edge.
4. No raw colour or size values in code.
