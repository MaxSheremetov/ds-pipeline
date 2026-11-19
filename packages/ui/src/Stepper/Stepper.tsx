import * as React from 'react';
import './Stepper.css';
import '../shared.css';
import { Icon } from '../Icon/Icon';

export type StepState = 'upcoming' | 'current' | 'done';

/**
 * @spec northgate/stepper r1
 * The steps of a task done in order, with the current one marked. It shows where the person is; it is not navigation.
 */
export interface StepperProps extends Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> {
  /** The step names, in order. Keep each to one or two words. */
  steps: string[];
  /** Index of the current step, counted from 0. Steps before it are Done, steps after it are Upcoming. Use steps.length when every step is done. */
  current: number;
  /** Accessible name of the list ("Transfer progress"). Required: the list is a landmark of its own task. */
  label: string;
}

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, label, className, ...rest },
  ref,
) {
  return (
    <ol ref={ref} className={className ? `ds-stepper ${className}` : 'ds-stepper'} aria-label={label} {...rest}>
      {steps.map((name, i) => {
        const state: StepState = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <li key={`${i}-${name}`} className="ds-step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <div className="ds-step__item">
              <span className="ds-step__disc" aria-hidden="true">
                {state === 'done' ? <Icon name="check" size={16} /> : <span className="ds-step__number">{i + 1}</span>}
              </span>
              <span className="ds-step__label">
                {name}
                {state === 'done' ? <span className="ds-visually-hidden">, completed</span> : null}
                {state === 'current' ? <span className="ds-visually-hidden">, current step</span> : null}
              </span>
            </div>
            {i < steps.length - 1 ? <span className="ds-step__connector" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
});
