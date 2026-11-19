import * as React from 'react';
import '../shared.css';
import './Calendar.css';
import { Day } from '../Day/Day';
import type { DayRange } from '../Day/Day';
import { IconButton } from '../IconButton/IconButton';
import { addDays, addMonths, clamp, endOfMonth, formatDate, formatMonth, monthWeeks, sameMonth, startOfMonth, todayIso, weekdayName } from './dates';
import type { IsoDate } from './dates';

/** The calendar both Date picker and Date range are made of: month header, weekday row, a grid of Day cells, a footer slot, and the keyboard. Internal. */
export interface CalendarShellProps {
  /** One month (Date picker) or two side by side (Date range). */
  months: 1 | 2;
  /** First visible month, any date in it. */
  defaultMonth: IsoDate;
  /** Today, for the Today mark. Defaults to the real date. */
  today?: IsoDate;
  /** Earliest and latest pickable date. */
  min?: IsoDate;
  max?: IsoDate;
  /** Extra rule for days that cannot be picked. */
  isDateDisabled?: (date: IsoDate) => boolean;
  /** Language of month and weekday names. */
  locale: string;
  /** First day of the week, 0 = Sunday, 1 = Monday. */
  weekStartsOn: number;
  /** The date that is the grid's tab stop when the calendar is entered. */
  initialFocus: IsoDate;
  isSelected: (date: IsoDate) => boolean;
  rangeOf?: (date: IsoDate) => DayRange | undefined;
  onPick: (date: IsoDate) => void;
  /** Told which day the pointer or keyboard focus is on, and null when it leaves the grid. Lets a range preview its end. */
  onPreview?: (date: IsoDate | null) => void;
  /** Names of the month buttons. */
  previousLabel: string;
  nextLabel: string;
  /** What the panel is called for screen readers. */
  label: string;
  footer: React.ReactNode;
  className?: string;
  onMonthChange?: (month: IsoDate) => void;
  /** Lets the footer move the view (the Today button, a preset). */
  controlRef?: React.MutableRefObject<{ show: (date: IsoDate) => void } | null>;
}

