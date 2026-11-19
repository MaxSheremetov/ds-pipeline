# Card

| Field | Value |
|---|---|
| **spec-id** | northgate/card |
| **revision** | 1 |
| **status** | approved |

## Purpose

A raised surface that groups related content under an optional heading: a summary, a set of fields, a list. Not a page section divider (use headings and spacing) and not a clickable tile (the card itself is not interactive).

## Anatomy

Surface/raised, 1 (stroke/border) border in border/default, radius 8 (radius-md-8). Sizes set padding and gap: Small 16/8, Medium 24/16, Large 32/24 (spacing tokens). Optional header: title (SemiBold, track-heading) with an optional action on the right; a supporting line below the title in Medium and Large only (text/dim). Body: free content.

## Behaviour

- The title is a heading; its level is chosen by the product to fit the page outline (default 3).
- The card is not focusable and not a landmark. Interactive content inside it (the action, links, buttons) is reachable in reading order.
- Without a title and without an action there is no header.

## Acceptance checks

1. Padding, gap, border and radius match the Figma component Card for Small, Medium and Large.
2. The title is a heading of the requested level.
3. The supporting line is hidden in Small.
4. Text meets 4.5:1 on raised; in forced-colors mode the border remains visible.
5. No raw colour or size values in code.
