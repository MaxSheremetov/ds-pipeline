# Icon

| Field | Value |
|---|---|
| **spec-id** | northgate/icon |
| **revision** | 1 |
| **status** | approved |

## Purpose

A small pictogram that supports a label or stands for an action. The set is 140 outline icons (Lucide), named in Figma as "icon / name". An icon never carries meaning that the text around it does not.

## Sizes (each value is a token)

| Size | Token | Used in |
|---|---|---|
| 12 | spacing-12 | Badge |
| 16 | spacing-16 | Button, Icon button Medium and Small, Input, Table cell |
| 20 | spacing-20 | Icon button Large |
| 24 | spacing-24 | Standalone, and the size the icons are drawn at in Figma |

- Stroke 1.5 (stroke/icon) at every size, round caps and joins. The stroke does not scale with the size.
- Colour is inherited from the parent (currentColor); the Figma fill is components/icon/fg-standalone (text/primary) when it stands alone. An icon takes the ink of the component it sits in.

## Behaviour

- An icon that decorates a label is hidden from assistive technology.
- An icon that stands alone and means something has an accessible name (the label property).
- Do not use an icon as the only carrier of a state; pair it with text.

## Content rules

- Use the name from the set; do not draw one-off icons. If an icon is missing, add it to the Figma set first, then to the code registry.

## Acceptance checks

1. Every icon of the Figma set exists in code under the same name.
2. Sizes resolve to spacing tokens; the stroke resolves to stroke/icon and stays 1.5 at every size.
3. A decorative icon is hidden from assistive technology; a meaningful one has a name.
4. No raw colour or size values in code.
