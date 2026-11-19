import * as React from 'react';
import '../shared.css';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ButtonSize = 'large' | 'medium' | 'small';

/** @spec northgate/button r6 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual role. One primary button per view. Matches the Figma property Variant. */
  variant?: ButtonVariant;
  /** Height 40, 32 or 24; label 14, 12 or 11. Matches the Figma property Size (Large, Medium, Small). */
  size?: ButtonSize;
  /** Shows a spinner before the label (replaces the leading icon) and ignores clicks. The button gets wider by the spinner slot, as in Figma State=Loading. */
  loading?: boolean;
  /** Word read by screen readers while loading, after the label and as a status message. Change it for other languages. */
  loadingLabel?: string;
  /** Icon before the label (16px slot). Pass an svg element. */
  leadingIcon?: React.ReactNode;
  /** Icon after the label (16px slot). Pass an svg element. */
  trailingIcon?: React.ReactNode;
  /** Native button type. Defaults to button so a Button inside a form never submits by accident. */
  type?: 'button' | 'submit' | 'reset';
  /** The label. Matches the Figma text property Label. */
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'large', loading = false, loadingLabel = 'Loading', leadingIcon, trailingIcon, disabled, onClick, type = 'button', className, children, ...rest },
  ref,
) {
  return (
    <>
    <button
      ref={ref}
      type={type}
      className={className ? `ds-button ${className}` : 'ds-button'}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading ? (
        <span className="ds-button__icon" aria-hidden="true"><Spinner size="medium" decorative /></span>
      ) : leadingIcon ? (
        <span className="ds-button__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      <span className="ds-button__label">{children}</span>
      {loading ? <span className="ds-visually-hidden">, {loadingLabel}</span> : null}
      {trailingIcon ? <span className="ds-button__icon" aria-hidden="true">{trailingIcon}</span> : null}
    </button>
    {/* A live region cannot sit inside a button, so the announcement is a sibling. Rendered empty first so the change is announced. */}
    <span className="ds-visually-hidden" role="status">{loading ? loadingLabel : ''}</span>
    </>
  );
});
