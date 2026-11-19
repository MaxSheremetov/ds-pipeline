import * as React from 'react';
import './Input.css';

export type InputSize = 'large' | 'medium' | 'small';

/** @spec northgate/input r3 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** The visible label above the field. Always required: a placeholder is not a label. Written in normal case, shown uppercase. Matches the Figma text Label. */
  label: string;
  /** Helper text under the field. Replaced by `error` when an error is set. */
  hint?: string;
  /** Error message. Setting it switches the field to the error state and replaces the hint. Say what is wrong and how to fix it. */
  error?: string;
  /** Field height 40, 32 or 24 and value size 16, 14 or 12. Matches the Figma property Size (Large, Medium, Small). */
  size?: InputSize;
  /** Native input type for single-line text. */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, size = 'large', type = 'text', id, className, disabled, readOnly, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const autoId = React.useId();
  const inputId = id ?? `ds-input-${autoId}`;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  const describedIds = [message ? messageId : null, describedBy].filter(Boolean).join(' ') || undefined;
  return (
    <div
      className={className ? `ds-input ${className}` : 'ds-input'}
      data-size={size}
      data-invalid={error ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
    >
      <label className="ds-input__label" htmlFor={inputId}>{label}</label>
      <div className="ds-input__field">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="ds-input__control"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedIds}
          {...rest}
        />
      </div>
      {/* Always rendered so a screen reader announces the message when an error appears. */}
      <p className="ds-input__message" id={messageId} aria-live="polite">{message}</p>
    </div>
  );
});
