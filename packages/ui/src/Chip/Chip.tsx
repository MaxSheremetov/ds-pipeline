import * as React from 'react';
import './Chip.css';
import { Icon } from '../Icon/Icon';
import { InteractiveIcon } from '../InteractiveIcon/InteractiveIcon';
import type { IconName } from '../Icon/Icon';

export type ChipStatus = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type ChipStyle = 'subtle' | 'outline' | 'solid';
export type ChipSize = 'large' | 'medium' | 'small';

/** @spec northgate/chip r2 */
export interface ChipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Meaning of the chip. Same statuses as Badge. Matches the Figma property Status (Neutral, Success, Warning, Error, Info). */
  status?: ChipStatus;
  /** Weight. Subtle for most places; Outline where a Subtle fill would disappear into its background; Solid for the one chip that must be seen. Matches the Figma property Style. */
  appearance?: ChipStyle;
  /** Height 40, 32 or 24, the same as Button. Matches the Figma property Size. */
  size?: ChipSize;
  /** Icon before the label (16px slot). An icon name from the Icon set (see the Icon docs), such as 'circle-check'. */
  icon?: IconName;
  /** Shows a remove button after the label and calls this when it is pressed. The chip itself is not interactive; leave this out for a read-only chip. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Defaults to "Remove" followed by the label when the label is plain text; give it when the label is not. */
  removeLabel?: string;
  /** The label, one to three words, in normal case. */
  children: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { status = 'neutral', appearance = 'subtle', size = 'medium', icon, onRemove, removeLabel, className, children, ...rest },
  ref,
) {
  const name = removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove');
  return (
    <span
      ref={ref}
      className={className ? `ds-chip ${className}` : 'ds-chip'}
      data-status={status}
      data-style={appearance}
      data-size={size}
      data-removable={onRemove ? 'true' : undefined}
      {...rest}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      <span className="ds-chip__label">{children}</span>
      {onRemove ? (
        <InteractiveIcon size="small" icon="x" className="ds-chip__remove" label={name} onClick={onRemove} />
      ) : null}
    </span>
  );
});
