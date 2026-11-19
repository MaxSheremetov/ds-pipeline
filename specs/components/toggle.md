# Toggle

| Field | Value |
|---|---|
| **spec-id** | northgate/toggle |
| **revision** | 1 |
| **status** | approved |

## Purpose

Turns one setting on or off, and the change takes effect immediately, with no Save button. For a choice that is saved later with a form use a checkbox; for one of several options use a radio group.

## Anatomy

1. Track, a rounded pill.
2. Knob, a circle inside the track: left when Off, right when On.
3. Optional label to the right. Gap 8 (spacing-8).

## Sizes (each value is a token)

| Size | Track | Knob | Label |
|---|---|---|---|
| Large | 40 x 24 (spacing-40, spacing-24) | 20 (spacing-20) | IBM Plex Sans Regular 14 (size/body), line/body 22 |
| Medium | 32 x 20 (spacing-32, spacing-20) | 16 (spacing-16) | 14 (size/body), line/body 22 |
| Small | 24 x 16 (spacing-24, spacing-16) | 12 (spacing-12) | 12 (size/meta), line/meta 18 |

- The knob sits 2 (spacing-2) from the track edge on every side. The track is fully round.
- A toggle with no visible label uses Large (WCAG 2.2 minimum target 24).

## Values and states

Value: Off, On. State: Default, Hover, Focus, Disabled. Colours are the Checkbox tokens (components/checkbox/track-*, knob-*).

| Value and state | Track | Track border | Knob |
|---|---|---|---|
| Off, Default | border/strong | none | surface/raised |
| Off, Hover | text/dim | none | surface/raised |
| Off, Focus | border/strong + ring outside | none | surface/raised |
| On, Default | action/default | border/action 1 | text/on-action |
| On, Hover | action/hover | border/action 1 | text/on-action |
| On, Focus | action/default + ring outside | border/action 1 | text/on-action |
| Off, Disabled | border/default | none | surface/raised |
| On, Disabled | border/default | none | text/dim |

- Focus ring: 2 (stroke/focus), 2 gap (spacing-2) outside the track, colour border/focus for both values, as on Button, Input, Checkbox and Radio. (Figma Off/Focus used text/primary; corrected to border/focus in revision 1.)
- The On knob is dark (text/on-action), like the mark of Checkbox and the dot of Radio: a light knob on the light action track was 1.3:1. Corrected in Figma (components/checkbox/knob-on-on-*) in revision 1.
- The value is never carried by colour alone: the knob position says On or Off. In forced colours the track is drawn in Highlight when On.
- Motion: the knob slides and the track colour changes in 120 ms; none under prefers-reduced-motion.
- Label colour is text/primary, text/dim when disabled.

## Behaviour

- It is a native checkbox with role switch. Space toggles it. The label is part of the click target.
- The label names the setting ("Card payments abroad"), not the action; the state is announced by the switch role.
- It acts at once. If saving can fail, the product shows the failure and puts the switch back.
- Disabled cannot be focused or changed.

## Content rules

- Label: a noun phrase for the setting, in normal case, no colon, positive wording. Do not write "Enable" or "Turn on" in the label.

## Acceptance checks

1. Track, knob, label and colours match the Figma component in every size, value and state.
2. It is exposed as a switch with its label as the name; clicking the label and Space both toggle it.
3. Disabled is skipped by Tab and cannot change.
4. Track passes 3:1 against the page when Off; knob passes 3:1 on the track in both values (enabled states); label 4.5:1; focus ring 3:1.
5. The state is readable in forced colours.
6. No raw colour or size values in code; motion respects prefers-reduced-motion.
