import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';

describe('EmptyState (acceptance from spec northgate/empty-state)', () => {
  it('shows the title as a heading and the description', () => {
    render(<EmptyState title="No mandates yet" description="Create the first one." />);
    expect(screen.getByRole('heading', { name: 'No mandates yet' })).toBeInTheDocument();
    expect(screen.getByText('Create the first one.')).toBeInTheDocument();
  });
  it('lets the heading level follow the page outline', () => {
    render(<EmptyState title="T" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
  it('renders the actions slot', () => {
    render(<EmptyState title="T" actions={<button>New mandate</button>} />);
    expect(screen.getByRole('button', { name: 'New mandate' })).toBeInTheDocument();
  });
  it('hides the illustration from assistive technology', () => {
    const { container } = render(<EmptyState title="T" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('svg')).toHaveAttribute('data-size', '48');
  });
  it('has no axe violations', async () => {
    const { container } = render(<EmptyState title="No mandates yet" description="Create one." actions={<button>New</button>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
