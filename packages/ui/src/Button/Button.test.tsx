import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button (acceptance from spec northgate/button)', () => {
  it('Enter and Space activate the button', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('disabled button is not focusable and does not fire', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading blocks repeated clicks and announces busy, keeps the label in the DOM for width', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: /Save/ });
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('loading adds a spoken word to the name and one status announcement; both follow loadingLabel', () => {
    const { rerender } = render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Save , Loading');
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(<Button loading loadingLabel="Saugoma">Save</Button>);
    expect(screen.getByRole('status')).toHaveTextContent('Saugoma');
    rerender(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Save');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('defaults: primary, large, type=button', () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'primary');
    expect(btn).toHaveAttribute('data-size', 'large');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('icons are decorative', () => {
    render(<Button leadingIcon={<svg data-testid="i" />}>Add</Button>);
    expect(screen.getByTestId('i').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['primary', 'secondary', 'quiet', 'danger'] as const)('no axe violations: %s', async (variant) => {
    const { container } = render(<Button variant={variant}>Label</Button>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
