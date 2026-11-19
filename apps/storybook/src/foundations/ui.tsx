import * as React from 'react';

export const page: React.CSSProperties = { padding: 'var(--ds-spacing-24)', color: 'var(--ds-colour-text-primary)', fontFamily: 'var(--ds-type-font-text), system-ui, sans-serif', fontSize: 'var(--ds-type-fs-body)', lineHeight: 'var(--ds-type-line-body)', maxWidth: 1100 };

export const H1 = ({ children }: { children: React.ReactNode }) => (
  <h1 style={{ margin: '0 0 var(--ds-spacing-8)', fontSize: 'var(--ds-type-fs-title)', lineHeight: 'var(--ds-type-line-title)', fontWeight: 'var(--ds-type-weight-semibold)', letterSpacing: 'var(--ds-type-track-heading)' }}>{children}</h1>
);
export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ margin: 'var(--ds-spacing-32) 0 var(--ds-spacing-12)', fontSize: 'var(--ds-type-fs-section)', lineHeight: 'var(--ds-type-line-section)', fontWeight: 'var(--ds-type-weight-semibold)' }}>{children}</h2>
);
export const Lead = ({ children }: { children: React.ReactNode }) => (
  <p style={{ margin: '0 0 var(--ds-spacing-16)', maxWidth: 720, color: 'var(--ds-colour-text-dim)' }}>{children}</p>
);
export const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: 'var(--ds-type-font-mono), ui-monospace, monospace', fontSize: 'var(--ds-type-fs-meta)' }}>{children}</code>
);
export const Grid = ({ min = 200, children }: { min?: number; children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 'var(--ds-spacing-12)' }}>{children}</div>
);
