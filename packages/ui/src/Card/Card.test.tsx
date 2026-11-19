import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card } from './Card';

describe('Card (acceptance from spec northgate/card)', () => {
  it('renders the title as a heading of the requested level', () => {
    render(<Card title="Collections" headingLevel={2}>Body</Card>);
    expect(screen.getByRole('heading', { level: 2, name: 'Collections' })).toBeInTheDocument();
  });
  it('defaults to a level 3 heading', () => {
    render(<Card title="Collections">Body</Card>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
  it('carries the size as a data attribute (padding and gap come from tokens)', () => {
    const { container } = render(<Card size="large" title="T">Body</Card>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'large');
  });
  it('shows the supporting line in Medium and Large but not in Small', () => {
    const { rerender } = render(<Card size="medium" title="T" description="Support">Body</Card>);
    expect(screen.getByText('Support')).toBeInTheDocument();
    rerender(<Card size="small" title="T" description="Support">Body</Card>);
    expect(screen.queryByText('Support')).not.toBeInTheDocument();
  });
  it('has no header when there is no title and no action', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('.ds-card__header')).toBeNull();
  });
  it('puts the action in the header', () => {
    render(<Card title="T" action={<button>More</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = render(<Card title="Collections" description="This week" action={<button>More</button>}>Body</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
