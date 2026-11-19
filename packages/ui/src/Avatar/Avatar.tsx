import * as React from 'react';
import './Avatar.css';
import { Icon } from '../Icon/Icon';

export type AvatarSize = 'large' | 'medium' | 'small';

/** Up to two capital letters: the first letters of the first and last word. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : '';
  return (first + last).toLocaleUpperCase();
}

/** @spec northgate/avatar r1 */
export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Whose it is ("Ama Mensah"). Required: it is the accessible name and the source of the initials. */
  name: string;
  /** A photo. Without it, or if it fails to load, the avatar shows initials (Type Initials), or the person icon when the photo failed (Type Photo). */
  src?: string;
  /** Circle 40, 32 or 24. Matches the Figma property Size. */
  size?: AvatarSize;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'medium', className, ...rest },
  ref,
) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  const photo = Boolean(src) && !failed;
  const placeholder = Boolean(src) && failed;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={className ? `ds-avatar ${className}` : 'ds-avatar'}
      data-size={size}
      data-type={src ? 'photo' : 'initials'}
      {...rest}
    >
      {photo ? <img className="ds-avatar__img" src={src} alt="" onError={() => setFailed(true)} /> : null}
      {placeholder ? <Icon name="user" size={16} /> : null}
      {!src ? <span className="ds-avatar__initials" aria-hidden="true">{initialsOf(name)}</span> : null}
    </span>
  );
});
