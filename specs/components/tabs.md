# Tabs

| Field | Value |
|---|---|
| **spec-id** | northgate/tabs |
| **revision** | 2 |
| **status** | approved |

## Purpose

Choose one of several views. One mechanism drawn three ways. Underline and Enclosed are tabs: they sit above a region and change what is below it. Segmented is a control: a sunken track with the chosen item raised out of it, used inline where tabs would wrongly promise that the whole region changes. Use for two to six sibling views of one object. More than six is a select or a side nav; a sequence done in order is a stepper; filtering a list is a select with multiple selection.

## Anatomy

1. Bar (TabList): holds the tab items. Underline and Enclosed have a 1 (stroke/border) line under the bar in border/subtle. Segmented has a track (components/tab/track-segmented), a 1 border (components/tab/track-border-segmented), radius 4 (radius-xs-4), 2 (spacing-2) between items; it clips its items so the first and last take its corners.
2. Tab item: 40 tall (spacing-40), padding 0 12 (spacing-12), gap 8 (spacing-8), 1 border (stroke/border).
3. Optional icon, 16 (spacing-16).
4. Label, IBM Plex Sans Regular 14 (size/body), line/body 22.
5. Optional count, Regular 12 (size/meta), line/meta 18, in the colour of the label of that state.
6. Selected mark: 2 (spacing-2) bar along the bottom of the item in border/action (components/tab/indicator-*); Underline and Enclosed only.

Underline and Enclosed items have radius 4 (radius-xs-4) on the top corners; Segmented items are square.

## Style and state (colour tokens components/tab/*)

States: Default, Hover, Selected, Selected hover, Disabled, Focus. Colours are components/tab/bg-, fg-, border-<style>-<state>.

| Style | Default | Hover | Selected | Selected hover |
|---|---|---|---|---|
| Underline | transparent, text/dim | surface/hover, text/dim | surface/raised, text/primary, mark | same as Selected |
| Enclosed | transparent, text/dim | surface/hover, text/dim | surface/raised, text/primary, border/default, mark | same as Selected |
| Segmented | transparent, text/primary | surface/hover, text/primary | surface/raised, text/primary, border/subtle | same as Selected |

- Disabled (all three styles): fill surface/sunken (components/tab/bg-*-disabled), label text/dim, no hover, not focusable. The grey fill tells it apart from Default (transparent) and from Hover (surface/hover) as the Button and Input do; the system does not fade disabled items with opacity.
- Focus: a 2 (stroke/focus) ring in border/focus drawn inside the item, radius 2 (radius-xxs-2).

## Behaviour

- The bar is a tablist with an accessible name (required); each item is a tab with aria-selected; the content is a tabpanel.
- Tab moves into the bar (to the selected tab), then out to the panel. Arrow keys move between tabs and select them; Home and End go to the first and last. A disabled tab is skipped.
- Selection is the product's: give the bar a value and an onValueChange, or a default value.
- Selected is never shown by colour alone: the label ink changes and Underline and Enclosed carry the 2 mark; Segmented has the raised item with a border. In forced colours the selected item gets a CanvasText border and mark.

## Content rules

- Labels one or two words. A count only when the number is the reason to go there; show a zero rather than hiding an empty tab. Give every tab its own URL where the product can. Never nest one tab strip in another; do not use tabs for a wizard.

## Acceptance checks

1. Height, padding, gap, radius, icon, label, count and colours match the Figma component Tab item in every style and state; the bar matches Tabs and Segmented control.
2. Tablist has a name; tabs have aria-selected; arrow keys move between and select tabs; Tab leaves the bar; disabled tabs are skipped and cannot be chosen.
3. Label passes 4.5:1 in every state (Hover 4.62 is the lowest); focus ring 3:1.
4. Target 140 x 40 at a minimum of 24 x 24 (WCAG 2.5.8).
5. No raw colour or size values in code.
