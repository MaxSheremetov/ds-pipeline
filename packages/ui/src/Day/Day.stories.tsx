import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Day } from './Day';

/**
 * One day in a calendar, the cell a date picker is made of: default, hover, selected, today, outside the month, disabled, and the three positions in a range.
 * The grid, the month and the keyboard moves belong to the calendar around it. Mirrors Figma `Day` (State).
 */
const meta = {
  title: 'Components/Day',
  component: Day,
  tags: ['autodocs'],
  args: { children: '18', label: '18 November 2026' },
} satisfies Meta<typeof Day>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Today: Story = { args: { today: true } };
export const Outside: Story = { args: { outside: true, children: '31', label: '31 October 2026' } };
export const Disabled: Story = { args: { disabled: true } };
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Day label="14 November 2026">14</Day>
      <Day label="15 November 2026" today>15</Day>
      <Day label="16 November 2026" outside>16</Day>
      <Day label="17 November 2026" disabled>17</Day>
      <Day label="18 November 2026" selected>18</Day>
      <Day label="19 November 2026" range="start">19</Day>
      <Day label="20 November 2026" range="in">20</Day>
      <Day label="21 November 2026" range="in">21</Day>
      <Day label="22 November 2026" range="end">22</Day>
    </div>
  ),
};
