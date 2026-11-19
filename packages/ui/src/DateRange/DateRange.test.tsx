import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DateRange, defaultRangePresets } from './DateRange';

const base = { defaultMonth: '2026-09-01', today: '2026-09-15' };
const full = { start: '2026-09-18', end: '2026-10-06' };

describe('DateRange (acceptance from spec northgate/date-range)', () => {
  it('shows two months side by side, each a named grid', () => {
    render(<DateRange {...base} />);
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  });
  it('shows neighbouring-month days as Outside but hides those copies from screen readers, so no day is announced twice', () => {
    const { container } = render(<DateRange {...base} />);
    expect(screen.getAllByRole('button', { name: /^1 October 2026$/ })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /^30 September 2026$/ })).toHaveLength(1);
    const copies = container.querySelectorAll('[aria-hidden="true"] [data-state="outside"]');
    expect(copies.length).toBeGreaterThan(0);
    copies.forEach((c) => expect(c).toHaveAttribute('tabindex', '-1'));
  });
  it('previews the range from the first click to the day under the pointer, and clears it when the pointer leaves', () => {
    render(<DateRange {...base} defaultValue={{ start: '2026-09-18', end: null }} />);
    fireEvent.mouseEnter(screen.getByRole('button', { name: '25 September 2026' }));
    expect(screen.getByRole('button', { name: '18 September 2026' })).toHaveAttribute('data-state', 'range-start');
    expect(screen.getByRole('button', { name: '22 September 2026' })).toHaveAttribute('data-state', 'in-range');
    expect(screen.getByRole('button', { name: '25 September 2026' })).toHaveAttribute('data-state', 'range-end');
    fireEvent.mouseEnter(screen.getByRole('button', { name: '10 September 2026' }));
    expect(screen.getByRole('button', { name: '10 September 2026' })).toHaveAttribute('data-state', 'range-start');
    expect(screen.getByRole('button', { name: '18 September 2026' })).toHaveAttribute('data-state', 'range-end');
    fireEvent.mouseLeave(screen.getByRole('button', { name: '10 September 2026' }).closest('.ds-calendar__months')!);
    expect(screen.getByRole('button', { name: '22 September 2026' })).not.toHaveAttribute('data-state', 'in-range');
  });
  it('ships the three Figma shortcuts by default and none when given an empty list', () => {
    const { unmount } = render(<DateRange {...base} />);
    expect(screen.getByRole('button', { name: 'Last 7 days' })).toBeInTheDocument();
    unmount();
    render(<DateRange {...base} presets={[]} />);
    expect(screen.queryByRole('button', { name: 'Last 7 days' })).not.toBeInTheDocument();
  });
  it('marks the start, the days between and the end, across the month boundary', () => {
    render(<DateRange {...base} defaultValue={full} />);
    expect(screen.getByRole('button', { name: '18 September 2026' })).toHaveAttribute('data-state', 'range-start');
    expect(screen.getByRole('button', { name: '30 September 2026' })).toHaveAttribute('data-state', 'in-range');
    expect(screen.getByRole('button', { name: '3 October 2026' })).toHaveAttribute('data-state', 'in-range');
    expect(screen.getByRole('button', { name: '6 October 2026' })).toHaveAttribute('data-state', 'range-end');
    expect(screen.getByRole('button', { name: '7 October 2026' })).not.toHaveAttribute('data-state', 'in-range');
  });
  it('says the range and its length in words (both ends counted)', () => {
    render(<DateRange {...base} defaultValue={full} />);
    expect(screen.getByText('18 Sep – 6 Oct 2026 · 19 days')).toBeInTheDocument();
  });
  it('says the year at both ends when the range crosses a year', () => {
    render(<DateRange {...base} defaultValue={{ start: '2026-12-30', end: '2027-01-02' }} defaultMonth="2026-12-01" />);
    expect(screen.getByText('30 Dec 2026 – 2 Jan 2027 · 4 days')).toBeInTheDocument();
  });
  it('picks the start with the first click and the end with the second', async () => {
    const onChange = vi.fn();
    render(<DateRange {...base} onChange={onChange} />);
    expect(screen.getByText('No range chosen')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '10 September 2026' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-10', end: null });
    expect(screen.getByText('From 10 Sep 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '14 September 2026' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-10', end: '2026-09-14' });
    expect(screen.getByText('10 Sep – 14 Sep 2026 · 5 days')).toBeInTheDocument();
  });
  it('swaps the ends when the second click is earlier than the first', async () => {
    const onChange = vi.fn();
    render(<DateRange {...base} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '14 September 2026' }));
    await userEvent.click(screen.getByRole('button', { name: '10 September 2026' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-10', end: '2026-09-14' });
  });
  it('starts again with a click after a complete range', async () => {
    const onChange = vi.fn();
    render(<DateRange {...base} defaultValue={full} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '22 September 2026' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-22', end: null });
  });
  it('picks a single day as a range of one day', async () => {
    render(<DateRange {...base} />);
    await userEvent.click(screen.getByRole('button', { name: '10 September 2026' }));
    await userEvent.click(screen.getByRole('button', { name: '10 September 2026' }));
    expect(screen.getByText('10 Sep 2026 · 1 day')).toBeInTheDocument();
  });
  it('shortcuts pick their range from today and move the view to it', async () => {
    const onChange = vi.fn();
    render(<DateRange {...base} defaultMonth="2026-03-01" presets={defaultRangePresets} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-09', end: '2026-09-15' });
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'This month' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-09-01', end: '2026-09-30' });
    await userEvent.click(screen.getByRole('button', { name: 'Last quarter' }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-04-01', end: '2026-06-30' });
  });
  it('has one tab stop across both grids', () => {
    render(<DateRange {...base} defaultValue={full} />);
    const stops = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '0' && b.hasAttribute('data-date'));
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAccessibleName('18 September 2026');
  });
  it('moves focus across the month boundary and shifts the view only when it has to', async () => {
    render(<DateRange {...base} defaultValue={full} />);
    screen.getByRole('button', { name: '30 September 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '1 October 2026' })).toHaveFocus();
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    screen.getByRole('button', { name: '31 October 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 November 2026' })).toHaveFocus();
  });
  it('moves both months with the buttons', async () => {
    render(<DateRange {...base} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = render(<DateRange {...base} defaultValue={full} presets={defaultRangePresets} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
