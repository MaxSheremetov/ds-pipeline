import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

/**
 * A quiet placeholder for content that is still loading, in the shape of what will arrive: a line of text, a block, a circle.
 * It is decorative and hidden from assistive technology: put `aria-busy` on the region that is loading and announce the result when it arrives.
 * It pulses between two surface colours; with reduced motion the pulse stops. Mirrors Figma `Skeleton` (Shape x Pulse).
 */
const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { shape: 'text' },
  argTypes: { shape: { control: 'inline-radio', options: ['text', 'block', 'circle'] } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)', justifyItems: 'start', padding: 'var(--ds-spacing-8)' }}>
      {(['text', 'block', 'circle'] as const).map((s) => <Skeleton key={s} {...args} shape={s} />)}
    </div>
  ),
};
/** A card being loaded: circle, two lines, a block. Widths are set per line so the lines do not look cut with one knife. */
export const CardPlaceholder: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--ds-spacing-12)', alignItems: 'center', width: 320, maxWidth: '100%' }}>
      <Skeleton shape="circle" />
      <div style={{ display: 'grid', gap: 'var(--ds-spacing-8)' }}>
        <Skeleton shape="text" width="70%" />
        <Skeleton shape="text" width="40%" />
      </div>
      <div style={{ gridColumn: '1 / -1' }}><Skeleton shape="block" width="100%" /></div>
    </div>
  ),
};
