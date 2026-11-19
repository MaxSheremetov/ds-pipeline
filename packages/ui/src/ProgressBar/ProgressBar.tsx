import * as React from 'react';
import './ProgressBar.css';
import '../shared.css';

export type ProgressBarSize = 'large' | 'medium' | 'small';

/** @spec northgate/progress-bar r1 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** How far along, from 0 to 100. Values outside are held at the ends. */
  value: number;
  /** What is progressing ("Onboarding"). Shown above the bar on the left, and used as its accessible name. Required: a bar alone has no name. */
  label: string;
  /** Height 8, 6 or 4. Matches the Figma property Size. */
  size?: ProgressBarSize;
  /** Shows the label above the bar on the left (Figma: Label row). When off, the label is kept as the accessible name only. */
  showLabel?: boolean;
  /** Shows the percentage above the bar on the right (Figma: Label row). */
  showValue?: boolean;
  /** Draws diagonal hatching on the part still to do (Figma: Hatch). Helps when the track alone is too faint on a busy surface. */
  hatched?: boolean;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, label, size = 'large', showLabel = true, showValue = true, hatched = true, className, ...rest },
  ref,
) {
  const id = React.useId();
  const v = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    <div ref={ref} className={className ? `ds-progress ${className}` : 'ds-progress'} data-size={size} {...rest}>
      <div className="ds-progress__row" hidden={!showLabel && !showValue}>
        <span id={id} className={showLabel ? 'ds-progress__label' : 'ds-progress__label ds-visually-hidden'}>{label}</span>
        {showValue ? <span className="ds-progress__value" aria-hidden="true">{Math.round(v)}%</span> : null}
      </div>
      <div className="ds-progress__track" role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} data-hatched={hatched || undefined}>
        <div className="ds-progress__fill" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
});
