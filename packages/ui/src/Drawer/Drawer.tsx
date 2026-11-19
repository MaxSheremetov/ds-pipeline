import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '../Overlay/Overlay.css';
import './Drawer.css';
import { DialogParts, CloseButton } from '../Overlay/Panel';
import { Icon, type IconName } from '../Icon/Icon';

export type DrawerSide = 'right' | 'left' | 'bottom';

/**
 * @spec northgate/drawer r2
 * A panel from the edge of the screen for a task that belongs to the page behind it (details, a form, filters). Behaves as a Modal: focus is held inside, Escape closes it.
 */
export interface DrawerProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state when the drawer opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the drawer. Optional when the host controls `open`. */
  trigger?: React.ReactElement;
  /** The title. Required: it is the accessible name. */
  title: string;
  /** Optional 16 icon before the title (Figma property Show icon). Decorative: the title stays the accessible name. */
  icon?: IconName;
  /** One supporting sentence under the title. It is the accessible description. */
  description?: string;
  /** The edge it comes from. Right and left are 560 wide (container-drawer), bottom spans the width. Matches the Figma property Side. */
  side?: DrawerSide;
  /** The body. */
  children?: React.ReactNode;
  /** Actions row, aligned to the right. */
  footer?: React.ReactNode;
  /** Accessible name of the close button. Defaults to "Close". */
  closeLabel?: string;
  className?: string;
}

export function Drawer({ open, defaultOpen, onOpenChange, trigger, title, icon, description, side = 'right', children, footer, closeLabel = 'Close', className }: DrawerProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="ds-overlay-scrim" />
        <Dialog.Content
          className={className ? `ds-overlay ds-drawer ${className}` : 'ds-overlay ds-drawer'}
          data-side={side}
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
