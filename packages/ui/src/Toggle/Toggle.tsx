import * as React from 'react';
import './Toggle.css';

export type ToggleSize = 'large' | 'medium' | 'small';

/** @spec northgate/toggle r1 */
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'role'> {
  /** Track 40x24, 32x20 or 24x16. A toggle without a visible label should be Large. Matches the Figma property Size. */
  size?: ToggleSize;
  /** Visible label: the setting that is turned on or off, not the action. Without it the toggle needs aria-label. */
  label?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { size = 'large', label, className, ...rest },
  ref,
) {
  return (
    <label className={className ? `ds-toggle ${className}` : 'ds-toggle'} data-size={size}>
      <input ref={ref} type="checkbox" role="switch" className="ds-toggle__input" {...rest} />
      {label ? <span className="ds-toggle__label">{label}</span> : null}
    </label>
  );
});
