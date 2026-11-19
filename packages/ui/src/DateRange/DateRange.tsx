import * as React from 'react';
import { Button } from '../Button/Button';
import { CalendarShell } from '../Calendar/CalendarShell';
import { addDays, addMonths, diffDays, endOfMonth, formatDate, parseIso, startOfMonth, todayIso, toIso } from '../Calendar/dates';
import type { IsoDate } from '../Calendar/dates';
import type { DayRange } from '../Day/Day';

/** A chosen range of dates, both ends included. `end` is null while only the first day is chosen. */
export interface DateRangeValue {
  start: IsoDate | null;
  end: IsoDate | null;
}
/** A shortcut button under the grid. */
export interface DateRangePreset {
  /** Button text ("Last 7 days"). */
  label: string;
  /** The range it picks, worked out from today. */
  range: (today: IsoDate) => { start: IsoDate; end: IsoDate };
}

/** The shortcuts of the Figma component: last seven days, this month, last quarter. */
export const defaultRangePresets: DateRangePreset[] = [
  { label: 'Last 7 days', range: (t) => ({ start: addDays(t, -6), end: t }) },
  { label: 'This month', range: (t) => ({ start: startOfMonth(t), end: endOfMonth(t) }) },
  {
    label: 'Last quarter',
    range: (t) => {
      const { y, m } = parseIso(t); const q = Math.floor((m - 1) / 3); const py = q === 0 ? y - 1 : y; const pm = q === 0 ? 10 : (q - 1) * 3 + 1;
      return { start: toIso(py, pm, 1), end: endOfMonth(toIso(py, pm + 2, 1)) };
    },
  },
];

/**
 * @spec northgate/date-range r2
 * Picks a range of dates from two months side by side. The first click sets the start, the second the end (an earlier second click swaps them).
 * After the first click the days between the start and the day under the pointer (or keyboard focus) are shaded as a preview. The footer says the range in words and its length in days. Same keyboard as the Date picker; the grids are one tab stop.
 */
export interface DateRangeProps {
  /** The chosen range, for a controlled picker. */
  value?: DateRangeValue;
  /** The range chosen at first, for an uncontrolled picker. */
  defaultValue?: DateRangeValue;
  /** Called with the new range: after the first click with only `start`, after the second with both. */
  onChange?: (value: DateRangeValue) => void;
  /** The first of the two months shown, any date in it. Defaults to the start of the range, then today. */
  defaultMonth?: IsoDate;
  /** Today as "YYYY-MM-DD". Defaults to the real date; set it for stories and tests. */
  today?: IsoDate;
  /** Earliest pickable date. */
  min?: IsoDate;
  /** Latest pickable date. */
  max?: IsoDate;
  /** Extra rule for days that cannot be picked. */
  isDateDisabled?: (date: IsoDate) => boolean;
  /** Shortcut buttons in the footer. The Figma set (`defaultRangePresets`) by default; pass an empty array for none. */
  presets?: DateRangePreset[];
  /** Language of month and weekday names, as for Intl. */
  locale?: string;
  /** First day of the week, 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** What the picker is called for screen readers. */
  label?: string;
  /** Text of the footer before any day is chosen. */
  emptyLabel?: string;
  /** Text before the first day while the end is not chosen yet ("From 18 Sep 2026"). */
  fromLabel?: string;
  /** Words for the length of the range: "19 days". */
  dayCountLabel?: (days: number) => string;
  /** Name of the button for the previous month. */
  previousLabel?: string;
  /** Name of the button for the next month. */
  nextLabel?: string;
  /** Called when the visible months change, with the first day of the first one. */
  onMonthChange?: (month: IsoDate) => void;
  /** Extra class on the panel. */
  className?: string;
}

export function DateRange({
  value, defaultValue = { start: null, end: null }, onChange, defaultMonth, today, min, max, isDateDisabled, presets = defaultRangePresets, locale = 'en-US', weekStartsOn = 1,
  label = 'Choose a date range', emptyLabel = 'No range chosen', fromLabel = 'From', dayCountLabel = (n) => (n === 1 ? '1 day' : `${n} days`),
  previousLabel = 'Previous month', nextLabel = 'Next month', onMonthChange, className,
}: DateRangeProps) {
  const [inner, setInner] = React.useState<DateRangeValue>(defaultValue);
  const current = value ?? inner;
  const now = today ?? todayIso();
  const control = React.useRef<{ show: (d: IsoDate) => void } | null>(null);
  const set = (v: DateRangeValue) => { if (value === undefined) setInner(v); onChange?.(v); };
  const pick = (d: IsoDate) => {
    const { start, end } = current;
    if (!start || end) set({ start: d, end: null });
    else set(d < start ? { start: d, end: start } : { start, end: d });
  };
  const [hover, setHover] = React.useState<IsoDate | null>(null);
  const { start, end } = current;
  const [from, to] = start && !end && hover && hover !== start ? (hover < start ? [hover, start] : [start, hover]) : [start, end];
  const rangeOf = (d: IsoDate): DayRange | undefined => (from && to && from !== to ? (d === from ? 'start' : d === to ? 'end' : d > from && d < to ? 'in' : undefined) : undefined);
  const first = startOfMonth(defaultMonth ?? start ?? now);
  const summary = !start ? emptyLabel
    : !end ? `${fromLabel} ${formatDate(start, locale)}`
    : start === end ? `${formatDate(start, locale)} · ${dayCountLabel(1)}`
    : `${sameYear(start, end) ? formatDate(start, locale).replace(/ \d{4}$/, '') : formatDate(start, locale)} – ${formatDate(end, locale)} · ${dayCountLabel(diffDays(start, end) + 1)}`;
  return (
    <CalendarShell
      months={2}
      defaultMonth={first}
      today={now}
      min={min}
      max={max}
      isDateDisabled={isDateDisabled}
      locale={locale}
      weekStartsOn={weekStartsOn}
      initialFocus={start && start.slice(0, 7) >= first.slice(0, 7) && start.slice(0, 7) <= addMonths(first, 1).slice(0, 7) ? start : first}
      isSelected={(d) => d === start || d === end}
      rangeOf={rangeOf}
      onPick={pick}
      onPreview={setHover}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      label={label}
      className={className}
      onMonthChange={onMonthChange}
      controlRef={control}
      footer={(
        <>
          <div className="ds-calendar__presets">
            {presets.map((p) => (
              <Button key={p.label} variant="quiet" size="small" onClick={() => { const r = p.range(now); set(r); control.current?.show(r.start); }}>{p.label}</Button>
            ))}
          </div>
          <span className="ds-calendar__selected" aria-live="polite">{summary}</span>
        </>
      )}
    />
  );
}
const sameYear = (a: IsoDate, b: IsoDate) => a.slice(0, 4) === b.slice(0, 4);
