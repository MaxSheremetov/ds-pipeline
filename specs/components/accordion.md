# Accordion

| Field | Value |
|---|---|
| **spec-id** | northgate/accordion |
| **revision** | 1 |
| **status** | approved |

## Purpose

A stack of headings that each show or hide their content, for material read one part at a time (questions and answers, grouped settings). Not for navigation (use Nav) and not for switching between views (use Tabs).

## Anatomy

Item header: a button at least 40 tall with the title (Medium 14/22) and a chevron on the right that turns when the item is open; 1 (stroke/border) line below in border/subtle. Hover has a background; focus draws the focus ring inside the header. Body: padding 0/12/12, text/dim. Disabled: text only dimmed.

## Behaviour

- Each title is a heading (level chosen by the product, default 3) containing one button.
- Enter or Space opens and closes the item; the button says aria-expanded. Arrow Up and Down, Home and End move between headers.
- One item open at a time by default and it can be closed again; type multiple allows several.
- A disabled item cannot be opened and is skipped by the keyboard.

## Acceptance checks

1. Header height, padding, chevron, lines and body match the Figma component Accordion item for Collapsed and Expanded in default, hover and focus.
2. aria-expanded reflects the state; arrow keys move focus.
3. The focus ring is visible, including in forced-colors mode.
4. Text meets 4.5:1.
5. No raw colour or size values in code.

## Open questions for the designer

- Figma swaps the chevron icon; code rotates one chevron 180°. Same look, simpler motion. OK?
