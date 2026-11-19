import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar (acceptance from spec northgate/progress-bar)', () => {
  it('is a progressbar named by its label, with the value', () => {
    render(<ProgressBar label="Onboarding" value={56} />);
    const bar = screen.getByRole('progressbar', { name: 'Onboarding' });
    expect(bar).toHaveAttribute('aria-valuenow', '56');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });
  it('holds values inside 0 to 100', () => {
    const { rerender } = render(<ProgressBar label="A" value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<ProgressBar label="A" value={-5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
  it('shows the percentage only when asked', () => {
    const { rerender } = render(<ProgressBar label="A" value={56} />);
    expect(screen.getByText('56%')).toBeInTheDocument();
    rerender(<ProgressBar label="A" value={56} showValue={false} />);
    expect(screen.queryByText('56%')).not.toBeInTheDocument();
  });
  it('the fill is as wide as the value', () => {
    const { container } = render(<ProgressBar label="A" value={56} />);
    expect(container.querySelector('.ds-progress__fill')).toHaveStyle({ width: '56%' });
  });
  it('has no axe violations', async () => {
    const { container } = render(<ProgressBar label="Onboarding" value={56} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
