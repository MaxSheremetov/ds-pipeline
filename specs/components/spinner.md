# Spinner

| Field | Value |
|---|---|
| **spec-id** | northgate/spinner |
| **revision** | 1 |
| **status** | approved |

## Purpose

Shows that something has started and has not finished, when the length is not known. For a known amount use Progress bar; for content that will fill a space use Skeleton.

## Anatomy

One arc of 270 degrees, drawn from the top clockwise, with round ends, centred in a square box. The box is the icon slot it sits in.

| Size | Box | Arc across | Stroke |
|---|---|---|---|
| Large | 20 (spacing-20) | 14 | 2 (stroke/focus) |
| Medium | 16 (spacing-16) | 10 | 2 (stroke/focus) |
| Small | 12 (spacing-12) | 8 | 1 (stroke/border) |

A Button's icon slot is 16, so a loading Button uses Medium.

## Colour and motion

- Colour is currentColor: it follows the text beside it. On its own it is components/icon/fg-standalone (text/primary).
- It turns about its centre once a second, linear, forever. With prefers-reduced-motion it turns three times slower, so it still shows activity.

## Behaviour

- On its own it is a status with the text "Loading" (the word can change for other languages).
- Inside something that already announces the state (a Button with a loading message) it is decorative and hidden from assistive technology.

## Acceptance checks

1. Box, arc and stroke match Figma in every size.
2. Alone it is announced as a status; decorative it is silent.
3. In forced-colors mode the arc stays visible.
