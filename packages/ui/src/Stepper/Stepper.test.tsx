import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Stepper } from './Stepper';

const steps = ['Amount', 'Beneficiary', 'Review'];

describe('Stepper (acceptance from spec northgate/stepper)', () => {
  it('is a named ordered list with one item per step', () => {
    render(<Stepper label="Transfer progress" steps={steps} current={1} />);
    expect(screen.getByRole('list', { name: 'Transfer progress' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
  it('marks the current step with aria-current="step" and no other', () => {
    render(<Stepper label="P" steps={steps} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });
  it('derives done, current and upcoming from the index', () => {
    render(<Stepper label="P" steps={steps} current={1} />);
    expect(screen.getAllByRole('listitem').map((li) => li.getAttribute('data-state'))).toEqual(['done', 'current', 'upcoming']);
  });
  it('says done and current in words for screen readers', () => {
    render(<Stepper label="P" steps={steps} current={1} />);
    expect(screen.getByText('Amount', { exact: false }).textContent).toContain('completed');
    expect(screen.getByText('Beneficiary', { exact: false }).textContent).toContain('current step');
  });
  it('shows the step number, and a tick for a done step', () => {
    const { container } = render(<Stepper label="P" steps={steps} current={1} />);
    const discs = container.querySelectorAll('.ds-step__disc');
    expect(discs[0].querySelector('svg')).not.toBeNull();
    expect(discs[1]).toHaveTextContent('2');
    expect(discs[2]).toHaveTextContent('3');
  });
  it('marks every step done when current is past the end', () => {
    render(<Stepper label="P" steps={steps} current={3} />);
    expect(screen.getAllByRole('listitem').every((li) => li.getAttribute('data-state') === 'done')).toBe(true);
  });
  it('draws a connector between steps but not after the last', () => {
    const { container } = render(<Stepper label="P" steps={steps} current={0} />);
    expect(container.querySelectorAll('.ds-step__connector')).toHaveLength(2);
  });
  it('has no axe violations', async () => {
    const { container } = render(<Stepper label="Transfer progress" steps={steps} current={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
