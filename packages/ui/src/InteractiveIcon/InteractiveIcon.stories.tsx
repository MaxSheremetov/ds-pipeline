import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { InteractiveIcon } from './InteractiveIcon';

/**
 * A small round icon button that lives inside another component: the remove of a Chip, the close of a Notice or Toast.
 * It always needs a label, because an icon alone has no name. Sizes 40, 32, 24 with icons 20, 16, 12; mirrors Figma `Interactive icon`.
 * A host tints it by setting --ds-interactive-fg and --ds-interactive-overlay.
 */
const meta = {
  title: 'Components/Interactive icon',
  component: InteractiveIcon,
  tags: ['autodocs'],
  args: { icon: 'x', label: 'Close', size: 'medium' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof InteractiveIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Close' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => <InteractiveIcon key={s} {...args} size={s} label={`Close ${s}`} />)}
    </div>
  ),
};
/** Hover and focus are forced so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#ii-hover button'], focusVisible: ['#ii-focus button'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      <span><InteractiveIcon {...args} label="Rest" /></span>
      <span id="ii-hover"><InteractiveIcon {...args} label="Hover" /></span>
      <span id="ii-focus"><InteractiveIcon {...args} label="Focus" /></span>
      <span><InteractiveIcon {...args} label="Disabled" disabled /></span>
    </div>
  ),
};
