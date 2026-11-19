import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

/**
 * A person or account as a circle: initials, or a photo. The name is the accessible name; the initials are decoration.
 * Mirrors Figma `Avatar` (Type x Size). With no photo, or when it fails to load, the person icon of Type Photo shows.
 */
const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Ama Mensah', size: 'medium' },
  argTypes: { size: { control: 'inline-radio', options: ['large', 'medium', 'small'] } },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: 'large' } };
export const Small: Story = { args: { size: 'small' } };
export const PhotoPlaceholder: Story = { args: { src: 'missing-photo.png' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Avatar name="Ama Mensah" size="large" />
      <Avatar name="Ama Mensah" size="medium" />
      <Avatar name="Ama Mensah" size="small" />
      <Avatar name="Ama Mensah" size="large" src="missing-photo.png" />
      <Avatar name="Ama Mensah" size="medium" src="missing-photo.png" />
      <Avatar name="Ama Mensah" size="small" src="missing-photo.png" />
    </div>
  ),
};
