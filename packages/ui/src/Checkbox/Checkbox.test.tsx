import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox (acceptance from spec northgate/checkbox)', () => {
  it('clicking the label toggles it; Space toggles it', async () => {
    render(<Checkbox label="Send statements" />);
    const box = screen.getByRole('checkbox', { name: 'Send statements' });
    await userEvent.click(screen.getByText('Send statements'));
    expect(box).toBeChecked();
    await userEvent.keyboard(' ');
    expect(box).not.toBeChecked();
  });
  it('mixed is exposed as mixed', () => {
    render(<Checkbox label="Select all" mixed />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });
  it('disabled is skipped by Tab', async () => {
    render(<Checkbox label="Off" disabled />);
    await userEvent.tab();
    expect(screen.getByRole('checkbox')).not.toHaveFocus();
  });
  it('without a visible label it needs and uses an accessible name', async () => {
    const { container } = render(<Checkbox aria-label="Select row 3" />);
    expect(screen.getByRole('checkbox', { name: 'Select row 3' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
