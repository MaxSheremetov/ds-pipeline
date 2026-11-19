import * as React from 'react';
import './Overlay.css';
import { IconButton } from '../IconButton/IconButton';

/** Header, body and footer of a Modal or Drawer. Internal: not exported from the package. */
export function DialogParts({
  titleNode, descriptionNode, closeNode, footer, children,
}: {
  titleNode: React.ReactNode; descriptionNode?: React.ReactNode; closeNode: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <>
      <div className="ds-overlay__header">
        <div className="ds-overlay__text">{titleNode}{descriptionNode}</div>
        {closeNode}
      </div>
      <div className="ds-overlay__body">{children}</div>
      {footer ? <div className="ds-overlay__footer">{footer}</div> : null}
    </>
  );
}

export const CloseButton = React.forwardRef<HTMLButtonElement, { label: string } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>>(function CloseButton({ label, ...rest }, ref) {
  return <IconButton ref={ref} icon="x" label={label} variant="quiet" size="large" className="ds-overlay__close" {...rest} />;
});
