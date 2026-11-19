import * as React from 'react';
import './Pagination.css';
import { IconButton } from '../IconButton/IconButton';
import { Icon } from '../Icon/Icon';

/** @spec northgate/pagination r1 */
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'aria-label'> {
  /** The current page, counting from 1. */
  page: number;
  /** How many pages there are. */
  pageCount: number;
  /** Called with the page the person chose. The page is yours to keep (and to put in the URL). */
  onPageChange: (page: number) => void;
  /** Total number of records, for the count on the left ("1–50 of 1 284"). Give it with pageSize; leave both out to show no count. Always a real number, never a guess. */
  total?: number;
  /** Records per page, for the count. */
  pageSize?: number;
  /** Names the landmark. Defaults to "Pagination". */
  label?: string;
  /** How many page numbers sit on each side of the current page before the run collapses. Default 1. The first and last page are always shown. */
  siblings?: number;
}

type Slot = number | 'gap-start' | 'gap-end';

function slots(page: number, count: number, siblings: number): Slot[] {
  const total = siblings * 2 + 5; // first, last, current with its siblings, and two gaps: the run keeps this length
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const edge = siblings * 2 + 3;
  if (page <= siblings + 3) return [...range(1, edge), 'gap-end', count];
  if (page >= count - siblings - 2) return [1, 'gap-start', ...range(count - edge + 1, count)];
  return [1, 'gap-start', ...range(page - siblings, page + siblings), 'gap-end', count];
}

const NBSP = '\u00a0';
const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

/** Pages, not endless scroll: the count, Previous, a run of page numbers and Next. Previous and Next are disabled on the first and last page, never hidden, so the row does not reflow. */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, total, pageSize, label = 'Pagination', siblings = 1, className, ...rest },
  ref,
) {
  const current = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
  const from = total !== undefined && pageSize ? Math.min((current - 1) * pageSize + 1, total) : 0;
  const to = total !== undefined && pageSize ? Math.min(current * pageSize, total) : 0;
  return (
    <nav ref={ref} aria-label={label} className={className ? `ds-pagination ${className}` : 'ds-pagination'} {...rest}>
      {total !== undefined && pageSize ? (
        <p className="ds-pagination__count">{total === 0 ? '0 of 0' : `${group(from)}\u2013${group(to)} of ${group(total)}`}</p>
      ) : (
        <span />
      )}
      <div className="ds-pagination__controls">
        <IconButton icon="chevron-left" label="Previous page" variant="secondary" size="large" disabled={current <= 1} onClick={() => onPageChange(current - 1)} />
        <ul className="ds-pagination__pages">
          {slots(current, pageCount, siblings).map((s) =>
            typeof s === 'number' ? (
              <li key={s}>
                <button
                  type="button"
                  className="ds-page"
                  aria-label={`Page ${s}`}
                  aria-current={s === current ? 'page' : undefined}
                  onClick={s === current ? undefined : () => onPageChange(s)}
                >
                  {s}
                </button>
              </li>
            ) : (
              <li key={s} aria-hidden="true">
                <span className="ds-page-gap"><Icon name="ellipsis" size={16} /></span>
              </li>
            ),
          )}
        </ul>
        <IconButton icon="chevron-right" label="Next page" variant="secondary" size="large" disabled={current >= pageCount} onClick={() => onPageChange(current + 1)} />
      </div>
    </nav>
  );
});
