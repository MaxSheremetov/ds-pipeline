import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip (acceptance from spec northgate/tooltip)', () => {
  it('is hidden until the trigger is focused, then describes it', async () => {
    render(<Tooltip content="Settled on 18 Sep"><button>Settled</button></Tooltip>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.tab();
    expect((await screen.findAllByText('Settled on 18 Sep')).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Settled' })).toHaveAttribute('aria-describedby');
  });
  it('Escape hides it', async () => {
    render(<Tooltip content="Hint"><button>Go</button></Tooltip>);
    await userEvent.tab();
    expect((await screen.findAllByText('Hint')).length).toBeGreaterThan(0);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });
  it('shows on hover after the delay', async () => {
    render(<Tooltip content="Hover hint" delayDuration={0}><button>Go</button></Tooltip>);
    await userEvent.hover(screen.getByRole('button'));
    expect((await screen.findAllByText('Hover hint')).length).toBeGreaterThan(0);
  });
  it('carries the side as a data attribute', async () => {
    render(<Tooltip content="Hint" side="bottom" open><button>Go</button></Tooltip>);
    expect(document.querySelector('.ds-tooltip')).toHaveAttribute('data-side', 'bottom');
  });
  it('has no axe violations while open', async () => {
    const { container } = render(<Tooltip content="Hint" open><button>Go</button></Tooltip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
