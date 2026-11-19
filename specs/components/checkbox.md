# Checkbox

| Field | Value |
|---|---|
| **spec-id** | northgate/checkbox |
| **revision** | 2 |
| **status** | approved |

## Purpose

Lets a person select one or more items from a list, or turn one option on or off. Use it in forms and in table rows (row selection, select all). For exactly one choice from several use a radio group; for an instant on/off use a switch.

## Anatomy

1. Box with a border.
2. Mark inside it: a tick (checked) or a dash (mixed).
3. Optional label to the right. Gap 8 (spacing-8).

## Sizes (each value is a token)

| Size | Box | Mark | Radius | Label |
|---|---|---|---|---|
| Large | 24 (spacing-24) | 16 (spacing-16) | 4 (radius-xs-4) | IBM Plex Sans Regular 14 (size/body), line/body 22 |
| Medium | 20 (spacing-20) | 12 (spacing-12) | 4 (radius-xs-4) | 14 (size/body), line/body 22 |
| Small | 16 (spacing-16) | 10 (spacing-10) | 2 (radius-xxs-2) | 12 (size/meta), line/meta 18 |

- Border 1 (stroke/border). The mark is about two thirds of the box so it reads at a glance; its stroke scales with it (1.75 on a 12 grid), round caps.
- A checkbox with no visible label (select all, row checkbox) uses Large: 24 is the WCAG 2.2 minimum target.

## Values and states

Value: Off, On, Mixed. Mixed is a real third value for a parent whose children are partly selected, not a styling of On. State: Default, Hover, Focus, Disabled.

| Value and state | Box | Border | Mark |
|---|---|---|---|
| Off, Default | surface/raised | border/strong | none |
| Off, Hover | surface/hover | border/strong | none |
| Off, Focus | surface/raised | border/focus + ring outside | none |
| On and Mixed, Default | action/default | border/action | text/on-action |
| On and Mixed, Hover | action/hover | border/action | text/on-action |
| On and Mixed, Focus | action/default | border/action + ring outside | text/on-action |
| Any, Disabled | surface/sunken | border/default | text/dim |

- Focus ring: 2 (stroke/focus) outside the box with a 2 gap (spacing-2), radius +4 (radius-md-8, radius-sm-6 for Small), colour border/focus, as on Button and Input. The border also turns border/focus. A checkbox in a table sits in a 40 high cell, so the ring fits.
- Label colour is text/primary, text/dim when disabled.

## Behaviour

- It is a native checkbox. Space toggles it. The label is part of the click target.
- Mixed is set by the product (the parent knows its children). Activating a mixed box makes it checked; the product then selects all.
- Disabled cannot be focused or changed.
- A checkbox without a visible label has an accessible name (for example "Select row 3", "Select all rows").

## Content rules

- Label: what is selected or enabled, in normal case, no colon. Positive wording ("Send statements by email"), not negative.

## Acceptance checks

1. Box, mark, radius, label and colours match the Figma component in every size, value and state.
2. Clicking the label toggles the box; Space toggles it; disabled is skipped by Tab.
3. Mixed is exposed to assistive technology as mixed.
4. A checkbox without a visible label has an accessible name.
5. Border passes 3:1 against the page colours; mark passes 3:1 on the box; label 4.5:1; focus ring 3:1.
6. No raw colour or size values in code.
