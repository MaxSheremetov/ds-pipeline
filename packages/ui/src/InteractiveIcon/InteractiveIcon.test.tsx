import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { InteractiveIcon } from './InteractiveIcon';

describe('InteractiveIcon (acceptance from spec northgate/interactive-icon)', () => {
  it('is a button named by label', () => {
    render(<InteractiveIcon icon="x" label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
  });
  it('calls onClick once and ignores clicks when disabled', async () => {
    const fn = vi.fn();
    const { rerender } = render(<InteractiveIcon icon="x" label="Close" onClick={fn} />);
    await userEvent.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalledTimes(1);
    rerender(<InteractiveIcon icon="x" label="Close" onClick={fn} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it.each([['large', '20'], ['medium', '16'], ['small', '12']] as const)('size %s draws an icon of %s', (size, px) => {
    const { container } = render(<InteractiveIcon icon="x" label="Close" size={size} />);
    expect(container.querySelector('svg')).toHaveAttribute('data-size', px);
  });
  it('has no axe violations', async () => {
    const { container } = render(<InteractiveIcon icon="x" label="Close" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
