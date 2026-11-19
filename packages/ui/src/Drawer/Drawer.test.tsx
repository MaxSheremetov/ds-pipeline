import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Drawer } from './Drawer';

describe('Drawer (acceptance from spec northgate/drawer)', () => {
  it('is a named dialog on the chosen side (right by default)', async () => {
    const { rerender } = render(<Drawer open title="Mandate details">Body</Drawer>);
    const d = await screen.findByRole('dialog', { name: 'Mandate details' });
    expect(d).toHaveAttribute('data-side', 'right');
    rerender(<Drawer open side="bottom" title="Mandate details">Body</Drawer>);
    expect(await screen.findByRole('dialog')).toHaveAttribute('data-side', 'bottom');
  });
  it('closes with Escape and returns focus to the trigger', async () => {
    render(<Drawer trigger={<button>Open</button>} title="T">Body</Drawer>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });
  it('the close button dismisses it', async () => {
    const onOpenChange = vi.fn();
    render(<Drawer open onOpenChange={onOpenChange} title="T">Body</Drawer>);
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('holds focus inside', async () => {
    render(<Drawer open title="T" footer={<button>Save</button>}>Body</Drawer>);
    const d = await screen.findByRole('dialog');
    for (let i = 0; i < 5; i++) { await userEvent.tab(); expect(d.contains(document.activeElement)).toBe(true); }
  });
  it('has no axe violations', async () => {
    render(<Drawer open title="Mandate details" description="Supporting line" footer={<button>Save</button>}>Body text</Drawer>);
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations();
  });
});
