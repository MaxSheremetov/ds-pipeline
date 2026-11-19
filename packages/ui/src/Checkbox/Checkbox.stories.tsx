import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

/**
 * Selects an item, or turns an option on. Value Off, On or Mixed; sizes 24, 20, 16; mirrors Figma `Checkbox`.
 * Mixed is a real third value for a parent whose children are partly selected.
 */
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Send statements by email' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Mixed: Story = { args: { mixed: true, label: 'Select all' } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };
/** In a table row there is no room for a label; the name is for assistive technology. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Select row 3' } };

/** Every size and value, default state. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 'var(--ds-spacing-24)' }}>
          <Checkbox {...args} size={s} label={`${s} off`} />
          <Checkbox {...args} size={s} label={`${s} on`} defaultChecked />
          <Checkbox {...args} size={s} label={`${s} mixed`} mixed />
          <Checkbox {...args} size={s} label={`${s} disabled`} disabled />
        </div>
      ))}
    </div>
  ),
};

/** Hover and focus are forced by the pseudo-states addon so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#cb-hover input', '#cb-hover-on input'], focusVisible: ['#cb-focus input', '#cb-focus-on input'] } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 'var(--ds-spacing-24)', padding: 'var(--ds-spacing-8)', justifyContent: 'start' }}>
      {[false, true].map((on) => (
        <React.Fragment key={String(on)}>
          <div><Checkbox {...args} label="Default" defaultChecked={on} /></div>
          <div id={on ? 'cb-hover-on' : undefined}><span id={on ? undefined : 'cb-hover'}><Checkbox {...args} label="Hover" defaultChecked={on} /></span></div>
          <div id={on ? 'cb-focus-on' : undefined}><span id={on ? undefined : 'cb-focus'}><Checkbox {...args} label="Focus" defaultChecked={on} /></span></div>
          <div><Checkbox {...args} label="Disabled" defaultChecked={on} disabled /></div>
        </React.Fragment>
      ))}
    </div>
  ),
};

export const ToggleByLabelAndKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox');
    await userEvent.click(within(canvasElement).getByText('Send statements by email'));
    await expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};
