import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Nav, NavItem, NavRailItem } from './Nav';

describe('Nav (acceptance from spec northgate/nav)', () => {
  it('is a nav landmark with a name and a list of links', () => {
    render(<Nav label="Main"><NavItem icon="wallet" href="/a">Accounts</NavItem><NavItem icon="repeat" href="/t">Transfers</NavItem></Nav>);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual(['Accounts', 'Transfers']);
  });
  it('the active destination carries aria-current="page"; the others do not', () => {
    render(<Nav label="Main"><NavItem icon="wallet" href="/a" active>Accounts</NavItem><NavItem icon="repeat" href="/t">Transfers</NavItem></Nav>);
    expect(screen.getByRole('link', { name: 'Accounts' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Transfers' })).not.toHaveAttribute('aria-current');
  });
  it('without href an item is a button and calls onClick', async () => {
    const fn = vi.fn();
    render(<Nav label="Main"><NavItem icon="wallet" onClick={fn}>Accounts</NavItem></Nav>);
    await userEvent.click(screen.getByRole('button', { name: 'Accounts' }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('shows a count after the label', () => {
    render(<Nav label="Main"><NavItem icon="landmark" href="/m" count={42}>Mandates</NavItem></Nav>);
    expect(screen.getByRole('link')).toHaveTextContent('Mandates42');
  });
  it('items are reachable in order with the keyboard', async () => {
    render(<Nav label="Main"><NavItem icon="wallet" href="/a">Accounts</NavItem><NavItem icon="repeat" href="/t">Transfers</NavItem></Nav>);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Accounts' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Transfers' })).toHaveFocus();
  });
  it('a rail item is named by its label and shows it as a tooltip on focus', async () => {
    render(<Nav label="Main"><NavRailItem icon="wallet" label="Accounts" href="/a" /></Nav>);
    const link = screen.getByRole('link', { name: 'Accounts' });
    expect(link).toHaveAttribute('data-rail', 'true');
    await userEvent.tab();
    expect(link).toHaveFocus();
    expect((await screen.findAllByText('Accounts')).length).toBeGreaterThan(0);
  });
  it('icons are decoration and are hidden from assistive technology', () => {
    const { container } = render(<Nav label="Main"><NavItem icon="wallet" href="/a">Accounts</NavItem></Nav>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('has no axe violations (expanded and rail)', async () => {
    const { container } = render(
      <>
        <Nav label="Main"><NavItem icon="wallet" href="/a" active count={3}>Accounts</NavItem><NavItem icon="repeat" href="/t">Transfers</NavItem></Nav>
        <Nav label="Rail"><NavRailItem icon="wallet" label="Accounts" href="/a" active /><NavRailItem icon="repeat" label="Transfers" href="/t" /></Nav>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
