import * as React from 'react';
import * as RT from '@radix-ui/react-tabs';
import './Tabs.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export type TabsAppearance = 'underline' | 'enclosed' | 'segmented';

/** @spec northgate/tabs r2 */
export interface TabsProps extends Omit<RT.TabsProps, 'orientation' | 'dir' | 'activationMode'> {
  /** How the bar is drawn. Underline for a page region, Enclosed where that region is its own card, Segmented inline beside content that changes. Matches the Figma property Style. */
  appearance?: TabsAppearance;
}

/** Holds the selected value. Give it `value` and `onValueChange` (or `defaultValue`), a TabList and one TabPanel per Tab. */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs({ appearance = 'underline', className, ...rest }, ref) {
  return <RT.Root ref={ref} className={className ? `ds-tabs ${className}` : 'ds-tabs'} data-appearance={appearance} {...rest} />;
});

export interface TabListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby'> {
  /** Names the bar for assistive technology ("Account sections"). Required: a tablist with no name is announced as nothing. */
  label: string;
}

/** The bar. Arrow keys move between tabs, Tab leaves the bar. */
export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(function TabList({ label, className, ...rest }, ref) {
  return <RT.List ref={ref} aria-label={label} className={className ? `ds-tab-list ${className}` : 'ds-tab-list'} {...rest} />;
});

export interface TabProps extends Omit<RT.TabsTriggerProps, 'children'> {
  /** Value that links this tab to its TabPanel. */
  value: string;
  /** Icon before the label (16px slot). An icon name from the Icon set. Matches the Figma property Show icon. */
  icon?: IconName;
  /** A number after the label, when the number is the reason to go there. Show a zero rather than hiding an empty tab. Matches the Figma property Show count. */
  count?: number | string;
  /** The label, one or two words. */
  children: React.ReactNode;
}

/** One tab. Matches the Figma component Tab item. */
export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab({ icon, count, className, children, ...rest }, ref) {
  return (
    <RT.Trigger ref={ref} className={className ? `ds-tab ${className}` : 'ds-tab'} {...rest}>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span className="ds-tab__label">{children}</span>
      {count !== undefined ? <span className="ds-tab__count">{count}</span> : null}
    </RT.Trigger>
  );
});

export type TabPanelProps = RT.TabsContentProps;

/** The content of one tab. Shown only while its tab is selected. */
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({ className, ...rest }, ref) {
  return <RT.Content ref={ref} className={className ? `ds-tab-panel ${className}` : 'ds-tab-panel'} {...rest} />;
});
