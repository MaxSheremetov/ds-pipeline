/** Calendar dates as ISO strings ("2026-09-18"): no time zone, they sort as text, and they are what a form sends. */
export type IsoDate = string;

const pad = (n: number, w = 2) => String(n).padStart(w, '0');
export const toIso = (y: number, m: number, d: number): IsoDate => `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
export const parseIso = (iso: IsoDate) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d }; };
const utc = (iso: IsoDate) => { const { y, m, d } = parseIso(iso); return new Date(Date.UTC(y, m - 1, d)); };
const fromUtc = (dt: Date): IsoDate => toIso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());

export const isIso = (v: unknown): v is IsoDate => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
export const todayIso = (): IsoDate => { const n = new Date(); return toIso(n.getFullYear(), n.getMonth() + 1, n.getDate()); };
export const addDays = (iso: IsoDate, n: number): IsoDate => { const dt = utc(iso); dt.setUTCDate(dt.getUTCDate() + n); return fromUtc(dt); };
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
/** Moves by whole months and keeps the day when the target month has it, else the last day. */
export const addMonths = (iso: IsoDate, n: number): IsoDate => {
  const { y, m, d } = parseIso(iso); const idx = y * 12 + (m - 1) + n; const ny = Math.floor(idx / 12), nm = (idx % 12) + 1;
  return toIso(ny, nm, Math.min(d, daysInMonth(ny, nm)));
};
export const startOfMonth = (iso: IsoDate): IsoDate => { const { y, m } = parseIso(iso); return toIso(y, m, 1); };
export const endOfMonth = (iso: IsoDate): IsoDate => { const { y, m } = parseIso(iso); return toIso(y, m, daysInMonth(y, m)); };
/** 0 = Sunday ... 6 = Saturday. */
export const weekdayOf = (iso: IsoDate) => utc(iso).getUTCDay();
export const sameMonth = (a: IsoDate, b: IsoDate) => a.slice(0, 7) === b.slice(0, 7);
export const diffDays = (a: IsoDate, b: IsoDate) => Math.round((utc(b).getTime() - utc(a).getTime()) / 86400000);
export const clamp = (iso: IsoDate, min?: IsoDate, max?: IsoDate): IsoDate => (min && iso < min ? min : max && iso > max ? max : iso);

/** The weeks of a month as rows of seven cells, starting on `weekStartsOn` (0 = Sunday, 1 = Monday). Days of the neighbouring months fill the rows and are marked outside. */
export function monthWeeks(monthStart: IsoDate, weekStartsOn: number): Array<Array<{ date: IsoDate; outside: boolean }>> {
  const { y, m } = parseIso(monthStart); const dim = daysInMonth(y, m);
  const lead = (weekdayOf(monthStart) - weekStartsOn + 7) % 7;
  const rows = Math.ceil((lead + dim) / 7);
  return Array.from({ length: rows }, (_, r) => Array.from({ length: 7 }, (_, c) => { const n = r * 7 + c - lead; const date = addDays(monthStart, n); return { date, outside: n < 0 || n >= dim }; }));
}

/** "18 Sep 2026" (short) or "18 September 2026" (long). The order is day, month, year in every locale: it is a label, not a format for forms. */
export function formatDate(iso: IsoDate, locale: string, style: 'short' | 'long' = 'short'): string {
  const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: style === 'short' ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).formatToParts(utc(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${g('day')} ${g('month').replace(/\.$/, '')} ${g('year')}`;
}
export const formatMonth = (iso: IsoDate, locale: string) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utc(iso));
export const weekdayName = (weekday: number, locale: string, style: 'short' | 'long') => new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2023, 0, 1 + weekday)));
