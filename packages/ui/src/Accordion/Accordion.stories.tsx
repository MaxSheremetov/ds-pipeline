import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from './Accordion';
import type { AccordionSingleProps } from './Accordion';

const items = [
  { value: 'retry', title: 'What happens if a collection fails?', content: 'A failed collection is retried twice, then the mandate is paused and the payer is notified.' },
  { value: 'cutoff', title: 'When is the cut-off for same-day collections?', content: 'Mandates submitted before 14:00 on a working day are collected the same day.' },
  { value: 'refund', title: 'Can a collection be refunded?', content: 'Yes, within eight weeks of the collection date, from the transaction details.' },
];

/**
 * A stack of headings that each show or hide their content, for content read one part at a time. One item open at a time by default.
 * Mirrors Figma `Accordion item` (State). The chevron turns when the item is open.
 */
const meta = {
  title: 'Components/Accordion',
  // @ts-expect-error The props are a union (single | multiple); the stories type the single form.
  component: Accordion,
  tags: ['autodocs'],
  args: { items, defaultValue: 'retry' },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<AccordionSingleProps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /cut-off/ }));
    await expect(c.getByRole('button', { name: /cut-off/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(c.getByRole('button', { name: /fails/ })).toHaveAttribute('aria-expanded', 'false');
  },
};
export const AllClosed: Story = { args: { defaultValue: undefined } };
export const Multiple: Story = { render: () => <Accordion items={items} type="multiple" defaultValue={['retry', 'refund']} /> };
export const WithDisabledItem: Story = { args: { items: items.map((it, i) => (i === 2 ? { ...it, disabled: true } : it)) } };
