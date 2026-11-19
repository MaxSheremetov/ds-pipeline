# Icon button

| Field | Value |
|---|---|
| **spec-id** | northgate/icon-button |
| **revision** | 1 |
| **status** | approved |

## Purpose

A button that shows only an icon, for a frequent action where the meaning is clear from the icon and its place (edit, delete, more). Use a Button with a label when the action is new to the person or not obvious.

## Variants and states

Same as the Button: Primary, Secondary, Quiet, Danger; Default, Hover, Pressed, Focus, Disabled. Colours, overlays (hover 8%, pressed 12%) and the focus ring are the Button tokens (components/button/*) so the two never drift apart. Quiet is the default in tables and toolbars.

## Sizes (each value is a token)

| Size | Box | Icon | Radius |
|---|---|---|---|
| Large | 40 x 40 (spacing-40) | 20 (spacing-20) | 4 (radius-xs-4) |
| Medium | 32 x 32 (spacing-32) | 16 (spacing-16) | 4 (radius-xs-4) |
| Small | 24 x 24 (spacing-24) | 16 (spacing-16) | 2 (radius-xxs-2) |

- Border 1 (stroke/border). Focus ring 2 (stroke/focus), outside the button with a 2 gap (spacing-2), border/focus.
- Small is exactly 24 x 24, the WCAG 2.2 minimum target; it must not be made smaller.

## Behaviour

- Always has an accessible name that says what it does ("Edit", "Delete row"), also shown as a tooltip. The name is required.
- Activated with Enter and Space. Disabled cannot be focused.
- Keep icon buttons in the same order in every row of a table.

## Content rules

- Name: verb, or verb and object when several buttons are near each other ("Delete row").

## Acceptance checks

1. Box, icon size, radius and colours match the Figma component in every variant, size and state.
2. The button always has an accessible name.
3. Focus ring visible in every variant at 3:1; text and icon colours pass the Button contrast checks.
4. No raw colour or size values in code.
