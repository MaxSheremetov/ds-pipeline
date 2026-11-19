import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

/**
 * Pages, not endless scroll. The count on the left is the point: an operator has to know whether there are twelve records or twelve thousand. Then Previous, a run of page numbers and Next.
 * Use it for a list a person has to work through and where the total matters. Keep the count real, never a guess; collapse the middle of a long run, never the first or last page. Put the page in the URL yourself. Mirrors the Figma component Pagination.
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageCount: 26, total: 1284, pageSize: 50, onPageChange: fn() },
  render: (args) => {
    const [page, setPage] = React.useState(args.page);
    return <Pagination {...args} page={page} onPageChange={(p) => { setPage(p); args.onPageChange(p); }} />;
  },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(c.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(c.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  },
};
export const MiddleOfALongRun: Story = { args: { page: 13 } };
export const LastPage: Story = { args: { page: 26 } };
export const FewPages: Story = { args: { pageCount: 4, total: 180 } };
export const WithoutCount: Story = { args: { total: undefined, pageSize: undefined } };
/** Hover and focus of a page number are forced so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#pg-hover button[aria-label="Page 3"]'], focusVisible: ['#pg-focus button[aria-label="Page 3"]'] } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-16)' }}>
      <div id="pg-hover"><Pagination page={1} pageCount={5} onPageChange={() => {}} label="Hover" /></div>
      <div id="pg-focus"><Pagination page={1} pageCount={5} onPageChange={() => {}} label="Focus" /></div>
    </div>
  ),
};
