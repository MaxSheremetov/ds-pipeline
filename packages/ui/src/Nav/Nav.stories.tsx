import type { Meta, StoryObj } from '@storybook/react-vite';
import { Nav, NavItem, NavRailItem } from './Nav';

/**
 * The destinations of a product, in a side nav (NavItem, 248 wide with a label) or an icon-only rail (NavRailItem, 40 x 40 with a tooltip).
 * The active destination is tinted, carries a marker bar and aria-current="page". There is no disabled state by design: a destination a person cannot reach is hidden or marked, not greyed. A rail is a separate component, not a variant of the expanded nav. Mirrors the Figma components Nav item and Nav rail item.
 */
const meta = {
  title: 'Components/Nav',
  component: Nav,
  subcomponents: { NavItem, NavRailItem },
  tags: ['autodocs'],
  args: { label: 'Main', children: null },
} satisfies Meta<typeof Nav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SideNav: Story = {
  render: (args) => (
    <div style={{ width: 'var(--ds-container-nav)' }}>
      <Nav {...args}>
        <NavItem icon="landmark" href="#mandates" active count={42}>Mandates</NavItem>
        <NavItem icon="wallet" href="#accounts">Accounts</NavItem>
        <NavItem icon="repeat" href="#transfers">Transfers</NavItem>
        <NavItem icon="file-text" href="#statements">Statements</NavItem>
        <NavItem icon="settings" href="#settings">Settings</NavItem>
      </Nav>
    </div>
  ),
};
export const Rail: Story = {
  render: (args) => (
    <Nav {...args}>
      <NavRailItem icon="landmark" label="Mandates" href="#mandates" active />
      <NavRailItem icon="wallet" label="Accounts" href="#accounts" />
      <NavRailItem icon="repeat" label="Transfers" href="#transfers" />
      <NavRailItem icon="file-text" label="Statements" href="#statements" />
      <NavRailItem icon="settings" label="Settings" href="#settings" />
    </Nav>
  ),
};
/** Without href an item is a button, for an app that switches views itself. */
export const AsButtons: Story = {
  render: (args) => (
    <div style={{ width: 'var(--ds-container-nav)' }}>
      <Nav {...args}>
        <NavItem icon="wallet" active>Accounts</NavItem>
        <NavItem icon="repeat">Transfers</NavItem>
      </Nav>
    </div>
  ),
};
/** Default, Hover, Active, Active hover, Focus. Hover and focus are forced so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#nv-hover a', '#nv-ahover a'], focusVisible: ['#nv-focus a'] } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, var(--ds-container-nav))', gap: 'var(--ds-spacing-24)' }}>
      <Nav label="Default"><NavItem icon="landmark" href="#d">Default</NavItem></Nav>
      <div id="nv-hover"><Nav label="Hover"><NavItem icon="landmark" href="#d">Hover</NavItem></Nav></div>
      <Nav label="Active"><NavItem icon="landmark" href="#d" active>Active</NavItem></Nav>
      <div id="nv-ahover"><Nav label="Active hover"><NavItem icon="landmark" href="#d" active>Active hover</NavItem></Nav></div>
      <div id="nv-focus"><Nav label="Focus"><NavItem icon="landmark" href="#d">Focus</NavItem></Nav></div>
    </div>
  ),
};
