import * as React from 'react';
import * as RT from '@radix-ui/react-tooltip';
import './Tooltip.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

/** @spec northgate/tooltip r1 */
export interface TooltipProps {
  /** The text. One short line of plain words; no links or buttons (it cannot be reached by keyboard). It describes the trigger, it does not replace its name. */
  content: React.ReactNode;
  /** The one element it explains. It must be able to take focus (a button, a link, an input). */
  children: React.ReactElement;
  /** Where the bubble sits. Flips when there is no room. Matches the Figma property Side. */
  side?: TooltipSide;
  /** Milliseconds to wait before it appears on hover. Keyboard focus shows it at once. */
  delayDuration?: number;
  /** Controlled open state, for stories and tests. Leave out in product code. */
  open?: boolean;
}

export function Tooltip({ content, children, side = 'top', delayDuration = 400, open }: TooltipProps) {
  return (
    <RT.Provider delayDuration={delayDuration} skipDelayDuration={0}>
      <RT.Root open={open}>
        <RT.Trigger asChild>{children}</RT.Trigger>
        <RT.Portal>
          <RT.Content className="ds-tooltip" side={side} sideOffset={0} collisionPadding={8}>
            {content}
            <RT.Arrow className="ds-tooltip__arrow" width={8} height={4} />
          </RT.Content>
        </RT.Portal>
      </RT.Root>
    </RT.Provider>
  );
}
