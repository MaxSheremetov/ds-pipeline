import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen } from 'storybook/test';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';

/**
 * A panel from the edge of the screen for a task that belongs to the page behind it. It behaves as a Modal: focus is held inside, Escape closes it.
 * Right and left are 560 wide, bottom spans the width; only the corners facing the page are rounded. Mirrors Figma `Drawer` (Side).
 */
const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 560 } } },
  args: {
    title: 'Mandate details',
    description: 'Collected by the main account since 12 Mar.',
    trigger: <Button variant="secondary">Open details</Button>,
    children: <p style={{ margin: 0, color: 'var(--ds-colour-text-dim)', fontSize: 'var(--ds-type-fs-meta)', lineHeight: 'var(--ds-type-line-meta)' }}>Amount, schedule and the last five collections appear here.</p>,
    footer: (<><Button variant="secondary" size="medium">Close</Button><Button variant="primary" size="medium">Save changes</Button></>),
  },
  argTypes: { side: { control: 'inline-radio', options: ['right', 'left', 'bottom'] } },
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Open details' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Mandate details' });
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
export const Right: Story = { args: { open: true, side: 'right' } };
export const Left: Story = { args: { open: true, side: 'left' } };
export const Bottom: Story = { args: { open: true, side: 'bottom' } };
export const WithIcon: Story = { args: { open: true, icon: 'triangle-alert', title: 'Review before sending' } };
