import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { IconButton } from './IconButton';

describe('IconButton (acceptance from spec northgate/icon-button)', () => {
  it('has an accessible name', async () => {
    const { container } = render(<IconButton icon="pencil" label="Edit row" />);
    expect(screen.getByRole('button', { name: 'Edit row' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('activates with Enter and Space', async () => {
    const onClick = vi.fn();
    render(<IconButton icon="pencil" label="Edit" onClick={onClick} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
  it('disabled is skipped by Tab', async () => {
    render(<IconButton icon="pencil" label="Edit" disabled />);
    await userEvent.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
  });
});
