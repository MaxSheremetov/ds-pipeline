# Tooltip

| Field | Value |
|---|---|
| **spec-id** | northgate/tooltip |
| **revision** | 1 |
| **status** | approved |

## Purpose

A short hint that appears when the person hovers or focuses an element: the date behind a relative time, what an icon does. It describes its trigger; it never replaces the trigger's name and never holds links or buttons.

## Anatomy

1. Bubble: padding 6 (spacing-6) by 8 (spacing-8), radius 4 (radius-xs-4), fill components/tooltip/bg (text/primary).
2. Text: IBM Plex Sans Regular 12 (size/meta), line/meta 18, components/tooltip/fg (text/inverse). One short line.
3. Arrow: 8 by 4, same fill, pointing at the trigger, no gap between arrow and trigger.

Side: Top, Bottom, Left, Right. The bubble flips to the opposite side when there is no room.

## Behaviour

- Shows on hover after a short delay (400 ms) and at once on keyboard focus; hides on blur, on pointer leave and on Escape.
- It is linked to the trigger as its description (aria-describedby), so a screen reader reads it after the name.
- The trigger must be focusable (a button, a link, an input). Touch has no hover: do not put information only in a tooltip.

## Acceptance checks

1. Padding, radius, arrow, type and colours match Figma for every side.
2. Focus shows it, Escape hides it, a screen reader reads it as the description.
3. Text meets 4.5:1 on the fill; in forced-colors mode the bubble keeps an edge.
