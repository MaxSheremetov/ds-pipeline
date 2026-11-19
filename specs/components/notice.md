# Notice

| Field | Value |
|---|---|
| **spec-id** | northgate/notice |
| **revision** | 1 |
| **status** | approved |

## Purpose

An inline message that stays in the page flow: the result of an action, a warning before a risky step, a tip. For a message that appears over the page and goes by itself, use Toast. Not for field errors (Input and Select have their own).

## Anatomy

1. Container: radius 4 (radius-xs-4), padding 12 (spacing-12), gap 8 (spacing-8), max width 560 (container/notice). No border except the rail.
2. Rail: the only edge, on the start side, 6 (spacing-6) wide, inside, in components/status/border-*-solid for Subtle and Solid and components/status/border-*-outline for Outline. It is decoration: the icon and the words carry the status.
3. Icon 24, default per status (Info and Neutral: info, Success: circle-check, Warning: triangle-alert, Error: circle-alert); can be replaced.
4. Title: IBM Plex Mono Regular 14 (size/body), line/body 22. Optional.
5. Message: IBM Plex Sans 12 (size/meta), line/meta 18, colour components/status/body-*. Optional.
6. Actions: one or two Small buttons under the message, gap 8. Not with Solid.
7. Close: Interactive icon Large (40) pulled into the padding (margin -8). Optional.

## Status and style

Status: Neutral, Success, Warning, Error, Info. Style: Subtle and Outline (fill surface/sunken), Solid (fill components/status/bg-*-solid, text on solid). Icon and title use components/status/fg-*.

## Behaviour

- Error uses role alert (announced at once); every other status uses role status (announced politely). The product can override the role.
- The notice does not hide itself. With a close button the product removes it.
- Colour is never the only signal: the icon and the words say the same thing.

## Content rules

- Title: a short statement, no full stop. Message: one or two sentences; say what happened and what to do next.
- Actions are verbs ("Order card"), not "OK".

## Acceptance checks

1. Size, padding, rail, type and colours match Figma for every status and style.
2. Error is announced as an alert, others as status; the close button has a name and works by keyboard.
3. Text meets 4.5:1 on the fill in every status and style; in forced-colors mode the edge and rail stay visible.
