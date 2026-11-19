import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DatePicker } from './DatePicker';

/**
 * One month of days with the chosen date said in words underneath. Mirrors Figma `Date picker`.
 * The grid is one tab stop: arrows move by a day or a week, Home and End go to the start and end of the week, Page Up and Page Down by a month.
 * Dates are "YYYY-MM-DD" strings, so there is no time zone to get wrong.
 */
const meta = {
  title: 'Components/Date picker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { defaultMonth: '2026-09-01', today: '2026-09-15', defaultValue: '2026-09-18' },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NothingChosen: Story = { args: { defaultValue: null } };
export const Limits: Story = {
  args: { min: '2026-09-07', max: '2026-09-25', isDateDisabled: (d: string) => [0, 6].includes(new Date(`${d}T00:00:00Z`).getUTCDay()) },
};
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Previous month, Next month, then the day grid.
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    const day = c.getByRole('button', { name: '18 September 2026' });
    await expect(day).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(c.getByRole('button', { name: '19 September 2026' })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    await expect(c.getByRole('button', { name: '19 October 2026' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(c.getByText('19 Oct 2026')).toBeInTheDocument();
  },
};
