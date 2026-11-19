# Nav

| Field | Value |
|---|---|
| **spec-id** | northgate/nav |
| **revision** | 3 |
| **status** | approved |

## Purpose

The destinations of a product, in an expanded side nav (Nav item) or an icon-only rail (Nav rail item). Together with the top bar and page header they are the shell every screen sits in; this spec covers the items and their list. A rail is a separate component, not a variant of the expanded nav.

## Anatomy

Nav item: 40 tall (spacing-40), the width of its list (container-nav, 248, in the side nav); padding 12 left (spacing-12) and 8 right (spacing-8), gap 8 (spacing-8); square corners.
1. Marker bar on the active item: 3 wide, the full height, in components/nav/marker (border/action, 3.9:1 on the raised fill, so it passes 3:1 on its own). 3 is the Figma value and is not a spacing token; built as spacing-2 plus stroke/border (decided: kept as is).
2. Icon, 20 (spacing-20).
3. Label, IBM Plex Sans Regular 14 (size/body), line/body 22, fills the width and is cut with an ellipsis.
4. Optional count, Regular 12 (size/meta), line/meta 18, at the right edge.
Nav rail item: 40 x 40, the icon centred, no label; its name is the accessible name and a tooltip on the right.
List: items 2 (spacing-2) apart.

## States (colour tokens components/nav/*)

| State | Fill | Marker |
|---|---|---|
| Default | components/nav/bg-default (surface/raised) | none |
| Hover | components/nav/bg-hover (surface/hover) | none |
| Active | components/nav/bg-active (action/default) | yes |
| Active hover | components/nav/bg-active-hover (action/hover) | yes |
| Focus | as Default | none; 2 (stroke/focus) ring in border/focus drawn inside |

Label, count and icon are components/nav/fg (text/primary) in every state. The marker bar is drawn on the active item only, in the rail as in the expanded item (fixed in Figma in revision 2: it was on every rail state).

The active item sets its label and count in SemiBold (weight-semibold), so the selected destination also reads by weight; the name does not change width in a way that moves neighbours because the item has a fixed width.

The active fill is the brand lime (action/default, action/hover on hover), strong enough to read as selected without the marker; label contrast stays above 4.5:1. aria-current="page" still names it for assistive technology.

There is no disabled state by design: a destination a person cannot reach is hidden or marked with a lock, because greyed navigation is a dead end.

## Behaviour

- A nav landmark with an accessible name, a list of links. The active destination carries aria-current="page". An item with an href is a link; without one it is a button (a single-page app that switches views itself).
- Every rail item has an accessible name and a tooltip. Tab goes through the items in order.
- Never put the brand in both the nav and the top bar; swap the destinations rather than hiding the ones you do not need.

## Acceptance checks

1. Height, padding, gap, icon, label, count, marker and colours match the Figma components Nav item and Nav rail item in every state.
2. Nav with a name; links in order; the active item has aria-current="page"; a rail item has a name and a tooltip.
3. Label passes 4.5:1 on every fill (lowest 12.2:1); focus ring 3:1; item 40 tall (WCAG 2.5.8).
4. No raw colour or size values in code.
