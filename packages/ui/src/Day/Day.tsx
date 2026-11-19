import * as React from 'react';
import './Day.css';

export type DayRange = 'start' | 'in' | 'end';

/**
 * @spec northgate/day r1
 * One day in a calendar: the cell a date picker is made of. It carries the look of a day; the grid, the month and the keyboard moves belong to the calendar around it.
 */
export interface DayProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** The day number ("18"). */
  children: React.ReactNode;
  /** The full date for screen readers ("18 November 2026"). Required: a bare number has no meaning. */
  label: string;
  /** Chosen as the date, or as one end of a range. Matches the Figma State Selected. */
  selected?: boolean;
  /** Today. Marked with a border and a coloured number, and aria-current="date". */
  today?: boolean;
  /** Belongs to the previous or next month. Drawn quieter; still pressable unless disabled. */
  outside?: boolean;
  /** Position in a chosen range: its first day (Range start), a day inside (In range) or its last (Range end). */
  range?: DayRange;
}

export const Day = React.forwardRef<HTMLButtonElement, DayProps>(function Day(
  { children, label, selected = false, today = false, outside = false, range, disabled, className, ...rest },
  ref,
) {
  const state = disabled ? 'disabled'
    : range === 'start' ? 'range-start'
    : range === 'end' ? 'range-end'
    : range === 'in' ? 'in-range'
    : selected ? 'selected'
    : today ? 'today'
    : outside ? 'outside'
    : 'default';
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected || range === 'start' || range === 'end'}
      aria-current={today ? 'date' : undefined}
      className={className ? `ds-day ${className}` : 'ds-day'}
      data-state={state}
      {...rest}
    >
      {children}
    </button>
  );
});
