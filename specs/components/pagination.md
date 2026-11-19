# Pagination

| Field | Value |
|---|---|
| **spec-id** | northgate/pagination |
| **revision** | 1 |
| **status** | approved |

## Purpose

Pages, not endless scroll. The count on the left is the point: an operator must know whether there are twelve records or twelve thousand. Use for a list a person has to work through, where the total matters (reconciliation, audit, export). Not for a feed with no end, fewer than about twenty rows, or finding one record (a filter).

## Anatomy

1. Bar: padding 8 top and bottom (spacing-8), gap 12 (spacing-12), count on the left and controls on the right.
2. Count: "1–50 of 1 284", IBM Plex Mono Regular 12 (size/meta), line/meta 18, text/dim. Range and total are real numbers.
3. Previous and Next: Icon button, Secondary, Large (40), chevron-left and chevron-right.
4. Page run: page numbers 40 x 40, 4 (spacing-4) apart.
5. Page number: 40 x 40 (spacing-40), radius 4 (radius-xs-4), 1 border, IBM Plex Mono Regular 14 (size/body), line/body 22.

## Page number states (colour tokens components/tab/*-enclosed-*)

| State | Fill | Text | Border |
|---|---|---|---|
| Default | transparent | text/dim | transparent |
| Hover | surface/hover | text/dim | transparent |
| Current | surface/raised | text/primary | border/default |
| Disabled | transparent | text/dim, 40% opacity (state-opacity/disabled) | transparent |
| Focus | as Default | | 2 (stroke/focus) ring in border/focus drawn inside |

## Behaviour

- A nav landmark with an accessible name (default "Pagination"). The current page has aria-current="page" and does nothing when chosen. Previous and Next are buttons named "Previous page" and "Next page"; they are disabled on the first and last page, never hidden, so the row does not reflow. Page numbers are named "Page N".
- The run keeps a constant length (two siblings plus first, last, current and two gaps by default). A gap is a 40 x 40 ellipsis that is not focusable and is hidden from assistive technology. The first and last page are never collapsed.
- The page is the product's to keep, and to put in the URL.

## Acceptance checks

1. Bar, count, controls and page numbers match the Figma components Pagination and Page number in every state.
2. Nav with a name; current page marked; Previous disabled on page 1 and Next on the last page; gaps not focusable.
3. Text passes 4.5:1 (Hover 4.62 is the lowest); focus ring 3:1; page number 40 x 40 (WCAG 2.5.8).
4. No raw colour or size values in code.
