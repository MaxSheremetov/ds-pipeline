import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';

const accounts = [
  { value: 'current', label: 'Current account · 4412' },
  { value: 'savings', label: 'Savings account · 9081' },
  { value: 'business', label: 'Business account · 2290' },
  { value: 'joint', label: 'Joint account · 7716' },
  { value: 'closed', label: 'Old account · 1003 (closed)', disabled: true },
];

/**
 * Choose one value (or several with `multiple`) from a list. The field is the same as Input; the menu opens under it, as wide as the field. Optional leading icon and search.
 * Sizes and states mirror the Figma component `Select` (Northgate): Size x State x Content. A plain Select uses Radix Select; the search and multiple panels use Radix Popover; the look is ours.
 */
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Account', options: accounts, placeholder: 'Select an account', hint: 'Statements are sent for this account' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
  decorators: [(Story) => <div style={{ width: 280, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'current' } };
export const WithError: Story = { args: { error: 'Choose an account to continue' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'current' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'current' } };

const banks = Array.from({ length: 24 }, (_, i) => ({ value: `bank-${i}`, label: ['Northgate', 'Lumo', 'Corda', 'Rove', 'Meridian', 'Harbour', 'Fjord', 'Birch'][i % 8] + ` branch ${Math.floor(i / 8) + 1}` }));

/** An icon at the start of the field, for the kind of thing being chosen. */
export const WithIcon: Story = { args: { icon: 'landmark', defaultValue: 'current' } };

/** A search field at the top of the menu, for long lists. */
export const Searchable: Story = { args: { searchable: true, options: banks, label: 'Branch', placeholder: 'Select a branch', icon: 'landmark', hint: 'Type to narrow the list' } };

/** The searchable menu open, with the search typed. Used for the visual check against Figma. */
export const SearchableOpen: Story = {
  args: { searchable: true, options: banks, label: 'Branch', placeholder: 'Select a branch', defaultValue: 'bank-1' },
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /Branch/ }));
    await expect(within(document.body).getByRole('combobox', { name: 'Search Branch' })).toHaveFocus();
  },
};

export const SearchNoResults: Story = {
  args: { searchable: true, options: banks, label: 'Branch', placeholder: 'Select a branch' },
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /Branch/ }));
    await userEvent.keyboard('zzz');
    await expect(within(document.body).getAllByText('No results').length).toBeGreaterThan(0);
  },
};

/** Several values. The field says how many are chosen; the menu stays open and has a footer with the count and Clear. */
export const Multiple: Story = { args: { multiple: true, label: 'Accounts', placeholder: 'Select accounts', defaultValues: ['current', 'savings'], selectedLabel: (n: number) => `${n} ${n === 1 ? 'account' : 'accounts'} selected` } };

/** Multiple with a search field, for long lists. */
export const MultipleSearchable: Story = { args: { multiple: true, searchable: true, options: banks, label: 'Branches', placeholder: 'Select branches', defaultValues: ['bank-1', 'bank-2'] } };

/** The multiple menu open. Used for the visual check against Figma. */
export const MultipleOpen: Story = {
  args: { multiple: true, label: 'Accounts', placeholder: 'Select accounts', defaultValues: ['current', 'savings'], selectedLabel: (n: number) => `${n} ${n === 1 ? 'account' : 'accounts'} selected` },
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /Accounts/ }));
    await expect(within(document.body).getByRole('listbox', { name: 'Accounts' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ }');
    await expect(within(document.body).getAllByRole('option', { selected: true }).length).toBe(1);
  },
};

/** Every size in the default state. */
export const Sizes: Story = {
  decorators: [(Story) => <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)', width: 280 }}><Story /></div>],
  render: (args) => (
    <>
      <Select {...args} size="large" label="Large 40" defaultValue="current" />
      <Select {...args} size="medium" label="Medium 32" defaultValue="current" />
      <Select {...args} size="small" label="Small 24" defaultValue="current" />
    </>
  ),
};

/** States that can be shown statically. Hover, focus and the open menu are checked in the play tests. */
export const States: Story = {
  decorators: [(Story) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 'var(--ds-spacing-24)' }}><Story /></div>],
  render: (args) => (
    <>
      {(['large', 'medium', 'small'] as const).flatMap((size) => [
        <Select key={size + 'd'} {...args} size={size} label="Default" />,
        <Select key={size + 'f'} {...args} size={size} label="Filled" defaultValue="current" />,
        <Select key={size + 'e'} {...args} size={size} label="Error" error="Choose an account to continue" />,
        <Select key={size + 'x'} {...args} size={size} label="Disabled" disabled defaultValue="current" />,
        <Select key={size + 'r'} {...args} size={size} label="Read-only" readOnly defaultValue="current" />,
        <Select key={size + 'p'} {...args} size={size} label="Read-only empty" readOnly placeholder="Not set" hint="Managed by your administrator" />,
      ])}
    </>
  ),
};

/** The menu open with a chosen option and a disabled one. Used for the visual check against Figma. */
export const MenuOpen: Story = {
  args: { defaultValue: 'savings' },
  // Radix hides the rest of the page from assistive technology while the menu is open and keeps focus inside the menu, so Tab cannot reach the hidden field. axe still flags the field as aria-hidden but focusable.
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('combobox', { name: 'Account' }));
    await expect(within(document.body).getByRole('listbox')).toBeVisible();
  },
};

export const LabelFocusesField: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByText('Account'));
    await expect(c.getByRole('combobox', { name: 'Account' })).toHaveFocus();
  },
};

export const ChooseWithKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole('combobox', { name: 'Account' });
    field.focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    await expect(field).toHaveTextContent('Savings account · 9081');
    await expect(field).toHaveFocus();
  },
};
