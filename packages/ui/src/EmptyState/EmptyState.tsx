import * as React from 'react';
import './EmptyState.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

/**
 * @spec northgate/empty-state r1
 * What a list, table or page shows when there is nothing to show yet: what it is, why it is empty, and the next step.
 */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What is missing ("No mandates yet"). */
  title: string;
  /** Level of the title element (h2 to h6). Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** One or two sentences: why it is empty and what the person can do. */
  description?: string;
  /** The illustration, an icon from the Icon set drawn at 48. Defaults to a file. Decorative. */
  icon?: IconName;
  /** One or two buttons: the primary next step, then a quiet alternative. */
  actions?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, headingLevel = 3, description, icon = 'file-text', actions, className, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <div ref={ref} className={className ? `ds-empty ${className}` : 'ds-empty'} {...rest}>
      <Icon name={icon} size={48} className="ds-empty__icon" />
      <div className="ds-empty__text">
        <Heading className="ds-empty__title">{title}</Heading>
        {description ? <p className="ds-empty__description">{description}</p> : null}
      </div>
      {actions ? <div className="ds-empty__actions">{actions}</div> : null}
    </div>
  );
});
