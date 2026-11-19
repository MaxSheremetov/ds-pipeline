import * as React from 'react';
import './Toast.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import { InteractiveIcon } from '../InteractiveIcon/InteractiveIcon';
import { Button } from '../Button/Button';

export type ToastStatus = 'neutral' | 'success' | 'warning' | 'error' | 'info';

const DEFAULT_ICON: Record<ToastStatus, IconName> = {
  neutral: 'info', info: 'info', success: 'circle-check', warning: 'triangle-alert', error: 'circle-alert',
};

/**
 * @spec northgate/toast r1
 * Presentational only: it does not time out, queue or position itself. A host decides when it appears and goes.
 * A toast that disappears by itself must not carry the only copy of important information (WCAG 2.2.1, 4.1.3): give it enough time, and keep errors until closed.
 */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Meaning of the message. Matches the Figma property Status. */
  status?: ToastStatus;
  /** Replaces the default icon of the status. An icon name from the Icon set. */
  icon?: IconName;
  /** One short sentence. */
  children: React.ReactNode;
  /** Label of the single quiet action ("Undo", "View"). Needs onAction. */
  actionLabel?: string;
  /** Called when the action is pressed. */
  onAction?: () => void;
  /** Shows a close button and calls this when it is pressed. */
  onClose?: () => void;
  /** Accessible name of the close button. Defaults to "Close". */
  closeLabel?: string;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { status = 'neutral', icon, children, actionLabel, onAction, onClose, closeLabel = 'Close', className, role, ...rest },
  ref,
) {
  const live = role ?? (status === 'error' ? 'alert' : 'status');
  return (
    <div ref={ref} role={live} className={className ? `ds-toast ${className}` : 'ds-toast'} data-status={status} {...rest}>
      <Icon name={icon ?? DEFAULT_ICON[status]} size={24} className="ds-toast__icon" />
      <div className="ds-toast__text">{children}</div>
      {actionLabel && onAction ? <Button variant="quiet" size="small" onClick={onAction}>{actionLabel}</Button> : null}
      {onClose ? <InteractiveIcon size="medium" icon="x" label={closeLabel} onClick={onClose} className="ds-toast__close" /> : null}
    </div>
  );
});
