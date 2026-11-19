import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Radio, RadioGroup } from './Radio';

/**
 * Chooses exactly one option from a short list. Use RadioGroup around two to five Radio options: the group gives them one name, one answer and one legend.
 * For several answers use Checkbox; for an instant on/off use Toggle. Sizes 24, 20, 16; mirrors Figma `Radio`.
 */
const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { value: 'monthly', label: 'Monthly statement' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

/** The normal way to use it. The group owns the name and the value; the options only say what they stand for. */
export const Group: Story = {
  render: () => (
    <RadioGroup legend="Statement frequency" hint="You can change this later in Settings." defaultValue="monthly">
      <Radio value="monthly" label="Monthly" />
      <Radio value="quarterly" label="Quarterly" />
      <Radio value="never" label="Do not send statements" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('radio', { name: 'Quarterly' }));
    await expect(c.getByRole('radio', { name: 'Quarterly' })).toBeChecked();
    await expect(c.getByRole('radio', { name: 'Monthly' })).not.toBeChecked();
  },
};
export const Horizontal: Story = {
  render: () => (
    <RadioGroup legend="Account type" orientation="horizontal" defaultValue="current">
      <Radio value="current" label="Current" />
      <Radio value="savings" label="Savings" />
    </RadioGroup>
  ),
};
/** Nothing is chosen at the start, the person answers on Confirm. The error replaces the hint. */
export const WithError: Story = {
  render: () => (
    <RadioGroup legend="Statement frequency" error="Choose how often you want statements">
      <Radio value="monthly" label="Monthly" />
      <Radio value="quarterly" label="Quarterly" />
    </RadioGroup>
  ),
};
export const GroupDisabled: Story = {
  render: () => (
    <RadioGroup legend="Statement frequency" disabled defaultValue="monthly">
      <Radio value="monthly" label="Monthly" />
      <Radio value="quarterly" label="Quarterly" />
    </RadioGroup>
  ),
};

/** Every size and value, default state. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 'var(--ds-spacing-24)' }}>
          <Radio value="a" name={`off-${s}`} size={s} label={`${s} off`} />
          <Radio value="a" name={`on-${s}`} size={s} label={`${s} on`} defaultChecked />
          <Radio value="a" name={`dis-${s}`} size={s} label={`${s} disabled`} disabled />
        </div>
      ))}
    </div>
  ),
};

/** Hover and focus are forced by the pseudo-states addon so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#rd-hover input', '#rd-hover-on input'], focusVisible: ['#rd-focus input', '#rd-focus-on input'] } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 'var(--ds-spacing-24)', padding: 'var(--ds-spacing-8)', justifyContent: 'start' }}>
      {[false, true].map((on) => (
        <React.Fragment key={String(on)}>
          <div><Radio value="a" name={`s-d-${on}`} label="Default" defaultChecked={on} /></div>
          <div id={on ? 'rd-hover-on' : 'rd-hover'}><Radio value="a" name={`s-h-${on}`} label="Hover" defaultChecked={on} /></div>
          <div id={on ? 'rd-focus-on' : 'rd-focus'}><Radio value="a" name={`s-f-${on}`} label="Focus" defaultChecked={on} /></div>
          <div><Radio value="a" name={`s-x-${on}`} label="Disabled" defaultChecked={on} disabled /></div>
        </React.Fragment>
      ))}
    </div>
  ),
};
