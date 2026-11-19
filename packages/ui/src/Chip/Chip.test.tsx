import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Chip } from './Chip';

describe('Chip (acceptance from spec northgate/chip)', () => {
  it('a read-only chip is text, not a control', () => {
    render(<Chip>Savings</Chip>);
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('the remove button is named after the label and calls onRemove once', async () => {
    const fn = vi.fn();
    render(<Chip onRemove={fn}>Savings</Chip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Savings' }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('removeLabel overrides the default name', () => {
    render(<Chip onRemove={() => {}} removeLabel="Clear account filter">Savings</Chip>);
    expect(screen.getByRole('button', { name: 'Clear account filter' })).toBeInTheDocument();
  });
  it('the remove button is reachable and works with the keyboard', async () => {
    const fn = vi.fn();
    render(<Chip onRemove={fn}>Savings</Chip>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('exposes status, style and size as data attributes', () => {
    const { container } = render(<Chip status="error" appearance="solid" size="small">Overdue</Chip>);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute('data-status', 'error');
    expect(el).toHaveAttribute('data-style', 'solid');
    expect(el).toHaveAttribute('data-size', 'small');
  });
  it('an icon is decoration and is hidden from assistive technology', () => {
    const { container } = render(<Chip icon="circle-check">Verified</Chip>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('has no axe violations, plain and removable', async () => {
    const a = render(<Chip>Savings</Chip>);
    expect(await axe(a.container)).toHaveNoViolations();
    const b = render(<Chip onRemove={() => {}} icon="circle-check">Savings</Chip>);
    expect(await axe(b.container)).toHaveNoViolations();
  });
});
