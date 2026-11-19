import * as React from 'react';
import './Badge.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export type BadgeStatus = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type BadgeStyle = 'subtle' | 'outline' | 'solid';
export type BadgeSize = 'large' | 'medium' | 'small';

/** @spec northgate/badge r1 */
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Meaning of the badge. Matches the Figma property Status (Neutral, Success, Warning, Error, Info). */
  status?: BadgeStatus;
  /** Weight. Subtle for most places; Outline on zebra rows, where a Subtle fill disappears into the stripe; Solid for the one thing that must be seen. Matches the Figma property Style. */
  appearance?: BadgeStyle;
  /** Height 24, 20 or 16. Small is for table rows. Matches the Figma property Size. */
  size?: BadgeSize;
  /** Replaces the status dot with an icon (12px slot). An icon name from the Icon set (see the Icon docs), such as 'circle-check'. */
  icon?: IconName;
  /** The label, one or two words, written in normal case (the style sets uppercase). */
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { status = 'neutral', appearance = 'subtle', size = 'medium', icon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={className ? `ds-badge ${className}` : 'ds-badge'} data-status={status} data-style={appearance} data-size={size} {...rest}>
      {icon ? <Icon name={icon} size={12} /> : <span className="ds-badge__dot" aria-hidden="true" />}
      <span className="ds-badge__label">{children}</span>
    </span>
  );
});
