import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../Button/Button';

/**
 * A small floating panel opened from a button. Non-modal: the page stays usable, focus moves in, Escape closes it and focus returns to the trigger.
 * 320 wide, optional footer with actions. Mirrors Figma `Popover` (Actions).
 */
const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
  args: {
    label: 'Filters',
    trigger: <Button variant="secondary">Filters</Button>,
    children: <p style={{ margin: 0, color: 'var(--ds-colour-text-dim)', fontSize: 'var(--ds-type-fs-meta)', lineHeight: 'var(--ds-type-line-meta)' }}>Show only mandates collected this month.</p>,
  },
  decorators: [(Story) => <div style={{ padding: 'var(--ds-spacing-32)', minHeight: 'var(--ds-container-popover)' }}><Story /></div>],
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
};
export const WithActions: Story = {
  args: { open: true, footer: (<><Button variant="secondary" size="medium">Reset</Button><Button variant="primary" size="medium">Apply</Button></>) },
};
/** Closed: Enter opens it, Escape closes it and focus returns to the button. */
export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Filters' });
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
