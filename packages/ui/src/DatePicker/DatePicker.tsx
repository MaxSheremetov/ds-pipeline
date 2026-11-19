import * as React from 'react';
import { Button } from '../Button/Button';
import { CalendarShell } from '../Calendar/CalendarShell';
import { formatDate, isIso, startOfMonth, todayIso } from '../Calendar/dates';
import type { IsoDate } from '../Calendar/dates';

/**
 * @spec northgate/date-picker r2
 * Picks one date from a month grid. The footer says the chosen date in words and has a Today button.
 * The grid is one tab stop: arrows move by a day or a week, Home and End to the start and end of the week, Page Up and Page Down by a month (with Shift, a year).
 */
export interface DatePickerProps {
  /** The chosen date as "YYYY-MM-DD", for a controlled picker. null means none. */
  value?: IsoDate | null;
  /** The date chosen at first, for an uncontrolled picker. */
  defaultValue?: IsoDate | null;
  /** Called with the new date when one is picked. */
  onChange?: (value: IsoDate) => void;
  /** The month shown first, any date in it. Defaults to the chosen date, then today. */
  defaultMonth?: IsoDate;
  /** Today as "YYYY-MM-DD". Defaults to the real date; set it for stories and tests. */
  today?: IsoDate;
  /** Earliest pickable date. */
  min?: IsoDate;
  /** Latest pickable date. */
  max?: IsoDate;
  /** Extra rule for days that cannot be picked (weekends, holidays). */
  isDateDisabled?: (date: IsoDate) => boolean;
  /** Language of month and weekday names, as for Intl. */
  locale?: string;
  /** First day of the week, 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** What the picker is called for screen readers. */
  label?: string;
  /** Text of the button that picks today. */
  todayLabel?: string;
  /** Text of the footer before a date is chosen. */
  emptyLabel?: string;
  /** Name of the button for the previous month. */
  previousLabel?: string;
  /** Name of the button for the next month. */
  nextLabel?: string;
  /** Called when the visible month changes, with its first day. */
  onMonthChange?: (month: IsoDate) => void;
  /** Extra class on the panel. */
  className?: string;
}

export function DatePicker({
  value, defaultValue = null, onChange, defaultMonth, today, min, max, isDateDisabled, locale = 'en-US', weekStartsOn = 1,
  label = 'Choose a date', todayLabel = 'Today', emptyLabel = 'No date chosen', previousLabel = 'Previous month', nextLabel = 'Next month', onMonthChange, className,
}: DatePickerProps) {
  const [inner, setInner] = React.useState<IsoDate | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const now = today ?? todayIso();
  const control = React.useRef<{ show: (d: IsoDate) => void } | null>(null);
  const pick = (d: IsoDate) => { if (value === undefined) setInner(d); onChange?.(d); };
  const start = startOfMonth(defaultMonth ?? (current && isIso(current) ? current : now));
  const todayDisabled = !!((min && now < min) || (max && now > max) || isDateDisabled?.(now));
  return (
    <CalendarShell
      months={1}
      defaultMonth={start}
      today={now}
      min={min}
      max={max}
      isDateDisabled={isDateDisabled}
      locale={locale}
      weekStartsOn={weekStartsOn}
      initialFocus={current && current >= start && current.slice(0, 7) === start.slice(0, 7) ? current : now.slice(0, 7) === start.slice(0, 7) ? now : start}
      isSelected={(d) => d === current}
      onPick={pick}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      label={label}
      className={className}
      onMonthChange={onMonthChange}
      controlRef={control}
      footer={(
        <>
          <Button variant="quiet" size="small" disabled={todayDisabled} onClick={() => { pick(now); control.current?.show(now); }}>{todayLabel}</Button>
          <span className="ds-calendar__selected" aria-live="polite">{current ? formatDate(current, locale) : emptyLabel}</span>
        </>
      )}
    />
  );
}
