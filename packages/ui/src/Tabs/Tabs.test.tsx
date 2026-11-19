import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const Sample = (p: { appearance?: 'underline' | 'enclosed' | 'segmented' } = {}) => (
  <Tabs defaultValue="a" appearance={p.appearance}>
    <TabList label="Account sections">
      <Tab value="a" count={4}>Accounts</Tab>
      <Tab value="b">Payments</Tab>
      <Tab value="c" disabled>Statements</Tab>
    </TabList>
    <TabPanel value="a">Accounts content</TabPanel>
    <TabPanel value="b">Payments content</TabPanel>
    <TabPanel value="c">Statements content</TabPanel>
  </Tabs>
);

describe('Tabs (acceptance from spec northgate/tabs)', () => {
  it('is a tablist with a name, each item a tab with aria-selected', () => {
    render(<Sample />);
    expect(screen.getByRole('tablist', { name: 'Account sections' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Accounts/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'false');
  });
  it('shows only the selected tab\'s panel', async () => {
    render(<Sample />);
    expect(screen.getByText('Accounts content')).toBeVisible();
    expect(screen.queryByText('Payments content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Payments' }));
    expect(screen.getByText('Payments content')).toBeVisible();
  });
  it('Tab enters the bar once, arrow keys move between tabs, Tab leaves it', async () => {
    render(<><Sample /><button>after</button></>);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: /Accounts/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus(); // Tab leaves the bar and enters the content
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });
  it('arrow keys skip a disabled tab', async () => {
    render(<Sample />);
    await userEvent.click(screen.getByRole('tab', { name: 'Payments' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Accounts/ })).toHaveFocus();
  });
  it('a disabled tab cannot be chosen', async () => {
    render(<Sample />);
    await userEvent.click(screen.getByRole('tab', { name: 'Statements' }));
    expect(screen.getByRole('tab', { name: 'Statements' })).toHaveAttribute('aria-selected', 'false');
  });
  it('shows the count after the label', () => {
    render(<Sample />);
    expect(screen.getByRole('tab', { name: /Accounts/ })).toHaveTextContent('Accounts4');
  });
  it('exposes the style as a data attribute, Underline by default', () => {
    const { container, rerender } = render(<Sample />);
    expect(container.firstElementChild).toHaveAttribute('data-appearance', 'underline');
    rerender(<Sample appearance="segmented" />);
    expect(container.firstElementChild).toHaveAttribute('data-appearance', 'segmented');
  });
  it('an icon is decoration and is hidden from assistive technology', () => {
    const { container } = render(<Tabs defaultValue="a"><TabList label="x"><Tab value="a" icon="landmark">Accounts</Tab></TabList></Tabs>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it.each(['underline', 'enclosed', 'segmented'] as const)('has no axe violations (%s)', async (a) => {
    const { container } = render(<Sample appearance={a} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
