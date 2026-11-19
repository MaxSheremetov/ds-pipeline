import * as React from 'react';
import './InteractiveIcon.css';
import { Icon } from '../Icon/Icon';
import type { IconName, IconSize } from '../Icon/Icon';

export type InteractiveIconSize = 'large' | 'medium' | 'small';
const ICON_SIZE: Record<InteractiveIconSize, IconSize> = { large: 20, medium: 16, small: 12 };

/** @spec northgate/interactive-icon r1 */
export interface InteractiveIconProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Icon from the Figma icon set. */
  icon: IconName;
  /** What it does ("Close", "Remove Savings"). Required: an icon alone has no name. Shown as a tooltip by the browser. */
  label: string;
  /** Round target 40, 32 or 24 with an icon of 20, 16 or 12. Match the host: Large in a Notice, Medium in a Toast, Small in a Chip. Matches the Figma property Size. */
  size?: InteractiveIconSize;
  /** Native button type. Defaults to button. */
  type?: 'button' | 'submit' | 'reset';
}

export const InteractiveIcon = React.forwardRef<HTMLButtonElement, InteractiveIconProps>(function InteractiveIcon(
  { icon, label, size = 'small', type = 'button', className, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} title={label} aria-label={label} className={className ? `ds-interactive-icon ${className}` : 'ds-interactive-icon'} data-size={size} {...rest}>
      <Icon name={icon} size={ICON_SIZE[size]} />
    </button>
  );
});
