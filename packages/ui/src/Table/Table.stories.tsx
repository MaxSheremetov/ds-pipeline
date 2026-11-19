import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Table, TableActions, TableBody, TableCell, TableCellContent, TableHead, TableHeaderCell, TableRow, TableSelectCell, TableSelectHeaderCell } from './Table';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import type { TableSort } from './Table';

/**
 * A data table: column headers with optional sorting, rows with zebra stripes, hover and selection, and typed cells.
 * Built from the Figma masters Table header cell, Table row, Table cell and Cell text (Northgate).
 */
const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { caption: 'Recent transactions' },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { account: 'Current account 4412', date: '18 Sep 2026', amount: '+1 240.00', kind: 'credit' as const },
  { account: 'Savings account 7731', date: '17 Sep 2026', amount: '−310.00', kind: 'debit' as const },
  { account: 'Current account 4412', date: '16 Sep 2026', amount: '2 140.75', kind: 'pending' as const },
  { account: 'Business account 9008', date: '15 Sep 2026', amount: '+86.20', kind: 'credit' as const },
];

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Account</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell align="end">Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            <TableCell>{r.account}</TableCell>
            <TableCell kind="secondary">{r.date}</TableCell>
            <TableCell align="end" kind={r.kind}>{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Click a header to cycle none, ascending, descending. The product sorts the data; the table only shows the state. */
export const Sortable: Story = {
  render: (args) => {
    const [sort, setSort] = React.useState<{ key: string; dir: TableSort }>({ key: 'date', dir: 'descending' });
    const next = (key: string) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));
    const dir = (key: string): TableSort => (sort.key === key ? sort.dir : 'none');
    const sorted = [...rows].sort((a, b) => {
      const k = sort.key as 'account' | 'date';
      const c = String(a[k]).localeCompare(String(b[k]));
      return sort.dir === 'ascending' ? c : -c;
    });
    return (
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableHeaderCell sort={dir('account')} onSort={() => next('account')}>Account</TableHeaderCell>
            <TableHeaderCell sort={dir('date')} onSort={() => next('date')}>Date</TableHeaderCell>
            <TableHeaderCell align="end">Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r, i) => (
            <TableRow key={r.account + r.date + i}>
              <TableCell>{r.account}</TableCell>
              <TableCell kind="secondary">{r.date}</TableCell>
              <TableCell align="end" kind="number">{r.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const SelectedRow: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead><TableRow><TableHeaderCell>Account</TableHeaderCell><TableHeaderCell align="end">Amount</TableHeaderCell></TableRow></TableHead>
      <TableBody>
        <TableRow><TableCell>Current account 4412</TableCell><TableCell align="end" kind="number">+1 240.00</TableCell></TableRow>
        <TableRow selected><TableCell>Savings account 7731</TableCell><TableCell align="end" kind="number">−310.00</TableCell></TableRow>
        <TableRow><TableCell>Business account 9008</TableCell><TableCell align="end" kind="number">+86.20</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
};

/** Rows with an onClick are reachable with Tab and open with Enter or Space. */
export const InteractiveRows: Story = {
  args: { caption: 'Accounts, select a row to open it' },
  render: (args) => {
    const open = fn();
    return (
      <Table {...args}>
        <TableHead><TableRow><TableHeaderCell>Account</TableHeaderCell><TableHeaderCell align="end">Amount</TableHeaderCell></TableRow></TableHead>
        <TableBody>
          {rows.slice(0, 3).map((r, i) => (
            <TableRow key={i} onClick={open} aria-label={r.account}>
              <TableCell>{r.account}</TableCell><TableCell align="end" kind="number">{r.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/** Every cell kind. Credit, Debit and Pending keep the sign in the text; colour only reinforces it. */
export const CellKinds: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead><TableRow><TableHeaderCell>Kind</TableHeaderCell><TableHeaderCell>Example</TableHeaderCell></TableRow></TableHead>
      <TableBody>
        <TableRow><TableCell>Primary</TableCell><TableCell>Current account 4412</TableCell></TableRow>
        <TableRow><TableCell>Secondary</TableCell><TableCell kind="secondary">Current account 4412</TableCell></TableRow>
        <TableRow><TableCell>Number</TableCell><TableCell kind="number">+1 240.00</TableCell></TableRow>
        <TableRow><TableCell>Link</TableCell><TableCell kind="link"><a href="#ref">Current account 4412</a></TableCell></TableRow>
        <TableRow><TableCell>Credit</TableCell><TableCell kind="credit">+1 240.00</TableCell></TableRow>
        <TableRow><TableCell>Debit</TableCell><TableCell kind="debit">−310.00</TableCell></TableRow>
        <TableRow><TableCell>Pending</TableCell><TableCell kind="pending">2 140.75</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
};

export const SortAnnounced: Story = {
  render: Sortable.render,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const th = c.getByRole('columnheader', { name: /date/i });
    await expect(th).toHaveAttribute('aria-sort', 'descending');
    await userEvent.click(c.getByRole('button', { name: /account/i }));
    await expect(c.getByRole('columnheader', { name: /account/i })).toHaveAttribute('aria-sort', 'ascending');
  },
};

/** Selection with a checkbox in every row and select-all in the header. The product owns the selected set; the header box shows a dash when some rows are selected. */
export const Selection: Story = {
  render: (args) => {
    const [picked, setPicked] = React.useState<number[]>([1]);
    const all = picked.length === rows.length;
    return (
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableSelectHeaderCell checked={all} mixed={picked.length > 0 && !all} onChange={(on) => setPicked(on ? rows.map((_, i) => i) : [])} />
            <TableHeaderCell>Account</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell align="end">Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} selected={picked.includes(i)}>
              <TableSelectCell checked={picked.includes(i)} label={`Select ${r.account}`} onChange={(on) => setPicked(on ? [...picked, i] : picked.filter((x) => x !== i))} />
              <TableCell>{r.account}</TableCell>
              <TableCell kind="secondary">{r.date}</TableCell>
              <TableCell align="end" kind={r.kind}>{r.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

const statuses = [
  { s: 'success', t: 'Settled' }, { s: 'error', t: 'Failed' }, { s: 'warning', t: 'Pending' }, { s: 'success', t: 'Settled' },
] as const;

/**
 * Cells can hold an icon with text, a badge, and row actions. Badges are Small or Medium and Outline here: the rows are striped, and a Subtle fill disappears into the sunken stripe.
 * Row actions sit in the last cell, aligned to the end, in the same order in every row.
 */
export const RichCells: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Account</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="end">Amount</TableHeaderCell>
          <TableHeaderCell align="end">Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            <TableCell><TableCellContent><Icon name={i % 2 ? 'piggy-bank' : 'wallet'} size={16} />{r.account}</TableCellContent></TableCell>
            <TableCell><Badge size="medium" appearance="outline" status={statuses[i].s}>{statuses[i].t}</Badge></TableCell>
            <TableCell align="end" kind={r.kind}>{r.amount}</TableCell>
            <TableCell align="end">
              <TableActions>
                <IconButton icon="pencil" label={`Edit ${r.account}`} size="small" />
                <IconButton icon="trash-2" label={`Delete ${r.account}`} size="small" />
                <Button variant="secondary" size="small">Open</Button>
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
