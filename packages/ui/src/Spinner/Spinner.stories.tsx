import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

/**
 * A spinner, for something that has started and has not finished. Use the size of the slot it sits in (a Button slot is 16, so Medium).
 * Colour follows the text next to it. Alone it says "Loading" to screen readers; inside something that already says so (a Button) set `decorative`.
 * Mirrors Figma `Spinner` (Size).
 */
const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { size: 'medium' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => <Spinner key={s} {...args} size={s} />)}
    </div>
  ),
};
/** It takes the colour of the text around it. */
export const InText: Story = {
  render: (args) => (
    <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-8)', margin: 0, color: 'var(--ds-colour-text-dim)', font: 'var(--ds-type-fs-body)/var(--ds-type-line-body) var(--ds-type-font-text)' }}>
      <Spinner {...args} size="medium" /> Checking your balance
    </p>
  ),
};
