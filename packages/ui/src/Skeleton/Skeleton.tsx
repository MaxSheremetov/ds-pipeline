import * as React from 'react';
import './Skeleton.css';

export type SkeletonShape = 'text' | 'block' | 'circle';

/**
 * @spec northgate/skeleton r1
 * Decorative placeholder for content that is still loading. It is hidden from assistive technology: put aria-busy on the region that is loading
 * and announce the result when it arrives.
 */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** What is being stood in for: a line of text (240 x 14), a block such as an image or a card (240 x 96), or a circle such as an avatar (40). Matches the Figma property Shape. */
  shape?: SkeletonShape;
  /** Overrides the width of the shape: any CSS length, such as "60%" or "12rem". */
  width?: string | number;
  /** Overrides the height of the shape. */
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'text', width, height, className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={className ? `ds-skeleton ${className}` : 'ds-skeleton'}
      data-shape={shape}
      style={{ ...(width !== undefined ? { width } : null), ...(height !== undefined ? { height } : null), ...style }}
      {...rest}
    />
  );
});
