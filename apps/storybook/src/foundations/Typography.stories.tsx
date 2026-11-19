import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { typeValue } from './tokens';
import { Code, H1, H2, Lead, page } from './ui';

const meta = { title: 'Foundations/Typography', tags: ['!manifest'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const scale: Array<{ name: string; fs: string; line: string; weight?: string; track?: string; sample: string; face?: 'display' | 'text' | 'mono' }> = [
  { name: 'Display', fs: 'fs-display', line: 'line-display', weight: 'weight-semibold', track: 'track-display', sample: 'Platform console', face: 'display' },
  { name: 'Title', fs: 'fs-title', line: 'line-title', weight: 'weight-semibold', track: 'track-heading', sample: 'Recent transactions' },
  { name: 'Section', fs: 'fs-section', line: 'line-section', weight: 'weight-semibold', track: 'track-heading', sample: 'Account activity' },
  { name: 'Lead', fs: 'fs-lead', line: 'line-lead', sample: 'Statements are sent for this account' },
  { name: 'Body large', fs: 'fs-body-lg', line: 'line-body-lg', sample: 'name@bank.example' },
  { name: 'Body', fs: 'fs-body', line: 'line-body', sample: 'Current account 4412, opened 18 Sep 2026' },
  { name: 'Meta', fs: 'fs-meta', line: 'line-meta', sample: 'We use this for statements only' },
  { name: 'Label', fs: 'fs-label', line: 'line-label', weight: 'weight-medium', track: 'track-caps', sample: 'Account label' },
  { name: 'Micro', fs: 'fs-micro', line: 'line-micro', sample: 'Updated 2 minutes ago' },
];

export const Typography: Story = {
  render: () => (
    <main style={page}>
      <H1>Typography</H1>
      <Lead>One sans family for text and display, one mono family for buttons and code. Sizes and line heights come in pairs; use the pair, never one without the other. The label style is uppercase with wide tracking and is set by the style, so content is written in normal case.</Lead>
      <H2>Scale</H2>
      <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)' }}>
        {scale.map((s) => (
          <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 'var(--ds-spacing-16)', alignItems: 'baseline', borderBottom: 'var(--ds-stroke-border) solid var(--ds-colour-border-subtle)', paddingBottom: 'var(--ds-spacing-12)' }}>
            <div>
              <div style={{ fontWeight: 'var(--ds-type-weight-medium)' }}>{s.name}</div>
              <Code>{`${typeValue(s.fs)}/${typeValue(s.line)}`}</Code>
            </div>
            <div>
              <div
                style={{
                  fontFamily: `var(--ds-type-font-${s.face ?? 'text'}), system-ui, sans-serif`,
                  fontSize: `var(--ds-type-${s.fs})`,
                  lineHeight: `var(--ds-type-${s.line})`,
                  fontWeight: s.weight ? `var(--ds-type-${s.weight})` : 'var(--ds-type-weight-regular)',
                  letterSpacing: s.track ? `var(--ds-type-${s.track})` : undefined,
                  textTransform: s.name === 'Label' ? 'uppercase' : undefined,
                }}
              >{s.sample}</div>
              <Code>{`--ds-type-${s.fs}  --ds-type-${s.line}${s.weight ? `  --ds-type-${s.weight}` : ''}${s.track ? `  --ds-type-${s.track}` : ''}`}</Code>
            </div>
          </div>
        ))}
      </div>
      <H2>Faces</H2>
      <div style={{ display: 'grid', gap: 'var(--ds-spacing-8)' }}>
        <div style={{ fontFamily: 'var(--ds-type-font-text), system-ui, sans-serif', fontSize: 'var(--ds-type-fs-lead)' }}>{String(typeValue('font-text'))} <Code>--ds-type-font-text</Code></div>
        <div style={{ fontFamily: 'var(--ds-type-font-mono), ui-monospace, monospace', fontSize: 'var(--ds-type-fs-lead)' }}>{String(typeValue('font-mono'))} <Code>--ds-type-font-mono</Code></div>
      </div>
      <H2>Weights and tracking</H2>
      <div style={{ display: 'flex', gap: 'var(--ds-spacing-24)', flexWrap: 'wrap' }}>
        {['regular', 'medium', 'semibold'].map((w) => (
          <div key={w}><span style={{ fontWeight: `var(--ds-type-weight-${w})`, fontSize: 'var(--ds-type-fs-lead)' }}>Aa {w}</span> <Code>{`${typeValue(`weight-${w}`)}`}</Code></div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 'var(--ds-spacing-4)', marginTop: 'var(--ds-spacing-12)' }}>
        {['none', 'display', 'heading', 'caps'].map((t) => (
          <div key={t}><span style={{ letterSpacing: `var(--ds-type-track-${t})` }}>Tracking {t}</span> <Code>{`track-${t}: ${typeValue(`track-${t}`)}`}</Code></div>
        ))}
      </div>
    </main>
  ),
};
