# ds-pipeline: instructions for Claude

Read ARCHITECTURE.md first. This repo is a designer-owned UI library pipeline (React, Storybook, tokens from Figma). Lab project, Northgate is the first system.

## Rules
- Never write a raw colour or px size in `packages/ui`; use `var(--ds-*)` from `packages/tokens`. `npm run gates` enforces it.
- `packages/tokens/dist/` is generated. Edit `packages/tokens/src/tokens.json` (and Figma), never dist.
- Figma is the source of truth for values. `figma/figma-export.json` is the last read from Figma; refresh it with /sync-tokens before trusting it.
- Differences you accept must be listed with a reason in `figma/known-drift.json`. Unlisted drift fails the gate.
- Logic lives in npm scripts. CI files in `deploy/` only call `npm run ci`.

## Commands (npm)
- `npm run tokens:build`: DTCG tokens to CSS variables.
- `npm run gates`: every gate, one report.
- `npm run ci`: install, build, gates.

## /sync-tokens (Claude, needs Figma MCP)
Read variables of the Figma file in `figma/system.json` with use_figma, write `figma/figma-export.json` in the same shape (roles, scales), run `npm run gates`, report the diff. Do not edit tokens.json silently to make a gate pass.

## Figma Specs (verified 2026-11-17)
Read and edit through `figma.spec.*` in use_figma; comment in a separate call from the edit; strip `[comment:uuid]` markers when mirroring to `specs/`.

## Storybook MCP (agents read the real components)
Run `npm run storybook:build`, serve `apps/storybook/storybook-static`, or `npm run dev -w @ds/storybook` (port 6006). MCP endpoint: http://localhost:6006/mcp.
Connect: `claude mcp add --transport http storybook http://localhost:6006/mcp`. Tools: stories-find-by-component, docs-list, docs-show, docs-show-story, get-storybook-story-instructions, stories-preview, stories-changed.
Before building a screen: read the component docs through the MCP server; use only library components; if one is missing, say so and propose a new component and spec instead of improvising CSS.

## Specs mirror
`specs/components/*.md` mirror the Figma spec (`figma/system.json` specFileKey) with comment markers stripped. A component declares the revision it implements with `@spec <id> r<N>` above its props interface.

## Label and font rules learned
Figma is the truth for a component's look; compare the rendered story with the Figma node (size, font, text case) before calling it done.
