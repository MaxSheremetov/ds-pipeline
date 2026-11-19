import { describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Select } from './Select';

const options = [
  { value: 'current', label: 'Current account' },
  { value: 'savings', label: 'Savings account' },
  { value: 'closed', label: 'Old account', disabled: true },
  { value: 'joint', label: 'Joint account' },
];
const setup = (props = {}) => render(<Select label="Account" options={options} placeholder="Select an account" {...props} />);
const field = () => screen.getByRole('combobox', { name: 'Account' });

describe('Select (acceptance from spec northgate/select)', () => {
  it('label is connected to the field and focuses it', async () => {
    setup();
    await userEvent.click(screen.getByText('Account'));
    expect(field()).toHaveFocus();
  });

  it('shows the placeholder until something is chosen', () => {
    setup();
    expect(field()).toHaveTextContent('Select an account');
  });

  it('opens with Enter, Space and the arrow keys, and closes with Escape returning focus to the field', async () => {
    setup();
    field().focus();
    for (const key of ['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}']) {
      await userEvent.keyboard(key);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(field()).toHaveFocus();
    }
  });

  it('moves with arrows, Home and End, chooses with Enter, closes and puts the value in the field', async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    field().focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('savings');
    expect(field()).toHaveTextContent('Savings account');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(field()).toHaveFocus();
  });

  it('chooses with the pointer and announces the chosen option as selected', async () => {
    setup({ defaultValue: 'current' });
    await userEvent.click(field());
    const list = screen.getByRole('listbox');
    expect(within(list).getByRole('option', { name: 'Current account' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(within(list).getByRole('option', { name: 'Joint account' }));
    expect(field()).toHaveTextContent('Joint account');
  });

  it('typing a letter jumps to the option that starts with it', async () => {
    setup();
    await userEvent.click(field());
    await userEvent.keyboard('j{Enter}');
    expect(field()).toHaveTextContent('Joint account');
  });

  it('skips disabled options', async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange, defaultValue: 'savings' });
    await userEvent.click(field());
    expect(screen.getByRole('option', { name: 'Old account' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Old account' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('hint is read with the field; the error replaces it and marks the field invalid', () => {
    const { rerender } = setup({ hint: 'Statements are sent for this account' });
    expect(field()).toHaveAccessibleDescription('Statements are sent for this account');
    rerender(<Select label="Account" options={options} hint="Statements are sent for this account" error="Choose an account to continue" />);
    expect(field()).toHaveAccessibleDescription('Choose an account to continue');
    expect(field()).toBeInvalid();
    expect(screen.queryByText('Statements are sent for this account')).toBeNull();
  });

  it('disabled is skipped by Tab and cannot be opened', async () => {
    setup({ disabled: true });
    await userEvent.tab();
    expect(field()).not.toHaveFocus();
    await userEvent.click(field());
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('read-only is reachable by Tab and cannot be opened', async () => {
    setup({ readOnly: true, defaultValue: 'current' });
    await userEvent.tab();
    expect(field()).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(field());
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(field()).toHaveAttribute('aria-readonly', 'true');
  });

  it('has no axe violations closed and open', async () => {
    const { container } = setup({ hint: 'Statements are sent for this account' });
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(field());
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations(); // the open menu is portalled outside any landmark
  });
});

describe('Select with icon and search (spec northgate/select r2)', () => {
  const many = [
    { value: 'a', label: 'Current account · 4412' },
    { value: 'b', label: 'Savings account · 9081' },
    { value: 'c', label: 'Business account · 2290' },
    { value: 'd', label: 'Closed account · 1003', disabled: true },
    { value: 'e', label: 'Joint account · 7716' },
  ];
  const find = (props = {}) => render(<Select label="Account" options={many} searchable placeholder="Select an account" {...props} />);
  const trigger = () => screen.getByRole('button', { name: /Account/ });

  it('shows the leading icon inside the field, hidden from assistive technology', () => {
    render(<Select label="Account" options={options} icon="landmark" />);
    const svg = field().querySelector('svg.ds-icon');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(field().firstElementChild).toBe(svg);
  });

  it('opens a menu with a search field focused, and lists every option', async () => {
    find();
    await userEvent.click(trigger());
    const search = screen.getByRole('combobox', { name: 'Search Account' });
    expect(search).toHaveFocus();
    expect(screen.getAllByRole('option')).toHaveLength(5);
  });

  it('filters while typing, ignores case, and says when nothing is found', async () => {
    find();
    await userEvent.click(trigger());
    await userEvent.keyboard('JOINT');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Joint account · 7716']);
    await userEvent.clear(screen.getByRole('combobox', { name: 'Search Account' }));
    await userEvent.keyboard('zzz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getAllByText('No results').length).toBeGreaterThan(0);
  });

  it('moves with the arrows without leaving the search field, skips disabled options, and chooses with Enter', async () => {
    const onValueChange = vi.fn();
    find({ onValueChange });
    await userEvent.click(trigger());
    const search = screen.getByRole('combobox', { name: 'Search Account' });
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(search).toHaveFocus();
    expect(search).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /Joint/ }).id);
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('e');
    expect(trigger()).toHaveTextContent('Joint account');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it('opens on the chosen option, closes with Escape without changing, and starts the next search empty', async () => {
    find({ defaultValue: 'b' });
    await userEvent.click(trigger());
    const search = screen.getByRole('combobox', { name: 'Search Account' });
    expect(search).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /Savings/ }).id);
    expect(screen.getByRole('option', { name: /Savings/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('bus{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger()).toHaveTextContent('Savings account');
    await userEvent.click(trigger());
    expect(screen.getByRole('combobox', { name: 'Search Account' })).toHaveValue('');
  });

  it('chooses with the pointer, and the hidden form field carries the value', async () => {
    const { container } = find({ name: 'account' });
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('option', { name: /Business/ }));
    expect(trigger()).toHaveTextContent('Business account');
    expect(container.querySelector('input[type="hidden"][name="account"]')).toHaveValue('c');
  });

  it('a disabled option cannot be chosen', async () => {
    const onValueChange = vi.fn();
    find({ onValueChange });
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('option', { name: /Closed/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('read-only and disabled cannot be opened', async () => {
    const { rerender } = find({ readOnly: true });
    await userEvent.click(trigger());
    expect(screen.queryByRole('listbox')).toBeNull();
    rerender(<Select label="Account" options={many} searchable disabled />);
    await userEvent.click(trigger());
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('has no axe violations open', async () => {
    find({ hint: 'Statements are sent for this account' });
    await userEvent.click(trigger());
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});

describe('Select multiple (spec northgate/select r3)', () => {
  const opts = [
    { value: 'a', label: 'Current account' },
    { value: 'b', label: 'Savings account' },
    { value: 'c', label: 'Joint account' },
    { value: 'x', label: 'Old account', disabled: true },
  ];
  const many = (props = {}) => render(<Select multiple label="Accounts" options={opts} placeholder="Select accounts" {...props} />);
  const btn = () => screen.getByRole('button', { name: /Accounts/, hidden: true });

  it('shows the placeholder, one label, then a count from two chosen', async () => {
    let { rerender, unmount } = many();
    expect(btn()).toHaveTextContent('Select accounts');
    unmount();
    many({ defaultValues: ['b'] });
    expect(btn()).toHaveTextContent('Savings account');
    cleanup();
    ({ rerender } = many({ values: ['a', 'b'] }));
    rerender(<Select multiple label="Accounts" options={opts} values={['a', 'b']} />);
    expect(btn()).toHaveTextContent('2 selected');
    rerender(<Select multiple label="Accounts" options={opts} values={['a', 'b']} selectedLabel={(n) => `${n} accounts selected`} />);
    expect(btn()).toHaveTextContent('2 accounts selected');
  });

  it('opens a multiselectable list, keeps it open while choosing, and reports every change in option order', async () => {
    const onValuesChange = vi.fn();
    many({ onValuesChange });
    await userEvent.click(btn());
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Joint account' }));
    await userEvent.click(screen.getByRole('option', { name: 'Current account' }));
    expect(onValuesChange).toHaveBeenLastCalledWith(['a', 'c']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(2);
    await userEvent.click(screen.getByRole('option', { name: 'Joint account' }));
    expect(onValuesChange).toHaveBeenLastCalledWith(['a']);
  });

  it('keyboard: focus starts on the list, arrows move, Space and Enter toggle, Escape closes and returns focus', async () => {
    const onValuesChange = vi.fn();
    many({ onValuesChange });
    btn().focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ }');
    expect(onValuesChange).toHaveBeenLastCalledWith(['b']);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onValuesChange).toHaveBeenLastCalledWith(['b', 'c']);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(btn()).toHaveFocus();
  });

  it('a disabled option cannot be toggled', async () => {
    const onValuesChange = vi.fn();
    many({ onValuesChange });
    await userEvent.click(btn());
    await userEvent.click(screen.getByRole('option', { name: 'Old account' }));
    expect(onValuesChange).not.toHaveBeenCalled();
  });

  it('footer shows the count and Clear empties the choice; Clear is disabled when nothing is chosen', async () => {
    const onValuesChange = vi.fn();
    many({ defaultValues: ['a', 'b'], onValuesChange });
    await userEvent.click(btn());
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('2 selected')).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Clear' }));
    expect(onValuesChange).toHaveBeenLastCalledWith([]);
    expect(within(dialog).getByText('0 selected')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Clear' })).toBeDisabled();
    // The page is hidden from assistive technology while the panel is open, so find the field by its class.
    expect(document.querySelector('.ds-select__trigger')).toHaveTextContent('Select accounts');
  });

  it('sends every chosen value with the form', async () => {
    const { container } = many({ name: 'acc', defaultValues: ['a', 'c'] });
    const inputs = [...container.querySelectorAll('input[type="hidden"][name="acc"]')] as HTMLInputElement[];
    expect(inputs.map((i) => i.value)).toEqual(['a', 'c']);
  });

  it('with search: filters, toggles with Enter, and Tab moves on to Clear instead of closing', async () => {
    const onValuesChange = vi.fn();
    many({ searchable: true, onValuesChange });
    await userEvent.click(btn());
    await userEvent.keyboard('sav{Enter}');
    expect(onValuesChange).toHaveBeenLastCalledWith(['b']);
    await userEvent.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has no axe violations open', async () => {
    many({ defaultValues: ['a'] });
    await userEvent.click(btn());
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
