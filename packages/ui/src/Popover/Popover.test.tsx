import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Popover } from './Popover';

describe('Popover (acceptance from spec northgate/popover)', () => {
  it('opens from the trigger, which announces it', async () => {
    render(<Popover label="Filters" trigger={<button>Filters</button>}>Body</Popover>);
    const t = screen.getByRole('button', { name: 'Filters' });
    expect(t).toHaveAttribute('aria-haspopup', 'dialog');
    expect(t).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(t);
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    expect(t).toHaveAttribute('aria-expanded', 'true');
  });
  it('Escape closes it and returns focus to the trigger', async () => {
    render(<Popover label="Filters" trigger={<button>Filters</button>}>Body</Popover>);
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveFocus();
  });
  it('is non-modal: the page behind stays in the accessibility tree', async () => {
    render(<><button>Page</button><Popover label="Filters" trigger={<button>Filters</button>}>Body</Popover></>);
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    expect(screen.getByRole('button', { name: 'Page' })).toBeInTheDocument();
  });
  it('shows the footer only when actions are given', async () => {
    const { rerender } = render(<Popover open label="F" trigger={<button>F</button>}>Body</Popover>);
    await screen.findByRole('dialog');
    expect(document.querySelector('.ds-overlay__footer')).toBeNull();
    rerender(<Popover open label="F" trigger={<button>F</button>} footer={<button>Apply</button>}>Body</Popover>);
    expect(document.querySelector('.ds-overlay__footer')).not.toBeNull();
  });
  it('has no axe violations', async () => {
    render(<Popover open label="Filters" trigger={<button>Filters</button>} footer={<button>Apply</button>}>Body text</Popover>);
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations();
  });
});
