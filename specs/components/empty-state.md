# Empty state

| Field | Value |
|---|---|
| **spec-id** | northgate/empty-state |
| **revision** | 1 |
| **status** | approved |

## Purpose

What a list, table or page shows when there is nothing in it yet, or nothing matches. It says what is missing and offers the next step. Not an error and not a loading state.

## Anatomy

Centred column, padding 48 vertical and 12 horizontal, gap 12. Illustration: an icon at 48. Text block, gap 6: title (heading) and description, at most 420 wide (container-empty-text). Optional actions: one or two Buttons below.

## Behaviour

- The title is a heading; its level fits the page outline.
- The icon is decoration and hidden from assistive technology.
- Actions are real buttons or links in reading order after the text.

## Acceptance checks

1. Spacing, icon size and text width match the Figma component Empty state with and without actions.
2. The illustration is hidden from assistive technology.
3. Text meets 4.5:1 on its surface.
4. No raw colour or size values in code.
