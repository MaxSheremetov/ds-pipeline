import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';

/**
 * A single-line text field with a visible label, a hint and an error message.
 * Sizes and states mirror the Figma component `Input` (Northgate): Size x State x Content.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'name@bank.example', hint: 'We use this for statements only' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'name@bank.example' } };
export const WithError: Story = { args: { defaultValue: 'name@bank', error: 'Enter a valid email address' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'name@bank.example' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'name@bank.example' } };

/** Every size in the default state. */
export const Sizes: Story = {
  decorators: [(Story) => <div style={{ display: 'grid', gap: 'var(--ds-spacing-16)', width: 280 }}><Story /></div>],
  render: (args) => (
    <>
      <Input {...args} size="large" label="Large 40" />
      <Input {...args} size="medium" label="Medium 32" />
      <Input {...args} size="small" label="Small 24" />
    </>
  ),
};

/** States that can be shown statically. Hover and focus are checked in the play tests. */
export const States: Story = {
  decorators: [(Story) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 'var(--ds-spacing-24)' }}><Story /></div>],
  render: (args) => (
    <>
      {(['large', 'medium', 'small'] as const).flatMap((size) => [
        <Input key={size + 'd'} {...args} size={size} label="Default" />,
        <Input key={size + 'f'} {...args} size={size} label="Filled" defaultValue="name@bank.example" />,
        <Input key={size + 'e'} {...args} size={size} label="Error" defaultValue="name@bank" error="Enter a valid email address" />,
        <Input key={size + 'x'} {...args} size={size} label="Disabled" disabled />,
        <Input key={size + 'r'} {...args} size={size} label="Read-only" readOnly defaultValue="name@bank.example" />,
        <Input key={size + 'p'} {...args} size={size} label="Read-only empty" readOnly placeholder="Not set" hint="Managed by your administrator" />,
      ])}
    </>
  ),
};

export const LabelFocusesField: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByText('Email'));
    await expect(c.getByLabelText('Email')).toHaveFocus();
  },
};
export const ErrorIsAnnounced: Story = {
  args: { error: 'Enter a valid email address' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Email');
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription('Enter a valid email address');
  },
};
