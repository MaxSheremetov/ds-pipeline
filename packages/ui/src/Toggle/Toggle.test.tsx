import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Toggle } from './Toggle';

describe('Toggle (acceptance from spec northgate/toggle)', () => {
  it('is a switch with its label as the name', () => {
    render(<Toggle label="Card payments abroad" />);
    expect(screen.getByRole('switch', { name: 'Card payments abroad' })).not.toBeChecked();
  });
  it('clicking the label flips it; Space flips it', async () => {
    render(<Toggle label="Card payments abroad" />);
    const sw = screen.getByRole('switch');
    await userEvent.click(screen.getByText('Card payments abroad'));
    expect(sw).toBeChecked();
    await userEvent.keyboard(' ');
    expect(sw).not.toBeChecked();
  });
  it('reports the change', async () => {
    const fn = vi.fn();
    render(<Toggle label="A" onChange={fn} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].target.checked).toBe(true);
  });
  it('is controlled when checked is given', async () => {
    render(<Toggle label="A" checked={false} onChange={() => {}} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });
  it('disabled is skipped by Tab and cannot change', async () => {
    render(<Toggle label="A" disabled />);
    await userEvent.tab();
    expect(screen.getByRole('switch')).not.toHaveFocus();
    await userEvent.click(screen.getByText('A'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });
  it('without a visible label it uses its accessible name and passes axe', async () => {
    const { container } = render(<Toggle aria-label="Card payments abroad" />);
    expect(screen.getByRole('switch', { name: 'Card payments abroad' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
