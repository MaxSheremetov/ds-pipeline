# File row

| Field | Value |
|---|---|
| **spec-id** | northgate/file-row |
| **revision** | 1 |
| **status** | approved |

## Purpose

One uploaded file in a list under a Dropzone: its name, size, and how the upload is going. Not the place to drop files.

## Anatomy

A row with a file icon (20), name and size, then the state, then actions. Uploading: a thin Progress bar under the name, no label or value. Done: a success icon (16). Error: an error icon (16), the message under the name in the error colour, and the error outline on the row. Actions: Interactive icon buttons Medium for Retry (error only) and Remove.

## Behaviour

- A group named by the file name.
- Uploading shows a named progress bar ("Uploading <name>"); Done and Error show an icon with a text name ("Uploaded", "Failed").
- The error message is announced (role alert).
- Buttons are named after the file ("Remove <name>", "Retry <name>"); words can be translated by the product. Retry shows only after a failure; Remove only when the product passes a handler.

## Acceptance checks

1. Layout, icons, bar and colours match the Figma component File row for Uploading, Done and Error.
2. Every button has the file name in its accessible name.
3. Status is not conveyed by colour alone.
4. Text meets 4.5:1 on each row background.
5. No raw colour or size values in code.
