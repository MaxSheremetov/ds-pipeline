import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner (acceptance from spec northgate/spinner)', () => {
  it('says Loading as a status by default, and the word can change', () => {
    const { rerender } = render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(<Spinner label="Загрузка" />);
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка');
  });
  it('decorative hides it from assistive technology', () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
  it.each([['large', '0 0 20 20'], ['medium', '0 0 16 16'], ['small', '0 0 12 12']] as const)('size %s draws in a %s box', (size, vb) => {
    const { container } = render(<Spinner size={size} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', vb);
  });
  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
