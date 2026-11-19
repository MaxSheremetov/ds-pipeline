import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';

const items = [
  { value: 'a', title: 'First question', content: 'First answer' },
  { value: 'b', title: 'Second question', content: 'Second answer' },
  { value: 'c', title: 'Third question', content: 'Third answer', disabled: true },
];

describe('Accordion (acceptance from spec northgate/accordion)', () => {
  it('puts each title in a heading with a button inside', () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole('heading', { level: 3, name: 'First question' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('opens and closes an item with Enter and Space, and says so with aria-expanded', async () => {
    render(<Accordion items={items} />);
    const b = screen.getByRole('button', { name: 'First question' });
    b.focus();
    await userEvent.keyboard('{Enter}');
    expect(b).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First answer')).toBeVisible();
    await userEvent.keyboard(' ');
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });
  it('keeps one item open at a time by default', async () => {
    render(<Accordion items={items} defaultValue="a" />);
    await userEvent.click(screen.getByRole('button', { name: 'Second question' }));
    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Second question' })).toHaveAttribute('aria-expanded', 'true');
  });
  it('lets several stay open with type multiple', async () => {
    render(<Accordion items={items} type="multiple" defaultValue={['a']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Second question' }));
    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Second question' })).toHaveAttribute('aria-expanded', 'true');
  });
  it('moves focus between headings with the arrow keys', async () => {
    render(<Accordion items={items} />);
    screen.getByRole('button', { name: 'First question' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Second question' })).toHaveFocus();
  });
  it('does not open a disabled item', async () => {
    render(<Accordion items={items} />);
    const b = screen.getByRole('button', { name: 'Third question' });
    expect(b).toBeDisabled();
    await userEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });
  it('reports the change', async () => {
    const onValueChange = vi.fn();
    render(<Accordion items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'First question' }));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Accordion items={items} defaultValue="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
