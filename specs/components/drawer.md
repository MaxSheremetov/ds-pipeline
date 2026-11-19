# Drawer

| Field | Value |
|---|---|
| **spec-id** | northgate/drawer |
| **revision** | 2 |
| **status** | approved |

## Purpose

A panel that slides from the edge of the screen for a task that belongs to the page behind it: record details, a longer form, filters. It keeps the context visible at the side, where a Modal would cover it. Not for a quick yes or no (use a Modal).

## Anatomy

The same parts as the Modal: Panel (surface/raised, shadow Elevation/3 Overlay), Header (Title SemiBold 19, optional supporting line, Close: Icon button Quiet Large), Body (padding 12, scrolls), optional Footer (line above, actions aligned to the right). The Title may start with the optional 16 icon, as in the Modal. See northgate/modal for the values.

## Sides

| Side | Size | Rounded corners |
|---|---|---|
| Right | 560 wide (container-drawer), full height | left two, radius 8 (radius-md-8) |
| Left | 560 wide (container-drawer), full height | right two |
| Bottom | full viewport width, height follows the content (Figma shows 218; its 900 width is only the demo frame, decided) | top two |

Only the corners that face the page are rounded; the edge on the screen border is square. Width is capped to the viewport minus 32 (spacing-32). A scrim dims the page (text/primary at state-opacity/scrim, 40%).

## Behaviour

- Behaves as a Modal: focus moves in and is held inside, returns to the trigger; Escape, the Close button and a click on the scrim dismiss it; the page behind is inert.
- Title is the accessible name, the supporting line the description.
- Bottom is for short, touch-first tasks; Right is the default for details and forms; Left for navigation-like content.

## Content rules

- Same as Modal. A form in a drawer keeps its save and cancel actions in the footer so they stay visible while the body scrolls.

## Acceptance checks

1. Width, padding, radius (only the inner corners), header, body and footer match the Figma component Drawer for each side.
2. Focus is held and returns; Escape closes; the title names the dialog.
3. Text meets 4.5:1; in forced-colors mode the panel has an edge.
4. No raw colour or size values in code.
