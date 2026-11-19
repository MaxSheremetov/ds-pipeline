import * as React from 'react';
import './Radio.css';

export type RadioSize = 'large' | 'medium' | 'small';

interface GroupContext {
  name: string;
  value: string | undefined;
  size: RadioSize;
  disabled: boolean;
  onChange: (value: string) => void;
}
const RadioGroupContext = React.createContext<GroupContext | null>(null);

/** @spec northgate/radio r1 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'value'> {
  /** The value this option stands for. Inside a RadioGroup it is what the group reports when this option is chosen. */
  value: string;
  /** Circle 24, 20 or 16. Inside a RadioGroup the group sets it. Matches the Figma property Size. */
  size?: RadioSize;
  /** The option text. Without it the radio needs aria-label. */
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, size, label, className, disabled, checked, defaultChecked, onChange, name, ...rest },
  ref,
) {
  const group = React.useContext(RadioGroupContext);
  const sz = group?.size ?? size ?? 'large';
  const grouped = group !== null;
  return (
    <label className={className ? `ds-radio ${className}` : 'ds-radio'} data-size={sz}>
      <input
        ref={ref}
        type="radio"
        className="ds-radio__input"
        value={value}
        name={grouped ? group.name : name}
        disabled={disabled || group?.disabled}
        {...(grouped
          ? { checked: group.value === value, onChange: () => group.onChange(value) }
          : { checked, defaultChecked, onChange })}
        {...rest}
      />
      {label ? <span className="ds-radio__label">{label}</span> : null}
    </label>
  );
});

export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
  /** The question the options answer. It is the group's accessible name and is shown above the options. */
  legend: React.ReactNode;
  /** Shared name of the options. Generated when omitted. Needed only when the group is part of a native form. */
  name?: string;
  /** The chosen value (controlled). */
  value?: string;
  /** The chosen value at the start (uncontrolled). Leave out for no choice. */
  defaultValue?: string;
  /** Called with the value of the option the person chose. */
  onValueChange?: (value: string) => void;
  /** Circle size for every option. Matches the Figma property Size. */
  size?: RadioSize;
  /** Stack the options (default) or lay them in a row. */
  orientation?: 'vertical' | 'horizontal';
  /** Optional text under the legend. Linked to the group with aria-describedby. */
  hint?: React.ReactNode;
  /** Shows an error message and marks the group invalid. Replaces the hint. */
  error?: React.ReactNode;
  /** Options, as Radio elements. */
  children: React.ReactNode;
}

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { legend, name, value, defaultValue, onValueChange, size = 'large', orientation = 'vertical', hint, error, disabled = false, className, children, ...rest },
  ref,
) {
  const id = React.useId();
  const [inner, setInner] = React.useState<string | undefined>(defaultValue);
  const current = value !== undefined ? value : inner;
  const message = error ?? hint;
  const messageId = message ? `${id}-msg` : undefined;
  const ctx = React.useMemo<GroupContext>(
    () => ({ name: name ?? id, value: current, size, disabled, onChange: (v) => { if (value === undefined) setInner(v); onValueChange?.(v); } }),
    [name, id, current, size, disabled, value, onValueChange],
  );
  return (
    <fieldset
      ref={ref}
      role="radiogroup"
      className={className ? `ds-radio-group ${className}` : 'ds-radio-group'}
      data-orientation={orientation}
      data-invalid={error ? 'true' : undefined}
      aria-describedby={messageId}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
      {...rest}
    >
      <legend className="ds-radio-group__legend">{legend}</legend>
      {message ? <div id={messageId} className="ds-radio-group__message" data-kind={error ? 'error' : 'hint'}>{message}</div> : null}
      <RadioGroupContext.Provider value={ctx}>
        <div className="ds-radio-group__options">{children}</div>
      </RadioGroupContext.Provider>
    </fieldset>
  );
});
