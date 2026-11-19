import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Toggle } from './Toggle';

/**
 * Turns one setting on or off, and the change takes effect at once (no Save button). For a choice that is saved with a form use Checkbox.
 * It is a native checkbox with role switch. Sizes 24, 20, 16 high; mirrors Figma `Toggle`.
 */
const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { label: 'Card payments abroad' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const On: Story = {
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Card payments abroad' });
    await expect(sw).toBeChecked();
    await userEvent.click(sw);
    await expect(sw).not.toBeChecked();
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, defaultChecked: true } };
/** Without a visible label the name is for assistive technology; use Large. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Card payments abroad' } };

/** Every size and value, default state. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 'var(--ds-spacing-24)' }}>
          <Toggle {...args} size={s} label={`${s} off`} />
          <Toggle {...args} size={s} label={`${s} on`} defaultChecked />
          <Toggle {...args} size={s} label={`${s} disabled`} disabled />
          <Toggle {...args} size={s} label={`${s} disabled on`} disabled defaultChecked />
        </div>
      ))}
    </div>
  ),
};

/** Hover and focus are forced by the pseudo-states addon so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#tg-hover input', '#tg-hover-on input'], focusVisible: ['#tg-focus input', '#tg-focus-on input'] } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 'var(--ds-spacing-24)', padding: 'var(--ds-spacing-8)', justifyContent: 'start' }}>
      {[false, true].map((on) => (
        <React.Fragment key={String(on)}>
          <div><Toggle {...args} label="Default" defaultChecked={on} /></div>
          <div id={on ? 'tg-hover-on' : 'tg-hover'}><Toggle {...args} label="Hover" defaultChecked={on} /></div>
          <div id={on ? 'tg-focus-on' : 'tg-focus'}><Toggle {...args} label="Focus" defaultChecked={on} /></div>
          <div><Toggle {...args} label="Disabled" defaultChecked={on} disabled /></div>
        </React.Fragment>
      ))}
    </div>
  ),
};
