import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

/**
 * A button with only an icon, for frequent actions whose meaning is clear from the icon and its place.
 * Variants and states are the Button's. The accessible name is required and shown as a tooltip.
 */
const meta = {
  title: 'Components/Icon button',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: 'pencil', label: 'Edit', variant: 'quiet', size: 'medium' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'quiet', 'danger'] },
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };

/** Every variant at every size. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      {(['primary', 'secondary', 'quiet', 'danger'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 'var(--ds-spacing-16)', alignItems: 'center' }}>
          {(['large', 'medium', 'small'] as const).map((s) => <IconButton key={s} {...args} variant={v} size={s} label={`${v} ${s}`} icon={v === 'danger' ? 'trash-2' : 'pencil'} />)}
        </div>
      ))}
    </div>
  ),
};

/** States that can be shown statically; hover, pressed and focus are checked in the browser. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      <IconButton {...args} label="Default" />
      <IconButton {...args} label="Hover" className="pseudo-hover" />
      <IconButton {...args} label="Focus" className="pseudo-focus-visible" />
      <IconButton {...args} label="Disabled" disabled />
    </div>
  ),
};
