import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

/**
 * How far along something is, when the amount is known (a step count, an upload). For work of unknown length use Spinner.
 * The label names it for everyone, including screen readers; the percentage is a visual extra. Heights 8, 6, 4; mirrors Figma `Progress bar` (Size; Label row and Hatch are options).
 */
const meta = {
  title: 'Components/Progress bar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { label: 'Onboarding', value: 56, size: 'large', showValue: true, hatched: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  decorators: [(Story) => <div style={{ width: 320, maxWidth: '100%' }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => <ProgressBar key={s} {...args} size={s} label={`Size ${s}`} />)}
    </div>
  ),
};
export const WithoutHatch: Story = { args: { hatched: false } };
export const BarOnly: Story = { args: { showValue: false } };
export const EmptyAndFull: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)' }}>
      <ProgressBar {...args} value={0} label="Not started" />
      <ProgressBar {...args} value={100} label="Done" />
    </div>
  ),
};
