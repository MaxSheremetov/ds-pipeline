import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toast } from './Toast';

/**
 * A short message that floats above the page after something the person did: "Saved", "Moved to archive. Undo".
 * The component only draws the toast; a host places it and decides how long it stays. Keep errors until closed, and never put the only copy of important information in a toast that goes away.
 * Mirrors Figma `Toast` (Status).
 */
const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: { status: 'success', children: 'Transfer of 250.00 was accepted.' },
  argTypes: { status: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'error', 'info'] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { status: 'neutral', children: 'Account archived.', actionLabel: 'Undo', onAction: fn(), onClose: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Undo' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};
export const Closable: Story = { args: { onClose: fn() } };
/** Every status. */
export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)' }}>
      {(['neutral', 'success', 'warning', 'error', 'info'] as const).map((s) => (
        <Toast key={s} {...args} status={s} onClose={() => {}} actionLabel="Undo" onAction={() => {}}>{`${s}: one short sentence.`}</Toast>
      ))}
    </div>
  ),
};
