# Skeleton

| Field | Value |
|---|---|
| **spec-id** | northgate/skeleton |
| **revision** | 1 |
| **status** | approved |

## Purpose

A quiet placeholder in the shape of content that is still loading. Use when the layout is known and the data is not. Not for a wait with no layout (use Spinner) and not for a known amount (Progress bar).

## Shapes

| Shape | Size | Radius |
|---|---|---|
| Text line | 240 (container/skeleton) x 14 | full (radius-full) |
| Block | 240 (container/skeleton) x 96 | 4 (radius-xs-4) |
| Circle | 40 x 40 | full |

The product sets its own width and height to match what will arrive.

## Pulse

It changes between surface/sunken (Dim) and surface/hover (Bright), 1.4 seconds each way, ease in and out. With prefers-reduced-motion it stays Dim and does not move.

## Behaviour

- Decorative: hidden from assistive technology. The region that is loading carries aria-busy; the product announces the result when it arrives.
- A skeleton is never interactive and never holds text.

## Acceptance checks

1. Size, radius and the two colours match Figma for every shape and pulse.
2. It is not read by a screen reader; with reduced motion it does not animate.
