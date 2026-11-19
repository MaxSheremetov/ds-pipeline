import * as React from 'react';
import './Checkbox.css';

export type CheckboxSize = 'large' | 'medium' | 'small';

/** @spec northgate/checkbox r2 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  /** Box 24, 20 or 16. A checkbox without a visible label should be Large: 24 is the WCAG 2.2 minimum target. Matches the Figma property Size. */
  size?: CheckboxSize;
  /** The third value: some of the items this box stands for are selected. Not a styling of checked; it shows a dash. Matches Figma Checked=Mixed. */
  mixed?: boolean;
  /** Visible label. Without it the checkbox needs aria-label (a select-all in a table header, a row checkbox). */
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'large', mixed = false, label, className, ...rest },
  ref,
) {
  const inner = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => { if (inner.current) inner.current.indeterminate = mixed; }, [mixed]);
  const setRefs = (el: HTMLInputElement | null) => {
    inner.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };
  return (
    <label className={className ? `ds-checkbox ${className}` : 'ds-checkbox'} data-size={size}>
      <input ref={setRefs} type="checkbox" className="ds-checkbox__input" aria-checked={mixed ? 'mixed' : undefined} {...rest} />
      {label ? <span className="ds-checkbox__label">{label}</span> : null}
    </label>
  );
});
