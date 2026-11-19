import * as React from 'react';
import './Card.css';

export type CardSize = 'small' | 'medium' | 'large';

/**
 * @spec northgate/card r1
 * A surface that groups one piece of content under an optional heading and action. The content is a slot: the card does not know what is inside.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Padding and gap: Small 16 and 8, Medium 24 and 16, Large 32 and 24. Matches the Figma property Size. */
  size?: CardSize;
  /** The heading. Leave out for a card that is only a surface. */
  title?: React.ReactNode;
  /** Level of the heading element (h2 to h6) so the page outline stays right. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** One supporting line under the title. Not shown in Small, which has none in Figma. */
  description?: React.ReactNode;
  /** A control at the right of the header, usually a Quiet icon button with a menu. */
  action?: React.ReactNode;
  /** The body. */
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { size = 'medium', title, headingLevel = 3, description, action, className, children, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as 'h3';
  const hasHeader = Boolean(title || action);
  return (
    <div ref={ref} className={className ? `ds-card ${className}` : 'ds-card'} data-size={size} {...rest}>
      {hasHeader ? (
        <div className="ds-card__header">
          <div className="ds-card__text">
            {title ? <Heading className="ds-card__title">{title}</Heading> : null}
            {description && size !== 'small' ? <div className="ds-card__description">{description}</div> : null}
          </div>
          {action ? <div className="ds-card__action">{action}</div> : null}
        </div>
      ) : null}
      {children ? <div className="ds-card__body">{children}</div> : null}
    </div>
  );
});
