import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Notice } from './Notice';
import { Button } from '../Button/Button';

/**
 * An inline message that stays in the page flow: a result, a warning, a tip. Not for a message that appears and goes by itself (that is Toast).
 * Errors are announced at once (role alert); everything else is polite (role status). Mirrors Figma `Notice` (Status x Style).
 */
const meta = {
  title: 'Components/Notice',
  component: Notice,
  tags: ['autodocs'],
  args: { status: 'info', appearance: 'subtle', title: 'Transfers pause tonight', children: 'Payments between your own accounts resume at 06:00.' },
  argTypes: {
    status: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'error', 'info'] },
    appearance: { control: 'inline-radio', options: ['subtle', 'outline', 'solid'] },
  },
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MessageOnly: Story = { args: { title: undefined, status: 'success', children: 'Transfer of 250.00 to Savings was accepted.' } };
export const WithActions: Story = {
  args: { status: 'warning', title: 'Card expires soon', children: 'Order a new one to avoid a gap.', actions: (<><Button variant="secondary" size="small">Order card</Button><Button variant="quiet" size="small">Later</Button></>) },
};
export const Closable: Story = {
  args: { onClose: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
/** Every status in every style, with a title, a message and a close button. */
export const StatusesAndStyles: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)', maxWidth: 560 }}>
      {(['neutral', 'success', 'warning', 'error', 'info'] as const).flatMap((s) =>
        (['subtle', 'outline', 'solid'] as const).map((y) => (
          <Notice key={s + y} {...args} status={s} appearance={y} title={`${s} ${y}`} onClose={() => {}}>One or two sentences of explanation.</Notice>
        )),
      )}
    </div>
  ),
};
