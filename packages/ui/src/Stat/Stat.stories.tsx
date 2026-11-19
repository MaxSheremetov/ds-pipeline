import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

/**
 * A figure with its label and, optionally, how it moved. Up is green, Down is red, Flat is grey: the colour follows the direction, not whether the direction is good news.
 * Mirrors Figma `Stat` (Size x Trend).
 */
const meta = {
  title: 'Components/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: { label: 'Collected this week', value: '184 920', trend: 'up', change: '12.4%', period: 'vs last week', size: 'large' },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
    trend: { control: 'inline-radio', options: ['up', 'down', 'flat'] },
  },
} satisfies Meta<typeof Stat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Down: Story = { args: { trend: 'down' } };
export const Flat: Story = { args: { trend: 'flat', change: '0.0%' } };
export const Medium: Story = { args: { size: 'medium' } };
export const Small: Story = { args: { size: 'small' } };
export const NoComparison: Story = { args: { trend: undefined, change: undefined, period: undefined } };
