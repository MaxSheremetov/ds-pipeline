import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';

const sample = (extra?: { sort?: 'none' | 'ascending' | 'descending'; onSort?: () => void; onRow?: () => void; selected?: boolean }) => (
  <Table caption="Recent transactions">
    <TableHead>
      <TableRow>
        <TableHeaderCell sort={extra?.sort} onSort={extra?.onSort}>Account</TableHeaderCell>
        <TableHeaderCell align="end">Amount</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow onClick={extra?.onRow} selected={extra?.selected}>
        <TableCell>Current account 4412</TableCell>
        <TableCell align="end" kind="credit">+1 240.00</TableCell>
      </TableRow>
      <TableRow><TableCell>Savings account 7731</TableCell><TableCell align="end" kind="debit">−310.00</TableCell></TableRow>
    </TableBody>
  </Table>
);

describe('Table (acceptance from spec northgate/table)', () => {
  it('is a table with a name, column headers with scope=col', () => {
    render(sample());
    expect(screen.getByRole('table', { name: 'Recent transactions' })).toBeInTheDocument();
    for (const th of screen.getAllByRole('columnheader')) expect(th).toHaveAttribute('scope', 'col');
  });

  it('a column with onSort has a button and exposes aria-sort', async () => {
    const onSort = vi.fn();
    render(sample({ sort: 'ascending', onSort }));
    expect(screen.getByRole('columnheader', { name: 'Account' })).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('a column without onSort has no button and no aria-sort', () => {
    render(sample());
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Amount' })).not.toHaveAttribute('aria-sort');
  });

  it('selected row is exposed as selected', () => {
    render(sample({ selected: true }));
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('a row with onClick is reachable by Tab and Enter or Space activates it', async () => {
    const onRow = vi.fn();
    render(sample({ onRow }));
    await userEvent.tab();
    expect(screen.getAllByRole('row')[1]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onRow).toHaveBeenCalledTimes(2);
  });

  it('rows without onClick are not focusable', async () => {
    render(sample());
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it('has no axe violations (plain, sortable, selected, interactive)', async () => {
    const { container } = render(<div>{sample({ sort: 'descending', onSort: () => {}, selected: true, onRow: () => {} })}</div>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { TableSelectCell, TableSelectHeaderCell, TableActions } from './Table';
import { IconButton } from '../IconButton/IconButton';

describe('Table selection and rich cells (spec northgate/table r3)', () => {
  const grid = (onRow?: () => void, onChange = vi.fn()) => (
    <Table caption="Recent transactions">
      <TableHead><TableRow><TableSelectHeaderCell checked={false} mixed onChange={onChange} /><TableHeaderCell>Account</TableHeaderCell></TableRow></TableHead>
      <TableBody>
        <TableRow selected={false} onClick={onRow}>
          <TableSelectCell checked={false} label="Select Current account" onChange={onChange} />
          <TableCell>Current account<TableActions><IconButton icon="pencil" label="Edit Current account" size="small" /></TableActions></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
  it('select all is named and shows mixed', () => {
    render(grid());
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBePartiallyChecked();
  });
  it('a row checkbox is named and toggling it does not activate the row', async () => {
    const onRow = vi.fn(); const onChange = vi.fn();
    render(grid(onRow, onChange));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Current account' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onRow).not.toHaveBeenCalled();
  });
  it('clicking a row action does not activate the row', async () => {
    const onRow = vi.fn();
    render(grid(onRow));
    await userEvent.click(screen.getByRole('button', { name: 'Edit Current account' }));
    expect(onRow).not.toHaveBeenCalled();
  });
  it('has no accessibility violations', async () => {
    const { container } = render(grid());
    expect(await axe(container)).toHaveNoViolations();
  });
});
