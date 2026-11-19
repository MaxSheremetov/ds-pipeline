# Radio

| Field | Value |
|---|---|
| **spec-id** | northgate/radio |
| **revision** | 1 |
| **status** | approved |

## Purpose

Lets a person choose exactly one option from a short list (two to five), when all options should be visible at once. For several answers use a checkbox; for an instant on/off use a toggle; for more than five options use a select.

## Anatomy

1. Circle with a border.
2. Dot inside it when chosen.
3. Optional label to the right. Gap 8 (spacing-8).
4. A group (RadioGroup) holds the options: a legend (the question), optional hint or error, and the options.

## Sizes (each value is a token)

| Size | Circle | Dot | Label |
|---|---|---|---|
| Large | 24 (spacing-24) | 12 (spacing-12) | IBM Plex Sans Regular 14 (size/body), line/body 22 |
| Medium | 20 (spacing-20) | 10 (spacing-10) | 14 (size/body), line/body 22 |
| Small | 16 (spacing-16) | 8 (spacing-8) | 12 (size/meta), line/meta 18 |

- Border 1 (stroke/border), fully round. Same sizes and states as Checkbox, with a circle instead of a box.
- A radio with no visible label uses Large (WCAG 2.2 minimum target 24).

## Values and states

Value: Off, On. State: Default, Hover, Focus, Disabled. Colours are the Checkbox tokens (components/checkbox/*).

| Value and state | Circle | Border | Dot |
|---|---|---|---|
| Off, Default | surface/raised | border/strong | none |
| Off, Hover | surface/hover | border/strong | none |
| Off, Focus | surface/raised | border/focus + ring outside | none |
| On, Default | action/default | border/action | text/on-action |
| On, Hover | action/hover | border/action | text/on-action |
| On, Focus | action/default | border/action + ring outside | text/on-action |
| Any, Disabled | surface/sunken | border/default | text/dim |

- Focus ring: 2 (stroke/focus), 2 gap (spacing-2) outside the circle, colour border/focus, as on Button, Input and Checkbox.
- Label colour is text/primary, text/dim when disabled.

## Group

- Legend: the question the options answer. It names the group for assistive technology. Style as the Input label (sentence case in copy, uppercase by style).
- Options are stacked by default with gap 8, or in a row (gap 24, wrapping) when there are two or three short ones.
- Hint (text/dim, 12/18) sits under the legend. Error replaces the hint, in the error colour of Input, and the group is marked invalid.
- A disabled group disables every option.

## Behaviour

- Native radios: one name per group, so Tab enters the group once, arrows move the choice and wrap, disabled options are skipped. Space chooses the focused option. The label is part of the click target.
- Moving with the arrows chooses the option (native behaviour).
- Nothing is chosen at the start unless the product has a real default. A chosen radio cannot be un-chosen by the person; if "none" is a valid answer, offer it as an option.
- The group reports the chosen value; it can be controlled (value) or uncontrolled (defaultValue).

## Content rules

- Legend: a question or noun phrase, no colon. Options: short, parallel, normal case, mutually exclusive. Put the safest or most common option first.

## Acceptance checks

1. Circle, dot, label and colours match the Figma component in every size, value and state.
2. The group has an accessible name from its legend; its hint or error is its description.
3. Tab enters the group once; arrows move and wrap, skipping disabled options; clicking a label chooses it.
4. An error marks the group invalid and replaces the hint.
5. A disabled group cannot be focused or changed.
6. Border passes 3:1 against the page colours; dot passes 3:1 on the circle; label 4.5:1; focus ring 3:1.
7. No raw colour or size values in code.
