import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';

describe('Skeleton (acceptance from spec northgate/skeleton)', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
  it('exposes the shape and defaults to text', () => {
    const { container, rerender } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'text');
    rerender(<Skeleton shape="circle" />);
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'circle');
  });
  it('width and height override the shape', () => {
    const { container } = render(<Skeleton width="60%" height={20} />);
    expect(container.firstElementChild).toHaveStyle({ width: '60%', height: '20px' });
  });
  it('has no axe violations', async () => {
    const { container } = render(<div aria-busy="true"><Skeleton /></div>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
