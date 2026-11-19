# Input

| Field | Value |
|---|---|
| **spec-id** | northgate/input |
| **revision** | 3 |
| **status** | approved |

## Purpose

A single-line text field with a visible label and an optional hint or error message. Use it for short free text: names, emails, references. For choosing from a list use Select.

## Anatomy

1. Label, always visible, above the field.
2. Field, the box that holds the value or the placeholder.
3. Hint, one line under the field. In the error state the error message replaces the hint.

Spacing between label row, field and hint is 6 (spacing-6).

## Sizes (each value is a token)

| Size | Field height | Padding left and right | Radius | Value size | Value line height |
|---|---|---|---|---|---|
| Large | 40 (spacing-40) | 12 (spacing-12) | 4 (radius-xs-4) | 16 (size/body-lg) | 24 (line/body-lg) |
| Medium | 32 (spacing-32) | 10 (spacing-10) | 4 (radius-xs-4) | 14 (size/body) | 22 (line/body) |
| Small | 24 (spacing-24) | 8 (spacing-8) | 2 (radius-xxs-2) | 12 (size/meta) | 18 (line/meta) |

- Label: IBM Plex Sans Medium, UPPERCASE, tracking track/caps. Large and Medium 12 (size/label, line/label 18); Small 11 (size/micro, line/micro 16), so the label steps down with the field, as the Button label does. Write the label in normal case in content; the case is applied by the style.
- Value and placeholder: IBM Plex Sans Regular, tracking track/none. The value never wraps; long text is cut off by the field edge.
- Hint and error message: IBM Plex Sans Regular 12 (size/meta), line height line/meta, in every size.
- Border 1 (stroke/border). Height is fixed.

## States

Default, hover, focus, error, error focus, disabled, read-only. Each state exists with a placeholder (empty) and with a value (filled); the value colour is a mode of the component, not an override.

| State | Field background | Border | Notes |
|---|---|---|---|
| Default | surface/raised | border/strong | |
| Hover | surface/hover | border/strong | |
| Focus | surface/raised | border/focus | Focus ring: 2 (stroke/focus) outside the field edge with a 2 gap (spacing-2), radius +4 (radius-md-8, radius-sm-6 for Small), colour border/focus |
| Error | surface/raised | status/negative | Hint text is the error message in status/negative |
| Error focus | surface/raised | status/negative | Focus ring as in Focus, message stays red |
| Disabled | surface/sunken | border/strong | Value text text/dim; not focusable |
| Read-only | surface/sunken | border/strong | Value text text/primary; focusable and selectable |

Error hover does not exist on purpose: the red border already outranks hover, and changing the background under an error message is noise.

Text colours: label and hint are text/dim, except error hint (status/negative). Placeholder is text/dim. Filled value is text/primary, except disabled (text/dim).

## Behaviour

- The label is a real label for the field (clicking it focuses the field).
- The hint and the error message are linked to the field so a screen reader reads them with it.
- The error state sets the field as invalid for assistive technology. The message must say what is wrong and how to fix it ("Enter a valid email address"), not only that something is wrong. Colour is never the only signal.
- Disabled cannot be focused or edited. Read-only can be focused and selected but not edited.
- Validation timing belongs to the product: show the error after the person leaves the field or submits, not while typing the first character.

## Content rules

- Label: noun or short noun phrase, no colon, no trailing punctuation.
- Placeholder: an example of the format, never the instruction. It disappears when typing, so the label and the hint carry the instructions.
- Hint: one short sentence, no full stop required.

## Out of scope for revision 3

Leading and trailing icons (the icon colour tokens exist but the Figma component has no icon slots yet), required and optional markers, character counter, multi-line text.

## Acceptance checks

1. Every size and state matches the Figma component: height, padding, radius, text size, colours.
2. Label is connected to the field; clicking it focuses the field.
3. Hint is read with the field; in the error state the message is read instead.
4. The error state exposes the invalid state to assistive technology.
5. Disabled is skipped by Tab; read-only is reachable by Tab.
6. Focus ring is visible in every state, including error, at 3:1 against the page colours.
7. All text pairs pass 4.5:1 (label, hint and placeholder in every state they appear in); the field border passes 3:1 against the page colours.
8. No raw colour or size values in code; everything resolves through tokens.
