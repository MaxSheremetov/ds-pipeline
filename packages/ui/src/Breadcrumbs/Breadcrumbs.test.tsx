import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

const Sample = () => (
  <Breadcrumbs>
    <BreadcrumbItem href="/" icon="home">Home</BreadcrumbItem>
    <BreadcrumbItem href="/accounts">Accounts</BreadcrumbItem>
    <BreadcrumbItem current>Current account 4412</BreadcrumbItem>
  </Breadcrumbs>
);

describe('Breadcrumbs (acceptance from spec northgate/breadcrumb)', () => {
  it('is a nav landmark with a name, holding an ordered list', () => {
    render(<Sample />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
  it('the name can be changed when a page has two trails', () => {
    render(<Breadcrumbs label="Record location"><BreadcrumbItem current>Here</BreadcrumbItem></Breadcrumbs>);
    expect(screen.getByRole('navigation', { name: 'Record location' })).toBeInTheDocument();
  });
  it('every crumb but the last is a link', () => {
    render(<Sample />);
    expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual(['Home', 'Accounts']);
  });
  it('the current crumb is text with aria-current="page", not a link to itself', () => {
    render(<Sample />);
    const cur = screen.getByText('Current account 4412').closest('[aria-current]')!;
    expect(cur).toHaveAttribute('aria-current', 'page');
    expect(cur.tagName).not.toBe('A');
  });
  it('separators and the icon are decoration, hidden from assistive technology', () => {
    const { container } = render(<Sample />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
  });
  it('links are reachable in document order', async () => {
    render(<Sample />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Accounts' })).toHaveFocus();
  });
  it('has no axe violations', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
  describe('overflow', () => {
    const Long = (props: { maxItems?: number }) => (
      <Breadcrumbs {...props}>
        <BreadcrumbItem href="/" icon="home">Home</BreadcrumbItem>
        <BreadcrumbItem href="/reports">Reports</BreadcrumbItem>
        <BreadcrumbItem href="/statements">Quarterly statements</BreadcrumbItem>
        <BreadcrumbItem href="/accounts">Accounts</BreadcrumbItem>
        <BreadcrumbItem current>Savings account</BreadcrumbItem>
      </Breadcrumbs>
    );
    it('collapses a trail longer than maxItems to the first crumb, an ellipsis button and the last two', () => {
      render(<Long />);
      expect(screen.getAllByRole('link').map((l) => l.textContent)).toEqual(['Home', 'Accounts']);
      expect(screen.getByText('Savings account').closest('[aria-current]')).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('button', { name: 'Show hidden pages' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Reports' })).not.toBeInTheDocument();
    });
    it('opens a list of the hidden crumbs as links, and Escape closes it and returns focus to the button', async () => {
      render(<Long />);
      const button = screen.getByRole('button', { name: 'Show hidden pages' });
      await userEvent.click(button);
      const dialog = await screen.findByRole('dialog', { name: 'Show hidden pages' });
      expect(Array.from(dialog.querySelectorAll('a')).map((a) => a.textContent)).toEqual(['Reports', 'Quarterly statements']);
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(button).toHaveFocus();
    });
    it('does not collapse a trail that fits, and maxItems can switch the collapse off', () => {
      const { unmount } = render(<Sample />);
      expect(screen.queryByRole('button', { name: 'Show hidden pages' })).not.toBeInTheDocument();
      unmount();
      render(<Long maxItems={99} />);
      expect(screen.queryByRole('button', { name: 'Show hidden pages' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(4);
    });
    it('has no accessibility violations collapsed or open', async () => {
      const { container } = render(<Long />);
      expect(await axe(container)).toHaveNoViolations();
      await userEvent.click(screen.getByRole('button', { name: 'Show hidden pages' }));
      expect(await axe(document.body)).toHaveNoViolations();
    });
  });
});
