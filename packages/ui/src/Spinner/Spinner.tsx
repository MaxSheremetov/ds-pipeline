import * as React from 'react';
import '../shared.css';
import './Spinner.css';

export type SpinnerSize = 'large' | 'medium' | 'small';
const GEOMETRY: Record<SpinnerSize, { box: number; r: number }> = { large: { box: 20, r: 7 }, medium: { box: 16, r: 5 }, small: { box: 12, r: 4 } };

/** @spec northgate/spinner r1 */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The icon slot it sits in: 20, 16 or 12. A Button's slot is 16, so a loading Button uses Medium. Matches the Figma property Size. */
  size?: SpinnerSize;
  /** Word read by screen readers (change it for other languages). Ignored when decorative. */
  label?: string;
  /** True when something nearby already says that it is loading (a Button does). The spinner is then hidden from assistive technology. */
  decorative?: boolean;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'medium', label = 'Loading', decorative = false, className, ...rest },
  ref,
) {
  const { box, r } = GEOMETRY[size];
  const c = box / 2;
  return (
    <span
      ref={ref}
      className={className ? `ds-spinner ${className}` : 'ds-spinner'}
      data-size={size}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative ? true : undefined}
      {...rest}
    >
      <svg viewBox={`0 0 ${box} ${box}`} aria-hidden="true" focusable="false">
        {/* One sweep of 270 degrees from the top, clockwise, with round ends */}
        <path d={`M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - r} ${c}`} fill="none" />
      </svg>
      {decorative ? null : <span className="ds-visually-hidden">{label}</span>}
    </span>
  );
});
