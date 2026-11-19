import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Modal } from './Modal';

const trigger = <button>Open</button>;

describe('Modal (acceptance from spec northgate/modal)', () => {
  it('is named by its title and described by the supporting line', async () => {
    render(<Modal open title="Delete three mandates" description="This cannot be undone.">Body</Modal>);
    const d = await screen.findByRole('dialog', { name: 'Delete three mandates' });
    expect(d).toHaveAccessibleDescription('This cannot be undone.');
  });
  it('carries the size as a data attribute (width comes from a container token)', async () => {
    render(<Modal open size="large" title="T">Body</Modal>);
    expect(await screen.findByRole('dialog')).toHaveAttribute('data-size', 'large');
  });
  it('opens from the trigger, closes with Escape and returns focus to the trigger', async () => {
    render(<Modal trigger={trigger} title="T">Body</Modal>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });
  it('the close button dismisses it and has a name', async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="T" closeLabel="Dismiss">Body</Modal>);
    await userEvent.click(await screen.findByRole('button', { name: 'Dismiss' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('holds focus inside: Tab never leaves the dialog', async () => {
    render(<Modal open title="T" footer={<><button>Cancel</button><button>Delete</button></>}>Body</Modal>);
    const d = await screen.findByRole('dialog');
    for (let i = 0; i < 6; i++) { await userEvent.tab(); expect(d.contains(document.activeElement)).toBe(true); }
  });
  it('shows an optional decorative icon before the title without changing the name', async () => {
    render(<Modal open icon="triangle-alert" title="Delete three mandates">Body</Modal>);
    const d = await screen.findByRole('dialog', { name: 'Delete three mandates' });
    expect(d.querySelector('.ds-overlay__title svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('renders the footer only when given', async () => {
    const { rerender } = render(<Modal open title="T">Body</Modal>);
    await screen.findByRole('dialog');
    expect(document.querySelector('.ds-overlay__footer')).toBeNull();
    rerender(<Modal open title="T" footer={<button>OK</button>}>Body</Modal>);
    expect(document.querySelector('.ds-overlay__footer')).not.toBeNull();
  });
  it('has no axe violations', async () => {
    render(<Modal open title="Delete three mandates" description="Supporting line" footer={<button>Cancel</button>}>Body text</Modal>);
    const d = await screen.findByRole('dialog');
    expect(await axe(d)).toHaveNoViolations();
  });
});
