import * as React from 'react';
import './Nav.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

/** @spec northgate/nav r3 */
export interface NavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label'> {
  /** Names the landmark ("Main", "Account"). Required when a page has more than one nav. */
  label: string;
  /** NavItem or NavRailItem elements, in the order of the destinations. */
  children: React.ReactNode;
}

/** The list of destinations inside a side nav or a rail: a nav landmark with a list of links. */
export const Nav = React.forwardRef<HTMLElement, NavProps>(function Nav({ label, className, children, ...rest }, ref) {
  return (
    <nav ref={ref} aria-label={label} className={className ? `ds-nav ${className}` : 'ds-nav'} {...rest}>
      <ul className="ds-nav__list">
        {React.Children.toArray(children).map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </nav>
  );
});

interface NavItemCommon extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'aria-current'> {
  /** Where the destination goes. Without it the item renders as a button (a single-page app that switches views itself). */
  href?: string;
  /** The destination the person is on. Tints the item, draws the marker bar and sets aria-current="page". Matches the Figma states Active and Active hover. */
  active?: boolean;
  /** Icon from the Icon set (20px slot). */
  icon: IconName;
}

export interface NavItemProps extends NavItemCommon {
  /** A number after the label (items waiting, records in the section). Matches the Figma property Show count. */
  count?: number | string;
  /** The destination's name, one or two words. */
  children: React.ReactNode;
}

type LinkProps = { active?: boolean; rail?: boolean; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'>;

const NavLink = React.forwardRef<HTMLElement, LinkProps>(function NavLink({ href, active, rail, className, children, ...rest }, ref) {
  const props = {
    className: className ? `ds-nav-item ${className}` : 'ds-nav-item',
    'aria-current': active ? ('page' as const) : undefined,
    'data-rail': rail ? 'true' : undefined,
    ...rest,
  };
  return href ? (
    <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...props}>{children}</a>
  ) : (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
  );
});

/** One destination in the expanded side nav. Matches the Figma component Nav item. */
export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem({ icon, count, children, active, href, ...rest }, ref) {
  return (
    <NavLink ref={ref} href={href} active={active} {...rest}>
      <Icon name={icon} size={20} />
      <span className="ds-nav-item__label">{children}</span>
      {count !== undefined ? <span className="ds-nav-item__count">{count}</span> : null}
    </NavLink>
  );
});

export interface NavRailItemProps extends NavItemCommon {
  /** The destination's name. It is the accessible name and the tooltip: an icon-only rail without both is a guessing game. */
  label: string;
}

/** One destination in the icon-only rail, with its tooltip. Matches the Figma component Nav rail item. */
export const NavRailItem = React.forwardRef<HTMLElement, NavRailItemProps>(function NavRailItem({ icon, label, active, href, ...rest }, ref) {
  return (
    <Tooltip content={label} side="right">
      <NavLink ref={ref} href={href} active={active} aria-label={label} {...rest} rail>
        <Icon name={icon} size={20} />
      </NavLink>
    </Tooltip>
  );
});
