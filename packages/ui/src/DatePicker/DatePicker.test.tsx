import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';

const base = { defaultMonth: '2026-09-01', today: '2026-09-15' };

describe('DatePicker (acceptance from spec northgate/date-picker)', () => {
  it('is a named group with a month grid whose title is the month', () => {
    render(<DatePicker {...base} />);
    expect(screen.getByRole('group', { name: 'Choose a date' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
  });
  it('starts the week on Monday and names the weekdays in full for screen readers', () => {
    render(<DatePicker {...base} />);
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((h) => h.textContent)).toEqual(['MOMonday', 'TUTuesday', 'WEWednesday', 'THThursday', 'FRFriday', 'SASaturday', 'SUSunday']);
  });
  it('shows September 2026 in five rows and fills the rows with outside days', () => {
    render(<DatePicker {...base} />);
    expect(screen.getAllByRole('row')).toHaveLength(6); // weekday row + 5 weeks
    expect(screen.getByRole('button', { name: '31 August 2026' })).toHaveAttribute('data-state', 'outside');
  });
  it('names each day by its full date and marks today', () => {
    render(<DatePicker {...base} />);
    expect(screen.getByRole('button', { name: '15 September 2026' })).toHaveAttribute('aria-current', 'date');
  });
  it('chooses a date and says it in words in the footer', async () => {
    const onChange = vi.fn();
    render(<DatePicker {...base} onChange={onChange} />);
    expect(screen.getByText('No date chosen')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '18 September 2026' }));
    expect(onChange).toHaveBeenCalledWith('2026-09-18');
    expect(screen.getByText('18 Sep 2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '18 September 2026' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('is controlled when value is given', async () => {
    render(<DatePicker {...base} value="2026-09-03" />);
    await userEvent.click(screen.getByRole('button', { name: '18 September 2026' }));
    expect(screen.getByText('3 Sep 2026')).toBeInTheDocument();
  });
  it('has one tab stop in the grid: the chosen day', async () => {
    render(<DatePicker {...base} defaultValue="2026-09-18" />);
    const stops = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '0' && b.hasAttribute('data-date'));
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAccessibleName('18 September 2026');
  });
  it('moves focus with the arrows, Home, End and Page keys', async () => {
    render(<DatePicker {...base} defaultValue="2026-09-18" />);
    screen.getByRole('button', { name: '18 September 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '19 September 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: '26 September 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    expect(screen.getByRole('button', { name: '18 September 2026' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('button', { name: '14 September 2026' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: '20 September 2026' })).toHaveFocus();
  });
  it('moves by a month with Page Down and keeps the day', async () => {
    render(<DatePicker {...base} defaultValue="2026-09-18" />);
    screen.getByRole('button', { name: '18 September 2026' }).focus();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '18 October 2026' })).toHaveFocus();
  });
  it('clamps the day when the next month is shorter', async () => {
    render(<DatePicker {...base} defaultValue="2026-01-31" defaultMonth="2026-01-01" />);
    screen.getByRole('button', { name: '31 January 2026' }).focus();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByRole('button', { name: '28 February 2026' })).toHaveFocus();
  });
  it('crosses into the next month with the arrow at the end of a month', async () => {
    render(<DatePicker {...base} defaultValue="2026-09-30" />);
    screen.getByRole('button', { name: '30 September 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 October 2026' })).toHaveFocus();
  });
  it('changes month with the buttons, which keep their names', async () => {
    render(<DatePicker {...base} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
  });
  it('picks today and moves the view to it', async () => {
    const onChange = vi.fn();
    render(<DatePicker {...base} defaultMonth="2026-03-01" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onChange).toHaveBeenCalledWith('2026-09-15');
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
  });
  it('does not allow days outside min and max or rejected by the rule, and skips them with the keyboard', async () => {
    render(<DatePicker {...base} defaultValue="2026-09-18" min="2026-09-10" max="2026-09-25" isDateDisabled={(d) => d === '2026-09-19'} />);
    expect(screen.getByRole('button', { name: '9 September 2026' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '26 September 2026' })).toBeDisabled();
    screen.getByRole('button', { name: '18 September 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '20 September 2026' })).toHaveFocus();
  });
  it('has no axe violations', async () => {
    const { container } = render(<DatePicker {...base} defaultValue="2026-09-18" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
