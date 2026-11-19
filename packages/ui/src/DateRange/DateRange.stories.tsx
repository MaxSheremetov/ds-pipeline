import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DateRange, defaultRangePresets } from './DateRange';

/**
 * Two months side by side, because a range that crosses a month boundary is the normal case. Mirrors Figma `Date range`.
 * The first click sets the start, the second the end; the footer says the range and its length in days. Shortcuts are the fast path for the usual ranges.
 */
const meta = {
  title: 'Components/Date range',
  component: DateRange,
  tags: ['autodocs'],
  args: { defaultMonth: '2026-09-01', today: '2026-09-15', defaultValue: { start: '2026-09-18', end: '2026-10-06' } },
} satisfies Meta<typeof DateRange>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NothingChosen: Story = { args: { defaultValue: { start: null, end: null } } };
export const StartOnly: Story = { args: { defaultValue: { start: '2026-09-18', end: null } } };
export const WithoutShortcuts: Story = { args: { presets: [] } };
export const PickARange: Story = {
  args: { defaultValue: { start: null, end: null } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: '10 September 2026' }));
    await expect(c.getByText('From 10 Sep 2026')).toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: '14 September 2026' }));
    await expect(c.getByText('10 Sep – 14 Sep 2026 · 5 days')).toBeInTheDocument();
  },
};
