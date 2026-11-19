import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { elevationKeys, radiusKeys, spacingKeys, stateKeys, strokeKeys } from './tokens';
import { Code, Grid, H1, H2, Lead, page } from './ui';

const meta = { title: 'Foundations/Spacing, shape and state', tags: ['!manifest'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box: React.CSSProperties = { border: 'var(--ds-stroke-border) solid var(--ds-colour-border-default)', background: 'var(--ds-colour-surface-raised)', borderRadius: 'var(--ds-radius-xs-4)', padding: 'var(--ds-spacing-12)' };

export const SpacingShapeState: Story = {
  render: () => (
    <main style={page}>
      <H1>Spacing, shape and state</H1>
      <Lead>Spacing is a scale of fixed steps named by their pixel value. Heights of controls are spacing tokens too (40, 32, 24). Radius, stroke, elevation and the state overlays are tokens; nothing in a component is a raw number.</Lead>
      <H2>Spacing</H2>
      <div style={{ display: 'grid', gap: 'var(--ds-spacing-4)' }}>
        {spacingKeys().filter((s) => s.px > 0).map((s) => (
          <div key={s.key} style={{ display: 'grid', gridTemplateColumns: '120px 60px 1fr', alignItems: 'center', gap: 'var(--ds-spacing-12)' }}>
            <Code>{`--ds-spacing-${s.key}`}</Code>
            <span>{s.px}px</span>
            <div style={{ height: 'var(--ds-spacing-12)', width: `var(--ds-spacing-${s.key})`, background: 'var(--ds-colour-action-default)', borderRadius: 'var(--ds-radius-xxs-2)' }} />
          </div>
        ))}
      </div>
      <H2>Radius</H2>
      <Grid min={110}>
        {radiusKeys().map((r) => (
          <div key={r.key} style={{ display: 'grid', gap: 'var(--ds-spacing-8)', justifyItems: 'start' }}>
            <div style={{ width: 'var(--ds-spacing-64)', height: 'var(--ds-spacing-64)', background: 'var(--ds-colour-surface-sunken)', border: 'var(--ds-stroke-border) solid var(--ds-colour-border-strong)', borderRadius: `var(--ds-radius-${r.key})` }} />
            <Code>{`radius-${r.key}`}</Code>
          </div>
        ))}
      </Grid>
      <H2>Stroke</H2>
      <div style={{ display: 'flex', gap: 'var(--ds-spacing-24)', flexWrap: 'wrap' }}>
        {strokeKeys().map((s) => (
          <div key={s.key} style={{ display: 'grid', gap: 'var(--ds-spacing-8)' }}>
            <div style={{ width: 'var(--ds-spacing-96)', height: 0, borderTop: `var(--ds-stroke-${s.key}) solid var(--ds-colour-text-primary)` }} />
            <Code>{`stroke-${s.key}: ${s.px}px`}</Code>
          </div>
        ))}
      </div>
      <H2>Elevation</H2>
      <Grid min={180}>
        {elevationKeys().map((e) => (
          <div key={e} style={{ ...box, boxShadow: `var(--ds-elevation-${e})`, display: 'grid', gap: 'var(--ds-spacing-4)', height: 'var(--ds-spacing-80)', alignContent: 'center', justifyItems: 'start' }}>
            <span style={{ fontWeight: 'var(--ds-type-weight-medium)' }}>{e}</span>
            <Code>{`--ds-elevation-${e}`}</Code>
          </div>
        ))}
      </Grid>
      <H2>State overlay</H2>
      <Lead>A button on hover or pressed is its own fill with a layer of the overlay colour on top at this strength. Focus and disabled do not use an overlay.</Lead>
      <div style={{ display: 'flex', gap: 'var(--ds-spacing-24)', flexWrap: 'wrap' }}>
        {stateKeys('overlay').filter((s) => s.pct > 0).map((s) => (
          <div key={s.key} style={{ display: 'grid', gap: 'var(--ds-spacing-8)' }}>
            <div style={{ width: 'var(--ds-spacing-96)', height: 'var(--ds-spacing-40)', borderRadius: 'var(--ds-radius-xs-4)', background: `color-mix(in srgb, var(--ds-colour-text-primary) var(--ds-state-overlay-${s.key}), var(--ds-colour-action-default))` }} />
            <Code>{`state-overlay-${s.key}: ${s.pct}%`}</Code>
          </div>
        ))}
      </div>
    </main>
  ),
};
