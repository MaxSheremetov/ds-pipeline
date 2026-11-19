# Toast

| Field | Value |
|---|---|
| **spec-id** | northgate/toast |
| **revision** | 1 |
| **status** | approved |

## Purpose

A short message that floats above the page after something the person did ("Saved", "Account archived. Undo"). Not for errors that block the person (use Notice) and not for the only copy of important information.

## Anatomy

1. Container: width 420 (container/toast), border 1 (stroke/border) in border/subtle, radius 8 (radius-md-8), fill surface/raised, shadow elevation/overlay, padding 8 (spacing-8) with 12 on the start edge, gap 8.
2. Rail: 4 (spacing-4) wide, full height, drawn over the start edge, in components/status/fg-*-subtle.
3. Icon 24, default per status; colour components/status/fg-*-subtle.
4. Text: IBM Plex Sans Regular 14 (size/body), line/body 22, text/primary. One sentence.
5. Optional action: one quiet Small Button.
6. Optional close: Interactive icon Medium (32) in its standalone colour; it reaches into the padding, so a one-line toast is 40 tall.

## Status

Neutral, Success, Warning, Error, Info (rail and icon change; the surface does not).

## Behaviour

- The component only draws the toast. It does not time out, queue, stack or position itself; a host does that. A host must give enough time to read and act (WCAG 2.2.1), pause on hover and focus, and keep errors until closed.
- Error uses role alert; the others use role status.
- The action and the close button are real buttons in the tab order.

## Acceptance checks

1. Width, padding, radius, shadow, rail, type and colours match Figma for every status.
2. Role follows the status; the action and the close button are named and work by keyboard.
3. In forced-colors mode the edge and rail stay visible.
