import * as React from 'react';
import * as RP from '@radix-ui/react-popover';
import '../Overlay/Overlay.css';
import './Popover.css';

/**
 * @spec northgate/popover r2
 * A small floating panel opened from a button: a few fields, an explanation with an action, a filter. It is not a menu (use Select) and not a hint (use Tooltip).
 * It is non-modal: the page stays usable, but focus moves in, Escape closes it and focus returns to the trigger.
 */
export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The element that opens it (a Button or Icon button). */
  trigger: React.ReactElement;
  /** Accessible name of the panel. Required: the panel has no visible title. */
  label: string;
  /** The body. */
  children?: React.ReactNode;
  /** Optional actions row, aligned to the right. Matches the Figma property Actions (Off or On). */
  footer?: React.ReactNode;
  /** Where it opens relative to the trigger; it flips when there is no room. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along the trigger edge. */
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({ open, defaultOpen, onOpenChange, trigger, label, children, footer, side = 'bottom', align = 'start', className }: PopoverProps) {
  return (
    <RP.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RP.Trigger asChild>{trigger}</RP.Trigger>
      <RP.Portal>
        <RP.Content
          className={className ? `ds-overlay ds-popover ${className}` : 'ds-overlay ds-popover'}
          aria-label={label}
          side={side}
          align={align}
          sideOffset={8}
          collisionPadding={16}
        >
          <div className="ds-overlay__body">{children}</div>
          {footer ? <div className="ds-overlay__footer">{footer}</div> : null}
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
}
