import * as React from 'react';
import './Stat.css';
import '../shared.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export type StatSize = 'large' | 'medium' | 'small';
export type StatTrend = 'up' | 'down' | 'flat';

const TREND_ICON: Record<StatTrend, IconName> = { up: 'trending-up', down: 'trending-down', flat: 'minus' };
const TREND_WORD: Record<StatTrend, string> = { up: 'Up', down: 'Down', flat: 'Unchanged' };

/** @spec northgate/stat r1 */
export interface StatProps extends Omit<React.HTMLAttributes<HTMLDListElement>, 'children'> {
  /** What is measured ("Collected this week"). Written in normal case; the style sets the capitals. */
  label: string;
  /** The figure. Format it before passing it in (grouping, currency, units). */
  value: React.ReactNode;
  /** Direction of the change, with an icon and a colour: Up is green, Down is red, Flat is grey. Leave out, with `change`, for a figure with no comparison. Matches the Figma property Trend. */
  trend?: StatTrend;
  /** The size of the change, already formatted ("12.4%"). Shown only with `trend`. */
  change?: string;
  /** What it is compared with ("vs last week"). */
  period?: string;
  /** Figure size: 30, 23 or 19. Matches the Figma property Size. */
  size?: StatSize;
}

export const Stat = React.forwardRef<HTMLDListElement, StatProps>(function Stat(
  { label, value, trend, change, period, size = 'large', className, ...rest },
  ref,
) {
  const showDelta = Boolean(trend && change);
  return (
    <dl ref={ref} className={className ? `ds-stat ${className}` : 'ds-stat'} data-size={size} data-trend={showDelta ? trend : undefined} {...rest}>
      <dt className="ds-stat__label">{label}</dt>
      <dd className="ds-stat__value">{value}</dd>
      {showDelta && trend ? (
        <dd className="ds-stat__delta">
          <Icon name={TREND_ICON[trend]} size={12} />
          <span className="ds-visually-hidden">{TREND_WORD[trend]} </span>
          <span className="ds-stat__change">{change}</span>
          {period ? <span className="ds-stat__period">{period}</span> : null}
        </dd>
      ) : null}
    </dl>
  );
});
