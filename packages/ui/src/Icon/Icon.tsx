import * as React from 'react';
import './Icon.css';
import { ICONS } from './icons';
import type { IconName } from './icons';

export type { IconName };
export type IconSize = 12 | 16 | 20 | 24 | 48;

/** @spec northgate/icon r1 */
export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  /** Name from the Figma icon set (components named "icon / name"). */
  name: IconName;
  /** Size in px: 12 (badge), 16 (button, input), 20 (large icon button), 24 (standalone), 48 (illustration in an Empty state). Each is a spacing token. */
  size?: IconSize;
  /** Accessible name. Leave out when the icon only decorates a label that is already there; the icon is then hidden from assistive technology. */
  label?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon({ name, size = 16, label, className, ...rest }, ref) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      ref={ref}
      className={className ? `ds-icon ${className}` : 'ds-icon'}
      data-size={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    />
  );
});
