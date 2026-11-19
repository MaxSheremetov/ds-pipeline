import * as React from 'react';
import './Breadcrumbs.css';
import { Icon } from '../Icon/Icon';
import { Popover } from '../Popover/Popover';
import type { IconName } from '../Icon/Icon';

/** @spec northgate/breadcrumb r3 */
export interface BreadcrumbsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'aria-label'> {
  /** Names the landmark. Defaults to "Breadcrumb". Change it only when a page has more than one trail. */
  label?: string;
  /**
   * The most crumbs shown at once. A longer trail keeps the first crumb and the last two and collapses the ones between into an ellipsis that opens a list of them. Matches the Figma state Overflow of Breadcrumb item.
   * Set to a very large number to never collapse.
   */
  maxItems?: number;
  /** Name of the ellipsis button and of the list it opens. */
  overflowLabel?: string;
  /** The crumbs from the top of the hierarchy to the current page: BreadcrumbItem elements, the last one the current page. */
  children: React.ReactNode;
}

/** The trail above a page title: where am I, and what is above me. Not a history of where the person has been (that is the back button). */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({ label = 'Breadcrumb', maxItems = 4, overflowLabel = 'Show hidden pages', className, children, ...rest }, ref) {
  const items = React.Children.toArray(children);
  const collapse = items.length > Math.max(maxItems, 3);
  const hidden = collapse ? items.slice(1, items.length - 2) : [];
  const shown: Array<React.ReactNode> = collapse ? [items[0], null, ...items.slice(items.length - 2)] : items;
  return (
    <nav ref={ref} aria-label={label} className={className ? `ds-breadcrumbs ${className}` : 'ds-breadcrumbs'} {...rest}>
      <ol className="ds-breadcrumbs__list">
        {shown.map((child, i) => (
          <li key={i} className="ds-breadcrumbs__item">
            {child === null ? (
              <Popover
                label={overflowLabel}
                trigger={<button type="button" className="ds-breadcrumb ds-breadcrumb--overflow" aria-label={overflowLabel}><span aria-hidden="true">{'\u2026'}</span></button>}
              >
                <ul className="ds-breadcrumbs__menu">
                  {hidden.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </Popover>
            ) : child}
            <Icon name="chevron-right" size={16} className="ds-breadcrumbs__sep" />
          </li>
        ))}
      </ol>
    </nav>
  );
});

export interface BreadcrumbItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Where the crumb goes. Leave out on the last crumb: the current page is not a link to itself. */
  href?: string;
  /** Marks the current page. Set on the last crumb; it then renders as text with aria-current="page". Matches the Figma state Current. */
  current?: boolean;
  /** Icon before the label, on the first crumb only (usually 'home'). Matches the Figma property Show icon. */
  icon?: IconName;
  /** The level's name. Use the record's own name for the last crumb, not its type. */
  children: React.ReactNode;
}

/** One crumb. Matches the Figma component Breadcrumb item. */
export const BreadcrumbItem = React.forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(function BreadcrumbItem({ href, current, icon, className, children, ...rest }, ref) {
  const cls = className ? `ds-breadcrumb ${className}` : 'ds-breadcrumb';
  const inner = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
    </>
  );
  if (current || !href) return <span className={cls} aria-current={current ? 'page' : undefined}>{inner}</span>;
  return <a ref={ref} href={href} className={cls} {...rest}>{inner}</a>;
});
