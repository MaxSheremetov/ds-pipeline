import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

/**
 * A dialog that stops the page until it is answered or dismissed. Focus is held inside and returns to the trigger; Escape closes it.
 * Three widths (420, 560, 760); the footer lays the actions out on the right, secondary first. Mirrors Figma `Modal` (Size).
 * The stories below are held open so they can be compared with Figma; each opens in its own frame.
 */
const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 460 } } },
  args: {
    title: 'Delete three mandates',
    description: 'They will stop collecting immediately. This cannot be undone.',
    trigger: <Button variant="secondary">Delete mandates</Button>,
    children: <p style={{ margin: 0, color: 'var(--ds-colour-text-dim)', fontSize: 'var(--ds-type-fs-meta)', lineHeight: 'var(--ds-type-line-meta)' }}>Deleted mandates stay in the audit log for 90 days.</p>,
    footer: (<><Button variant="secondary" size="medium">Cancel</Button><Button variant="danger" size="medium">Delete</Button></>),
  },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Closed: press the button. Tab stays inside, Escape closes and focus returns to the button. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Delete mandates' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Delete three mandates' });
    await expect(dialog).toHaveAccessibleDescription('They will stop collecting immediately. This cannot be undone.');
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
export const Small: Story = { args: { open: true, size: 'small' } };
export const Medium: Story = { args: { open: true, size: 'medium' } };
export const Large: Story = { args: { open: true, size: 'large' } };
export const WithIcon: Story = { args: { open: true, icon: 'triangle-alert', title: 'Delete three mandates' } };
export const WithoutFooter: Story = { args: { open: true, footer: undefined, title: 'Mandate details', description: undefined } };
