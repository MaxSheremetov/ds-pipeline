import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

/**
 * The steps of a task done in order, with the current one marked: done steps show a tick, the current one is filled, upcoming ones are outlined.
 * It shows where the person is; it is not navigation. Mirrors Figma `Stepper` (Step State and the connector).
 */
const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { label: 'Transfer progress', steps: ['Amount', 'Beneficiary', 'Review', 'Confirm'], current: 1 },
  decorators: [(Story) => <div style={{ maxWidth: 680 }}><Story /></div>],
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstStep: Story = { args: { current: 0 } };
export const LastStep: Story = { args: { current: 3 } };
export const AllDone: Story = { args: { current: 4 } };
