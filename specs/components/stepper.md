# Stepper

| Field | Value |
|---|---|
| **spec-id** | northgate/stepper |
| **revision** | 1 |
| **status** | approved |

## Purpose

Shows where the person is in a short, ordered process (a transfer, a set-up) and how many steps remain. Not navigation between pages and not a progress bar for time.

## Anatomy

A row of steps joined by connectors. Each step: a disc of 28 (container-stepper-disc) with a 2 border, a number in mono 14/22, and a label below at 12/18. States: Upcoming, Current, Done. Done shows a tick (16) in place of the number. A connector is 2 tall and fills the space between two steps; there is none after the last step.

## Behaviour

- An ordered list with an accessible name given by the product.
- The current step has aria-current="step". Done and current are also said in words ("completed", "current step") for screen readers.
- State comes from one index: steps before it are Done, it is Current, steps after are Upcoming. An index past the end marks all Done.
- The stepper is not interactive.

## Acceptance checks

1. Disc, border, connector and type match the Figma component Step for Upcoming, Current and Done.
2. Exactly one step has aria-current="step".
3. State is not conveyed by colour alone (number, tick and words).
4. Labels meet 4.5:1; in forced-colors mode discs keep an edge.
5. No raw colour or size values in code.

## Open questions for the designer

- The disc is 28, which is not on the spacing scale; it is a container token. Snap to 24 or 32?
