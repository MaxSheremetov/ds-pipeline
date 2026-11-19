# Breadcrumb

| Field | Value |
|---|---|
| **spec-id** | northgate/breadcrumb |
| **revision** | 3 |
| **status** | approved |

## Purpose

A trail that answers where am I and what is above me. It is not a history of where the person has been; that is the back button. Use for a hierarchy more than two levels deep, a record reached from a list, or a place where the title alone does not say where it sits. Not for a flat product, steps in a flow (stepper) or where a person came from.

## Anatomy

1. Crumb: 24 tall (spacing-24), padding 0 6 (spacing-6), gap 4 (spacing-4).
2. Optional icon, 16 (spacing-16), on the first crumb only (usually home), in components/breadcrumb/separator.
3. Label, IBM Plex Sans Regular 12 (size/meta), line/meta 18; the Current crumb is SemiBold (weight-semibold).
4. Separator: a chevron-right icon, 16, in components/breadcrumb/separator (text/dim). It belongs to the crumb and is dropped on the last one.

## States

| State | Label | Notes |
|---|---|---|
| Link | components/breadcrumb/fg-link (text/dim) | a link to a level above |
| Hover | components/breadcrumb/fg-link-hover (text/primary) | no underline |
| Current | components/breadcrumb/fg-current (text/primary) | not a link; the last crumb |
| Focus | as Link | 2 (stroke/focus) ring in border/focus drawn inside the crumb |
| Overflow | as Link | the crumb "…", a button; hover and focus as Link |

The Current crumb is SemiBold 12 (decided; Figma updated in revision 2, the system has no Bold weight).

## Behaviour

- A nav landmark with an accessible name (default "Breadcrumb"), an ordered list of crumbs. Every crumb but the last is a link; the last carries aria-current="page" and is text. Separators and the icon are decoration, hidden from assistive technology.
- Overflow: a trail longer than four crumbs (`maxItems`, default 4) keeps the first crumb and the last two and collapses the ones between into an ellipsis crumb (Figma state Overflow of Breadcrumb item: label "…", same look as a Link, same hover and focus). It is a button named "Show hidden pages" that opens a Popover panel (width 320, padding 12) with the skipped levels as links, one per row, in order. Escape closes it and focus returns to the button. The first and last crumbs are never truncated. The collapse depends on the number of crumbs, not on the width of the container.

## Content rules

- Mirror the real hierarchy, not the click path. Use the record's own name as the last crumb. Put the trail above the page title. Never show a trail one level deep or make the current crumb a link to itself.

## Acceptance checks

1. Height, padding, gap, icon, label and colours match the Figma component Breadcrumb item in every state.
2. Nav with a name, ordered list, links in document order, current crumb is not a link and has aria-current="page".
3. Label passes 4.5:1 in every state; focus ring 3:1; crumb is 24 tall (WCAG 2.5.8).
4. No raw colour or size values in code.

## Revision 3 (2026-11-19)

- Overflow added. The Overflow crumb was drawn in Figma by Claude (state Overflow of Breadcrumb item, frame "Breadcrumbs, collapsed", component Breadcrumb menu in a Popover panel) and waits for the designer's review. The collapse depends on the crumb count, not on the width, so it is predictable and testable.

## Open questions for the designer

- Collapse by count (more than four crumbs) or by available width? Count is built.
- Keep the first crumb and the last two, or first and last only?
