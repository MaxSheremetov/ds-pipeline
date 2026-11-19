import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

/**
 * Choose one of several views. Underline and Enclosed are tabs: they sit above a region and change what is below it. Segmented is a control: a sunken track with the chosen item raised out of it, used inline where tabs would wrongly promise that the whole region changes.
 * Two to six sibling views of one object. More than six is a select or a side nav; a sequence that must be done in order is a stepper. Mirrors the Figma components Tab item and Tabs.
 * Compose it as `Tabs` > `TabList` (named) > `Tab` (one per view), then one `TabPanel` per tab with the same value.
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  tags: ['autodocs'],
  args: { appearance: 'underline', defaultValue: 'accounts' },
  argTypes: { appearance: { control: 'inline-radio', options: ['underline', 'enclosed', 'segmented'] } },
  render: (args) => (
    <Tabs {...args}>
      <TabList label="Account sections">
        <Tab value="accounts" count={4}>Accounts</Tab>
        <Tab value="payments" count={12}>Payments</Tab>
        <Tab value="statements" count={3}>Statements</Tab>
      </TabList>
      <TabPanel value="accounts"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Four accounts.</p></TabPanel>
      <TabPanel value="payments"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Twelve payments.</p></TabPanel>
      <TabPanel value="statements"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Three statements.</p></TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('tab', { name: /Payments/ }));
    await expect(c.getByRole('tab', { name: /Payments/ })).toHaveAttribute('aria-selected', 'true');
    await expect(c.getByText('Twelve payments.')).toBeVisible();
  },
};
export const Enclosed: Story = { args: { appearance: 'enclosed' } };
/** Inline, beside content that changes: a chart range, a list filter, a view mode. */
export const Segmented: Story = { args: { appearance: 'segmented' } };
export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList label="Views">
        <Tab value="accounts" icon="landmark" count={4}>Accounts</Tab>
        <Tab value="payments" icon="credit-card" count={12}>Payments</Tab>
        <Tab value="statements" icon="file-text" count={3}>Statements</Tab>
      </TabList>
      <TabPanel value="accounts"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Four accounts.</p></TabPanel>
      <TabPanel value="payments"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Twelve payments.</p></TabPanel>
      <TabPanel value="statements"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Three statements.</p></TabPanel>
    </Tabs>
  ),
};
/** A disabled tab cannot be chosen. Show an empty tab with a zero count instead of hiding or disabling it where you can. */
export const Disabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList label="Account sections">
        <Tab value="accounts">Accounts</Tab>
        <Tab value="payments">Payments</Tab>
        <Tab value="statements" disabled>Statements</Tab>
      </TabList>
      <TabPanel value="accounts"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Four accounts.</p></TabPanel>
      <TabPanel value="payments"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Twelve payments.</p></TabPanel>
      <TabPanel value="statements"><p style={{ margin: 'var(--ds-spacing-16) 0' }}>Three statements.</p></TabPanel>
    </Tabs>
  ),
};
/** All three styles, side by side. */
export const Styles: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-32)', padding: 'var(--ds-spacing-8)' }}>
      {(['underline', 'enclosed', 'segmented'] as const).map((a) => (
        <Tabs key={a} {...args} appearance={a}>
          <TabList label={`${a} tabs`}>
            <Tab value="accounts" count={4}>Accounts</Tab>
            <Tab value="payments" count={12}>Payments</Tab>
            <Tab value="statements" count={3}>Statements</Tab>
          </TabList>
          <TabPanel value="accounts" />
          <TabPanel value="payments" />
          <TabPanel value="statements" />
        </Tabs>
      ))}
    </div>
  ),
};
/** Hover and focus are forced so every style can be compared with Figma. Row per style: Default, Hover, Selected, Focus. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#tb-hover [role=tab]'], focusVisible: ['#tb-focus [role=tab]'] } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--ds-spacing-24)', justifyContent: 'start', padding: 'var(--ds-spacing-8)' }}>
      {(['underline', 'enclosed', 'segmented'] as const).flatMap((a) => [
        <div key={a + 'd'}><Tabs appearance={a} defaultValue="none"><TabList label={`${a} default`}><Tab value="x">Default</Tab></TabList><TabPanel value="x" /></Tabs></div>,
        <div key={a + 'h'} id={a === 'underline' ? 'tb-hover' : undefined}><Tabs appearance={a} defaultValue="none"><TabList label={`${a} hover`}><Tab value="x">Hover</Tab></TabList><TabPanel value="x" /></Tabs></div>,
        <div key={a + 's'}><Tabs appearance={a} defaultValue="x"><TabList label={`${a} selected`}><Tab value="x">Selected</Tab></TabList><TabPanel value="x" /></Tabs></div>,
      ])}
      <div id="tb-focus"><Tabs appearance="underline" defaultValue="none"><TabList label="focus"><Tab value="x">Focus</Tab></TabList><TabPanel value="x" /></Tabs></div>
    </div>
  ),
};
