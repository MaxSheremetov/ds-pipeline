import * as React from 'react';
import './Notice.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import { InteractiveIcon } from '../InteractiveIcon/InteractiveIcon';

export type NoticeStatus = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type NoticeStyle = 'subtle' | 'outline' | 'solid';

const DEFAULT_ICON: Record<NoticeStatus, IconName> = {
  neutral: 'info', info: 'info', success: 'circle-check', warning: 'triangle-alert', error: 'circle-alert',
};

/** @spec northgate/notice r1 */
export interface NoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Meaning of the message. Matches the Figma property Status (Neutral, Success, Warning, Error, Info). */
  status?: NoticeStatus;
  /** Weight. Subtle for most places; Outline when the page behind is busy; Solid for the one message that must be seen (no actions inside). Matches the Figma property Style. */
  appearance?: NoticeStyle;
  /** Short heading in the mono face, one line. Leave out when the message is a single sentence. */
  title?: React.ReactNode;
  /** Replaces the default icon of the status. An icon name from the Icon set, such as 'wallet'. */
  icon?: IconName;
  /** Shows a close button and calls this when it is pressed. Leave out for a message that stays. */
  onClose?: () => void;
  /** Accessible name of the close button. Defaults to "Close". */
  closeLabel?: string;
  /** Buttons or links under the message, for one or two next steps. Not available with the Solid style. */
  actions?: React.ReactNode;
  /** The message, one or two sentences. */
  children?: React.ReactNode;
}

export const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { status = 'info', appearance = 'subtle', title, icon, onClose, closeLabel = 'Close', actions, className, children, role, ...rest },
  ref,
) {
  // Errors interrupt (alert); everything else is polite (status).
  const live = role ?? (status === 'error' ? 'alert' : 'status');
  return (
    <div ref={ref} role={live} className={className ? `ds-notice ${className}` : 'ds-notice'} data-status={status} data-style={appearance} {...rest}>
      <Icon name={icon ?? DEFAULT_ICON[status]} size={24} className="ds-notice__icon" />
      <div className="ds-notice__content">
        {title ? <div className="ds-notice__title">{title}</div> : null}
        {children ? <div className="ds-notice__message">{children}</div> : null}
        {actions && appearance !== 'solid' ? <div className="ds-notice__actions">{actions}</div> : null}
      </div>
      {onClose ? <InteractiveIcon size="large" icon="x" label={closeLabel} onClick={onClose} className="ds-notice__close" /> : null}
    </div>
  );
});
