# Dropzone

| Field | Value |
|---|---|
| **spec-id** | northgate/dropzone |
| **revision** | 1 |
| **status** | approved |

## Purpose

The place to drop files, or to choose them with a button. Not the list of files already added (use File row) and not a form field with a value.

## Anatomy

A box with a 2 dashed border, padding 32 vertical and 12 horizontal, gap 8, centred. Icon, title, hint (text/dim) and a secondary Button Medium ("Browse files"). States: Default, Dragging (accent border and background while a file is over it), Error (error border; the error text replaces the hint).

## Behaviour

- A group named by its title and described by the hint.
- The Button opens the file chooser and is reachable by keyboard; the dropzone itself is not a tab stop. The hidden file input is out of the tab order and the accessibility tree.
- While files are dragged over it the state is Dragging; leaving or dropping returns to Default. Drags that carry no files are ignored.
- Dropped and chosen files are handed to the product in one list. Without multiple, only the first file is taken. The product decides what is valid and passes an error text.
- The error is announced (role alert).

## Acceptance checks

1. Padding, gap, border and states match the Figma component Dropzone for Default, Dragging and Error.
2. The whole flow works with the keyboard alone through the Button.
3. The error is announced and shown in text, not colour alone.
4. Text meets 4.5:1; in forced-colors mode the border remains.
5. No raw colour or size values in code.

## Open questions for the designer

- The Figma dash pattern is 6 on, 4 off. CSS dashed cannot reproduce it exactly; the browser picks its own. Accept?
- The Error variant shows the error in the hint slot. Code does the same; should the hint stay visible too?
