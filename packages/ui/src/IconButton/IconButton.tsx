import * as React from 'react';
import '../Button/Button.css';
import './IconButton.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import type { ButtonVariant, ButtonSize } from '../Button/Button';

/** @spec northgate/icon-button r1 */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Icon from the Figma icon set. */
  icon: IconName;
  /** What the button does ("Edit", "Delete row"). Required: an icon alone has no name. Shown as a tooltip by the browser. */
  label: string;
  /** Visual role. Matches the Figma property Variant. */
  variant?: ButtonVariant;
  /** Square 40, 32 or 24. Small is the WCAG 2.2 minimum target and must not shrink. Matches the Figma property Size. */
  size?: ButtonSize;
  /** Native button type. Defaults to button. */
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'quiet', size = 'medium', type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      title={label}
      aria-label={label}
      className={className ? `ds-button ds-icon-button ${className}` : 'ds-button ds-icon-button'}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      <Icon name={icon} size={size === 'large' ? 20 : 16} />
    </button>
  );
});
