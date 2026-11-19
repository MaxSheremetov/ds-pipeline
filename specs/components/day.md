# Day

| Field | Value |
|---|---|
| **spec-id** | northgate/day |
| **revision** | 1 |
| **status** | approved |

## Purpose

One day cell for a calendar: a button showing a date number. This spec covers the cell only. The calendar grids (Date picker, Date range) are specified separately, because they need grid keyboard behaviour.

## Anatomy

40 wide and 36 tall (container-day-width, container-day-height), radius 4 (radius-xs-4), number in mono 12/18. States: Default, Hover, Focus, Today, Outside (another month, dimmed), Selected, Range start, In range (no radius), Range end, Disabled (dimmed text, no fill).

## Behaviour

- A button named by the full date ("18 November 2026"), not the bare number.
- Selected, Range start and Range end say aria-pressed="true"; Today says aria-current="date".
- One visual state is derived with this priority: Disabled, range, Selected, Today, Outside.
- Disabled cells ignore presses.

## Acceptance checks

1. Size, radius, type and colours match the Figma component Day for all ten states.
2. The accessible name is the full date.
3. Selected and today are not shown by colour alone.
4. Number text meets 4.5:1 in every state; in forced-colors mode selected is distinguishable.
5. No raw colour or size values in code.

## Open questions for the designer

- Cell 40×36 is not on the spacing scale (container tokens). Snap to 40×40?
- Disabled has no grey fill here, unlike Tabs. Keep it this way?
- Today is a lime border on white, which has low contrast; the text colour carries it too. OK?
