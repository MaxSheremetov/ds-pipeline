import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Notice } from './Notice';

describe('Notice (acceptance from spec northgate/notice)', () => {
  it('errors are announced at once, other statuses politely', () => {
    const { rerender } = render(<Notice status="error">Failed</Notice>);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    rerender(<Notice status="success">Done</Notice>);
    expect(screen.getByRole('status')).toHaveTextContent('Done');
  });
  it('shows title and message', () => {
    render(<Notice title="Heads up">Details</Notice>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
  it('has a close button only when onClose is given, and it works with the keyboard', async () => {
    const fn = vi.fn();
    const { rerender } = render(<Notice>Text</Notice>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Notice onClose={fn}>Text</Notice>);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('closeLabel renames the close button', () => {
    render(<Notice onClose={() => {}} closeLabel="Dismiss message">Text</Notice>);
    expect(screen.getByRole('button', { name: 'Dismiss message' })).toBeInTheDocument();
  });
  it('actions are shown, except in the Solid style', () => {
    const { rerender } = render(<Notice actions={<button>Fix</button>}>Text</Notice>);
    expect(screen.getByRole('button', { name: 'Fix' })).toBeInTheDocument();
    rerender(<Notice appearance="solid" actions={<button>Fix</button>}>Text</Notice>);
    expect(screen.queryByRole('button', { name: 'Fix' })).not.toBeInTheDocument();
  });
  it('the icon is decoration', () => {
    const { container } = render(<Notice status="warning">Text</Notice>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Notice status="error" title="Failed" onClose={() => {}}>Try again</Notice>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
