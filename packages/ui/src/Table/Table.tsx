import * as React from 'react';
import './Table.css';
import { Checkbox } from '../Checkbox/Checkbox';

export type TableAlign = 'start' | 'end';
export type TableSort = 'none' | 'ascending' | 'descending';
export type TableCellKind = 'primary' | 'secondary' | 'number' | 'link' | 'credit' | 'debit' | 'pending';

/** @spec northgate/table r3 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** What the table shows. Read by screen readers as the table name; hidden visually. Always required. */
  caption: string;
}

/** The table element. Put TableHead and TableBody inside it. Rows are 40 high; every column keeps a minimum width of 64 so a flexible column never collapses to a sliver. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({ caption, className, children, ...rest }, ref) {
  return (
    <div className="ds-table-scroll">
      <table ref={ref} className={className ? `ds-table ${className}` : 'ds-table'} {...rest}>
        <caption className="ds-table__caption">{caption}</caption>
        {children}
      </table>
    </div>
  );
});

/** Header group. Holds one TableRow of TableHeaderCell. */
export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHead({ className, ...rest }, ref) {
  return <thead ref={ref} className={className ? `ds-table__head ${className}` : 'ds-table__head'} {...rest} />;
});

/** Body group. Odd rows are raised, even rows are sunken (zebra), by position. */
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={className ? `ds-table__body ${className}` : 'ds-table__body'} {...rest} />;
});

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Marks the row as selected: tinted background and aria-selected. The product owns the selected state; pair it with a TableSelectCell so the person can change it. */
  selected?: boolean;
}

/** One row. Hover tints it. When it has an onClick it becomes keyboard reachable (Tab) and Enter or Space activates it. */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, onClick, onKeyDown, className, ...rest }, ref) {
  const interactive = Boolean(onClick);
  return (
    <tr
      ref={ref}
      className={className ? `ds-table__row ${className}` : 'ds-table__row'}
      data-selected={selected ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      aria-selected={selected === undefined ? undefined : selected}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (interactive && !e.defaultPrevented && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      {...rest}
    />
  );
});

export interface TableHeaderCellProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align' | 'onClick'> {
  /** Start for words, End for figures. Matches the Figma property Align. */
  align?: TableAlign;
  /** Current sort of this column. Leave undefined when the column cannot be sorted. Matches the Figma property Sort. */
  sort?: TableSort;
  /** Called when the person activates the column header. Makes the label a button and shows the sort glyph. The product sorts the data and passes the new `sort`. */
  onSort?: () => void;
}

const SortGlyph = ({ sort }: { sort: TableSort }) => (
  <svg className="ds-table__sort-glyph" data-sort={sort} viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    {sort === 'none' ? <path d="M2 7V1M2 1L0.5 2.5M2 1L3.5 2.5M6 1V7M6 7L4.5 5.5M6 7L7.5 5.5" /> : null}
    {sort === 'ascending' ? <path d="M4 7.5V0.5M4 0.5L1.5 3M4 0.5L6.5 3" /> : null}
    {sort === 'descending' ? <path d="M4 0.5V7.5M4 7.5L1.5 5M4 7.5L6.5 5" /> : null}
  </svg>
);

/** Column header. Sets scope=col and aria-sort. */
export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { align = 'start', sort, onSort, className, children, ...rest },
  ref,
) {
  return (
    <th
      ref={ref}
      scope="col"
      className={className ? `ds-table__th ${className}` : 'ds-table__th'}
      data-align={align}
      data-sortable={onSort ? '' : undefined}
      aria-sort={sort}
      {...rest}
    >
      {onSort ? (
        <button type="button" className="ds-table__sort" onClick={onSort}>
          <span>{children}</span>
          <SortGlyph sort={sort ?? 'none'} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Start for words, End for figures and for a set of row actions. Matches the Figma property Align. */
  align?: TableAlign;
  /** How the value is set. Number is for figures (tabular, aligned by decimals); Credit, Debit and Pending colour money and must keep the sign in the text. Matches the Figma property Kind. */
  kind?: TableCellKind;
}

/** One cell. Holds text, or a Link, Badge or action. */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ align = 'start', kind = 'primary', className, ...rest }, ref) {
  return <td ref={ref} className={className ? `ds-table__td ${className}` : 'ds-table__td'} data-align={align} data-kind={kind} {...rest} />;
});

export interface TableSelectCellProps {
  /** Whether this row is selected. Pass the same value to the row's `selected`. */
  checked: boolean;
  /** Called with the new value when the person toggles the box. */
  onChange: (checked: boolean) => void;
  /** Accessible name of the checkbox, for example "Select row 3" or "Select Current account 4412". Required: the box has no visible label. */
  label: string;
  disabled?: boolean;
}

/** First cell of a row: the selection checkbox (Large, 24) in a 40 wide column. Clicking it never activates the row. */
export const TableSelectCell = React.forwardRef<HTMLTableCellElement, TableSelectCellProps>(function TableSelectCell({ checked, onChange, label, disabled }, ref) {
  return (
    <td ref={ref} className="ds-table__td ds-table__select" onClick={(e) => e.stopPropagation()}>
      <Checkbox size="large" aria-label={label} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    </td>
  );
});

export interface TableSelectHeaderCellProps {
  /** Every row is selected. */
  checked: boolean;
  /** Some, not all, rows are selected: the box shows a dash. */
  mixed?: boolean;
  /** Called with the new value. From mixed, the box becomes checked: select all. */
  onChange: (checked: boolean) => void;
  /** Accessible name, for example "Select all rows". */
  label?: string;
}

/** First header cell: select all. */
export const TableSelectHeaderCell = React.forwardRef<HTMLTableCellElement, TableSelectHeaderCellProps>(function TableSelectHeaderCell({ checked, mixed = false, onChange, label = 'Select all rows' }, ref) {
  return (
    <th ref={ref} scope="col" className="ds-table__th ds-table__select">
      <Checkbox size="large" aria-label={label} checked={checked} mixed={mixed} onChange={(e) => onChange(e.target.checked)} />
    </th>
  );
});

/** Inline wrapper for a cell that holds an icon, a badge or a mix next to text: items sit on one line, centred, 8 apart. */
export const TableCellContent = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(function TableCellContent({ className, ...rest }, ref) {
  return <span ref={ref} className={className ? `ds-table__content ${className}` : 'ds-table__content'} {...rest} />;
});

/** Row actions: icon buttons or small buttons in the last cell, 4 apart, in the same order in every row. Clicking one never activates the row. */
export const TableActions = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(function TableActions({ className, onClick, ...rest }, ref) {
  return <span ref={ref} className={className ? `ds-table__actions ${className}` : 'ds-table__actions'} onClick={(e) => { e.stopPropagation(); onClick?.(e); }} {...rest} />;
});
