import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { colourGroups, primitiveGroups, swatches } from './tokens';
import type { Swatch } from './tokens';
import { Code, Grid, H1, H2, Lead, page } from './ui';

const meta = { title: 'Foundations/Colour', tags: ['!manifest'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Chip = ({ s }: { s: Swatch }) => (
  <div style={{ border: 'var(--ds-stroke-border) solid var(--ds-colour-border-default)', borderRadius: 'var(--ds-radius-xs-4)', overflow: 'hidden', background: 'var(--ds-colour-surface-raised)' }}>
    <div style={{ height: 'var(--ds-spacing-56)', background: `var(${s.cssVar})`, display: 'flex', alignItems: 'flex-end', padding: 'var(--ds-spacing-8)' }}>
      <span style={{ background: 'var(--ds-colour-surface-raised)', color: 'var(--ds-colour-text-primary)', borderRadius: 'var(--ds-radius-xxs-2)', padding: '0 var(--ds-spacing-4)', fontSize: 'var(--ds-type-fs-meta)', lineHeight: 'var(--ds-type-line-meta)', fontWeight: 'var(--ds-type-weight-medium)' }}>{s.hex}</span>
    </div>
    <div style={{ padding: 'var(--ds-spacing-8)', display: 'grid', gap: 'var(--ds-spacing-2)' }}>
      <span style={{ fontWeight: 'var(--ds-type-weight-medium)' }}>{s.name}</span>
      <Code>{s.cssVar}</Code>
      {s.alias ? <span style={{ color: 'var(--ds-colour-text-dim)', fontSize: 'var(--ds-type-fs-meta)' }}>{s.alias.replace('primitive.', '')}</span> : null}
    </div>
  </div>
);

/** Roles are what components use. Primitives are the raw ramp the roles point at; use a role, never a primitive, in a component. */
export const Colour: Story = {
  render: () => (
    <main style={page}>
      <H1>Colour</H1>
      <Lead>Every colour is a role token that points at a primitive. Components use roles (<Code>--ds-colour-*</Code>) or component tokens (<Code>--ds-component-*</Code>), never primitives and never raw values. Changing a primitive in Figma changes every role that points at it.</Lead>
      {colourGroups.map((g) => (
        <section key={g}>
          <H2>{g[0].toUpperCase() + g.slice(1)} roles</H2>
          <Grid>{swatches(`colour.${g}`, `colour-${g}`).map((s) => <Chip key={s.name} s={s} />)}</Grid>
        </section>
      ))}
      <H2>Primitives</H2>
      {primitiveGroups.map((g) => (
        <section key={g} style={{ marginBottom: 'var(--ds-spacing-16)' }}>
          <h3 style={{ margin: '0 0 var(--ds-spacing-8)', fontSize: 'var(--ds-type-fs-body)', fontWeight: 'var(--ds-type-weight-medium)' }}>{g}</h3>
          <Grid min={120}>{swatches(`primitive.${g}`, `primitive-${g}`).map((s) => <Chip key={s.name} s={{ ...s, name: `${g}/${s.name.split('/')[1]}` }} />)}</Grid>
        </section>
      ))}
    </main>
  ),
};
