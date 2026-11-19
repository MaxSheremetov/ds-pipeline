import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '../Overlay/Overlay.css';
import './Modal.css';
import { DialogParts, CloseButton } from '../Overlay/Panel';
import { Icon, type IconName } from '../Icon/Icon';

export type ModalSize = 'small' | 'medium' | 'large';

/**
 * @spec northgate/modal r2
 * A dialog that blocks the page until it is answered or dismissed. Focus moves in, is held inside, and returns to the trigger; Escape closes it.
 */
export interface ModalProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state when the modal opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the modal (a Button). Optional when the host controls `open`. */
  trigger?: React.ReactElement;
  /** The title. Required: it is the accessible name. */
  title: string;
  /** Optional 16 icon before the title (Figma property Show icon). Decorative: the title stays the accessible name. */
  icon?: IconName;
  /** One supporting sentence under the title. It is the accessible description. */
  description?: string;
  /** Width 420, 560 or 760 (container-modal-*). Matches the Figma property Size. */
  size?: ModalSize;
  /** The body. */
  children?: React.ReactNode;
  /** Actions row, aligned to the right: usually a secondary then the decisive button. Matches the Figma Footer. */
  footer?: React.ReactNode;
  /** Accessible name of the close button. Defaults to "Close". */
  closeLabel?: string;
  className?: string;
}

export function Modal({ open, defaultOpen, onOpenChange, trigger, title, icon, description, size = 'medium', children, footer, closeLabel = 'Close', className }: ModalProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="ds-overlay-scrim" />
        <Dialog.Content
          className={className ? `ds-overlay ds-modal ${className}` : 'ds-overlay ds-modal'}
          data-size={size}
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <DialogParts
            titleNode={<Dialog.Title className="ds-overlay__title">{icon ? <Icon name={icon} size={16} /> : null}{title}</Dialog.Title>}
            descriptionNode={description ? <Dialog.Description className="ds-overlay__description">{description}</Dialog.Description> : null}
            closeNode={<Dialog.Close asChild><CloseButton label={closeLabel} /></Dialog.Close>}
            footer={footer}
          >
            {children}
          </DialogParts>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
