import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { IconButton } from '../IconButton/IconButton';

/**
 * A surface that groups one piece of content under an optional heading and action. The body is a slot: a chart, a list, a form, a table.
 * Three sizes set padding and gap. Mirrors Figma `Card` (Size).
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    size: 'medium',
    title: 'Collections this week',
    description: 'Across all mandates, settled and pending',
    action: <IconButton icon="ellipsis" label="More actions" variant="quiet" size="medium" />,
    children: 'Swap this for your own content.',
  },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'small' } };
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };
export const WithoutHeader: Story = { args: { title: undefined, description: undefined, action: undefined } };
