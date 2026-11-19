# Avatar

| Field | Value |
|---|---|
| **spec-id** | northgate/avatar |
| **revision** | 1 |
| **status** | approved |

## Purpose

A small round picture or initials that stands for one person or account. Not a status indicator and not a button.

## Anatomy

Circle, sizes Large 40, Medium 32, Small 24 (spacing tokens). Initials type: first letters of the first and last word of the name, Regular 12/18, on status standalone background with its matching foreground. Photo type: the image fills the circle; if it is missing or fails to load, a person icon on surface/pressed is shown instead.

## Behaviour

- The avatar is one image named by the person (aria-label = name); the initials and the photo carry no text of their own for assistive technology.
- It is not focusable. Wrap it in a button or link when it must act.
- A photo that fails to load falls back to the placeholder; layout does not shift.

## Acceptance checks

1. Sizes and colours match the Figma component Avatar for Initials and Photo.
2. Initials come from the name (first and last word, capitals).
3. The accessible name is the person's name; it is not read twice.
4. Initials meet 4.5:1 on their background.
5. No raw colour or size values in code.
