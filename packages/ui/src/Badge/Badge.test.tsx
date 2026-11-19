import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge (acceptance from spec northgate/badge)', () => {
  it('the label is text in the DOM and the dot is hidden from assistive technology', () => {
    const { container } = render(<Badge status="error">Failed</Badge>);
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(container.querySelector('.ds-badge__dot')).toHaveAttribute('aria-hidden', 'true');
  });
  it('has no accessibility violations in any style', async () => {
    const { container } = render(<><Badge appearance="subtle">A</Badge><Badge appearance="outline">B</Badge><Badge appearance="solid">C</Badge></>);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('is not focusable', () => {
    render(<Badge>Settled</Badge>);
    expect(screen.getByText('Settled').closest('.ds-badge')).not.toHaveAttribute('tabindex');
  });
});
