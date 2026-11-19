import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Toast } from './Toast';

describe('Toast (acceptance from spec northgate/toast)', () => {
  it('errors are announced at once, other statuses politely', () => {
    const { rerender } = render(<Toast status="error">Failed</Toast>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<Toast status="success">Done</Toast>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('the action calls onAction once', async () => {
    const fn = vi.fn();
    render(<Toast actionLabel="Undo" onAction={fn}>Archived</Toast>);
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('shows no action without both label and handler', () => {
    render(<Toast actionLabel="Undo">Archived</Toast>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('close is reachable with the keyboard and named', async () => {
    const fn = vi.fn();
    render(<Toast onClose={fn}>Saved</Toast>);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('has no axe violations', async () => {
    const { container } = render(<Toast status="warning" actionLabel="Undo" onAction={() => {}} onClose={() => {}}>Careful</Toast>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