export function CalendarShell(p: CalendarShellProps) {
  const today = p.today ?? todayIso();
  const [view, setView] = React.useState<IsoDate>(startOfMonth(p.defaultMonth));
  const [focus, setFocus] = React.useState<IsoDate>(p.initialFocus);
  const wantFocus = React.useRef(false);
  const root = React.useRef<HTMLDivElement>(null);
  const uid = React.useId();
  const disabled = React.useCallback((d: IsoDate) => !!((p.min && d < p.min) || (p.max && d > p.max) || p.isDateDisabled?.(d)), [p.min, p.max, p.isDateDisabled]);
  const last = addMonths(view, p.months - 1);
  const visible = (d: IsoDate) => d >= view && d <= endOfMonth(last);

  const show = (month: IsoDate) => { const v = startOfMonth(month); setView(v); p.onMonthChange?.(v); };
  const moveFocus = (target: IsoDate, step: number) => {
    let t = target, guard = 0;
    while (disabled(t) && guard++ < 400) t = addDays(t, step || 1);
    if (disabled(t)) return;
    t = clamp(t, p.min, p.max);
    if (t < view) show(t); else if (t > endOfMonth(last)) show(addMonths(t, -(p.months - 1)));
    setFocus(t); wantFocus.current = true;
  };
  if (p.controlRef) p.controlRef.current = { show: (d) => { show(d); setFocus(d); } };
  React.useEffect(() => { if (wantFocus.current) { wantFocus.current = false; const all = Array.from(root.current?.querySelectorAll<HTMLElement>(`[data-date="${focus}"]`) ?? []); (all.find((el) => !el.closest('[aria-hidden="true"]')) ?? all[0])?.focus(); } });

  const navigate = (dir: 1 | -1) => {
    const nv = addMonths(view, dir); show(nv);
    const nextVisible = (d: IsoDate) => d >= nv && d <= endOfMonth(addMonths(nv, p.months - 1));
    setFocus((f) => { const moved = addMonths(f, dir); return nextVisible(moved) ? moved : nv; });
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-date]'); if (!t) return;
    const d = t.dataset.date as IsoDate; const dow = (new Date(`${d}T00:00:00Z`).getUTCDay() - p.weekStartsOn + 7) % 7;
    const moves: Record<string, [IsoDate, number]> = {
      ArrowLeft: [addDays(d, -1), -1], ArrowRight: [addDays(d, 1), 1], ArrowUp: [addDays(d, -7), -7], ArrowDown: [addDays(d, 7), 7],
      Home: [addDays(d, -dow), 1], End: [addDays(d, 6 - dow), -1],
      PageUp: [addMonths(d, e.shiftKey ? -12 : -1), -1], PageDown: [addMonths(d, e.shiftKey ? 12 : 1), 1],
    };
    const m = moves[e.key]; if (!m) return;
    e.preventDefault(); moveFocus(m[0], m[1]);
  };
  const prevDisabled = !!p.min && addDays(view, -1) < p.min;
  const nextDisabled = !!p.max && addDays(endOfMonth(last), 1) > p.max;
  const titleId = (i: number) => `${uid}-m${i}`;

  const header = (
    <div className="ds-calendar__header">
      <IconButton icon="chevron-left" label={p.previousLabel} size="medium" disabled={prevDisabled} onClick={() => navigate(-1)} />
      {p.months === 1 && <span className="ds-calendar__month" id={titleId(0)} aria-live="polite">{formatMonth(view, p.locale)}</span>}
      <IconButton icon="chevron-right" label={p.nextLabel} size="medium" disabled={nextDisabled} onClick={() => navigate(1)} />
    </div>
  );
  const weekdays = Array.from({ length: 7 }, (_, i) => (p.weekStartsOn + i) % 7);
  const month = (m: IsoDate, i: number) => (
    <div className="ds-calendar__month-block" key={m}>
      {p.months === 2 && <span className="ds-calendar__month" id={titleId(i)} aria-live="polite">{formatMonth(m, p.locale)}</span>}
      <div role="grid" aria-labelledby={titleId(i)} className="ds-calendar__grid" onKeyDown={onKeyDown}>
        <div role="row" className="ds-calendar__weekdays">
          {weekdays.map((w) => (
            <span role="columnheader" className="ds-calendar__weekday" key={w}>
              <span aria-hidden="true">{weekdayName(w, p.locale, 'short').slice(0, 2).toUpperCase()}</span>
              <span className="ds-visually-hidden">{weekdayName(w, p.locale, 'long')}</span>
            </span>
          ))}
        </div>
        <div className="ds-calendar__weeks">
          {monthWeeks(m, p.weekStartsOn).map((week, r) => (
            <div role="row" className="ds-calendar__week" key={r}>
              {week.map(({ date: d, outside }) => (
                <span role="gridcell" aria-selected={p.isSelected(d)} aria-hidden={outside && p.months === 2 ? true : undefined} key={d}>
                  <Day
                    label={formatDate(d, p.locale, 'long')}
                    data-date={d}
                    selected={p.isSelected(d)}
                    range={p.rangeOf?.(d)}
                    today={d === today}
                    outside={outside}
                    disabled={disabled(d)}
                    tabIndex={d === focus && !(outside && p.months === 2) ? 0 : -1}
                    onMouseEnter={() => p.onPreview?.(d)}
                    onFocus={() => p.onPreview?.(d)}
                    onClick={() => { setFocus(d); if (outside) show(d); p.onPick(d); }}
                  >{Number(d.slice(8))}</Day>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  const shown = Array.from({ length: p.months }, (_, i) => addMonths(view, i));
  return (
    <div ref={root} role="group" aria-label={p.label} className={p.className ? `ds-calendar ${p.className}` : 'ds-calendar'} data-months={p.months}>
      {header}
      <div className="ds-calendar__months" onMouseLeave={() => p.onPreview?.(null)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) p.onPreview?.(null); }}>{shown.map(month)}</div>
      <div className="ds-calendar__footer">{p.footer}</div>
    </div>
  );
}
export { sameMonth };
