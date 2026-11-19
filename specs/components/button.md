# Button

| Field | Value |
|---|---|
| **spec-id** | northgate/button |
| **revision** | 6 |
| **status** | approved |

## Purpose

Triggers an action. One primary button per view.

## Variants and states

- Variants: primary, secondary, quiet, danger (as in the Figma component Button)
Sizes (each value is a token):

| Size | Height | Padding left and right | Gap | Radius | Label size | Label line height |
|---|---|---|---|---|---|---|
| Large | 40 (spacing-40) | 12 (spacing-12) | 8 (spacing-8) | 4 (radius-xs-4) | 14 (size/body) | 22 (line/body) |
| Medium | 32 (spacing-32) | 10 (spacing-10) | 8 (spacing-8) | 4 (radius-xs-4) | 12 (size/meta) | 18 (line/meta) |
| Small | 24 (spacing-24) | 8 (spacing-8) | 8 (spacing-8) | 2 (radius-xxs-2) | 11 (size/micro) | 16 (line/micro) |

Label: IBM Plex Mono Medium, UPPERCASE, tracking 0.7 (track/caps). Write the label in normal case in content; the case is applied by the style. Icon slot 16. Height is a minimum: the label never wraps, and when the person enlarges text the button grows taller instead of clipping it.
- Touch target: no button is narrower than 24 (spacing-24), the WCAG 2.2 minimum, so a short label in Small (for example "OK") still meets it.
- States: default, hover, pressed, focus, disabled, loading

## Behaviour

- Enter and Space activate the button.
- Loading blocks repeated clicks and shows a spinner in the leading icon slot. The label stays, so the button becomes wider by the 16px slot plus the 8px gap (Large: 70 to 94).
- Loading is announced with aria-busy, a visually hidden word after the label ("Loading" by default; a prop for other languages) that is read with the button name, and a polite status message announced once when loading starts.
- Icons are decorative (16px slot, before or after the label).

## Acceptance

- [ ] Focus ring is a 2px ring in border/focus, drawn outside the button with a 2px gap, the same for every variant. It follows the keyboard (focus-visible), not the mouse. It is visible on both page colours (3:1).
- [ ] Loading adds a spoken word to the button name and one announcement; text enlarged to 200% does not clip the label.
- [ ] Disabled button is not focusable and does not fire clicks.
- [ ] No colour or size is hard-coded; every value is a token.
- [ ] Text contrast is at least 4.5:1 in every variant and state.
