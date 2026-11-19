# Modal

| Field | Value |
|---|---|
| **spec-id** | northgate/modal |
| **revision** | 2 |
| **status** | approved |

## Purpose

A dialog that stops the page until it is answered or dismissed: confirm a destructive action, collect a short decision, show a result that needs attention. Not for a task that belongs to the page behind it (use a Drawer), not for a small floating panel (use a Popover), not for a message that needs no answer (use a Notice or a Toast).

## Anatomy

Panel: surface/raised, radius 8 (radius-md-8), shadow Elevation/3 Overlay (--ds-elevation-overlay), clips its content. Three rows:
1. Header: padding 12 (spacing-12), gap 8 (spacing-8), 1 (stroke/border) line below in border/subtle. Text column with gap 4 (spacing-4): Title, IBM Plex Sans SemiBold 19 (size/section), line/section 22, text/primary; optional supporting line Regular 12 (size/meta), line/meta 18, text/dim. The title row is 24 tall and may start with an optional 16 icon (Figma property Show icon, gap 8), decorative: the title stays the accessible name. At the right a Close: Icon button, Quiet, Large (40), icon x.
2. Body: padding 12, gap 8, text/primary; scrolls when taller than the screen.
3. Footer (optional): padding 12, gap 8, 1 line above in border/subtle, fill surface/raised. Actions are aligned to the right (decided in revision 2; Figma changed to match): the secondary action first, then the decisive one (Button Medium, 32). The Figma footer may also carry a Hint at the left; the Hint fills the free width so the actions stay at the right edge with or without it.

## Sizes (each width is a container token)

| Size | Width |
|---|---|
| Small | 420 (container-modal-small) |
| Medium | 560 (container-modal-medium) |
| Large | 760 (container-modal-large) |

Height follows the content. On a narrow screen the width is capped to the viewport minus 32 (spacing-32). The page behind is dimmed with a scrim: text/primary at 40% (state-opacity/scrim). Figma draws it as the master Scrim (text/primary at 40% opacity); the code uses the same pair.

## Behaviour

- Opens centred. Focus moves into the modal, is held inside while it is open, and returns to the element that opened it.
- On open, focus goes to the first focusable element, which is the Close button; its focus ring is therefore visible at once (decided: kept, the library's default).
- Escape and the Close button dismiss it; clicking the scrim dismisses it. A decision that must not be lost by a stray click keeps the user in the modal and asks.
- The page behind is inert (not read, not reachable by Tab).
- The title is the accessible name; the supporting line is the accessible description.
- The close button is always present; its name is "Close" or the product's word.

## Content rules

- Title: what is being decided, in normal case, no full stop ("Delete three mandates").
- The decisive button repeats the verb of the title ("Delete", not "OK"). One Primary or Danger button; the other is Secondary.
- Do not open a modal from another modal.

## Acceptance checks

1. Width, padding, gap, radius, header, body and footer match the Figma component Modal in every size.
2. Focus is trapped and returns to the trigger; Escape closes; the title names the dialog.
3. Text meets 4.5:1 on raised; the close and action buttons keep their own checks; in forced-colors mode the panel has an edge.
4. No raw colour or size values in code.
