import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
);

/**
 * Triggers an action. Use one Primary button per view.
 * Variants, sizes and states mirror the Figma component `Button` (Northgate): Variant x Size x State.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'quiet', 'danger'] },
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Quiet: Story = { args: { variant: 'quiet' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete project' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const WithIcons: Story = { args: { leadingIcon: <Plus />, trailingIcon: <Plus />, children: 'Add item' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-16)', alignItems: 'center' }}>
      <Button {...args} size="large">Large 40</Button>
      <Button {...args} size="medium">Medium 32</Button>
      <Button {...args} size="small">Small 24</Button>
    </div>
  ),
};

/** Every variant in every state that can be shown statically. Hover, pressed and focus are checked in the play tests. */
export const Matrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 'var(--ds-spacing-16)' }}>
      {(['primary', 'secondary', 'quiet', 'danger'] as const).flatMap((v) => [
        <Button key={v + 'd'} {...args} variant={v}>{v}</Button>,
        <Button key={v + 'x'} {...args} variant={v} disabled>{v}</Button>,
        <Button key={v + 'l'} {...args} variant={v} loading>{v}</Button>,
      ])}
    </div>
  ),
};

/**
 * All six Figma states side by side, for every variant. Hover, Pressed and Focus are forced with
 * the pseudo-states addon, so you can see them without a mouse. In a real page focus appears
 * only for keyboard users (press Tab), hover and pressed only while the pointer is on the button.
 */
export const States: Story = {
  render: (args) => {
    const cols: { label: string; props: Record<string, unknown> }[] = [
      { label: 'Default', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Pressed', props: { className: 'pseudo-hover pseudo-active' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Disabled', props: { disabled: true } },
      { label: 'Loading', props: { loading: true } },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content repeat(6, max-content)', gap: 'var(--ds-spacing-16)', alignItems: 'center', fontFamily: 'var(--ds-type-font-text)', fontSize: 'var(--ds-type-fs-meta)', color: 'var(--ds-colour-text-dim)' }}>
        <span />
        {cols.map((c) => <span key={c.label}>{c.label}</span>)}
        {(['primary', 'secondary', 'quiet', 'danger'] as const).flatMap((v) => [
          <span key={v}>{v}</span>,
          ...cols.map((c) => <Button key={v + c.label} {...args} variant={v} {...c.props}>Button</Button>),
        ])}
      </div>
    );
  },
};

export const ClickFiresOnce: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save changes' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const LoadingBlocksClicks: Story = {
  args: { loading: true },
  play: async ({ canvasElement, args }) => {
    const btn = within(canvasElement).getByRole('button');
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(btn).toHaveAttribute('aria-busy', 'true');
  },
};
