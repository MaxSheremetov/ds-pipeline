import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Chip } from './Chip';

/**
 * A short tag with a status colour, an optional icon and an optional remove button: a chosen filter, an applied value, a person or label on an item.
 * Same Status x Style axes as Badge, but Badge labels a record (a status in a table) and Chip is something the person can take away. Heights 40, 32, 24; mirrors Figma `Chip`.
 */
const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Savings', status: 'neutral', appearance: 'subtle', size: 'medium' },
  argTypes: {
    status: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'error', 'info'] },
    appearance: { control: 'inline-radio', options: ['subtle', 'outline', 'solid'] },
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
  },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: 'circle-check', status: 'success', children: 'Verified' } };
/** The remove button is part of the chip; the chip itself is not a button. */
export const Removable: Story = {
  args: { onRemove: fn(), children: 'Savings' },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Remove Savings' }));
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};
export const RemovableWithIcon: Story = { args: { onRemove: fn(), icon: 'wallet', status: 'info', children: 'Current account' } };

/** Every status in every style, Medium. */
export const StatusesAndStyles: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)', justifyContent: 'start' }}>
      {(['neutral', 'success', 'warning', 'error', 'info'] as const).flatMap((s) =>
        (['subtle', 'outline', 'solid'] as const).map((y) => (
          <Chip key={s + y} {...args} status={s} appearance={y} icon="circle-help" onRemove={() => {}}>{`${s} ${y}`}</Chip>
        )),
      )}
    </div>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <Chip key={s} {...args} size={s} icon="circle-help" onRemove={() => {}}>{s}</Chip>
      ))}
    </div>
  ),
};
/** Hover and focus of the remove button are forced so they can be compared with Figma. */
export const RemoveStates: Story = {
  parameters: { pseudo: { hover: ['#ch-hover button'], focusVisible: ['#ch-focus button'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-16)', padding: 'var(--ds-spacing-8)' }}>
      <span><Chip {...args} onRemove={() => {}}>Default</Chip></span>
      <span id="ch-hover"><Chip {...args} onRemove={() => {}}>Hover</Chip></span>
      <span id="ch-focus"><Chip {...args} onRemove={() => {}}>Focus</Chip></span>
    </div>
  ),
};
