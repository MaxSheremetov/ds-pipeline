import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';

/**
 * What a list, table or page shows when there is nothing to show yet: what is missing, why, and the next step.
 * One component with no states; the illustration and the actions are slots. Mirrors Figma `Empty state`.
 */
const meta = {
  title: 'Components/Empty state',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No mandates yet',
    description: 'Mandates let you collect payments from a customer on a schedule. Create the first one, or import a file.',
    actions: (<><Button variant="primary" size="medium">New mandate</Button><Button variant="quiet" size="medium">Import a file</Button></>),
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutActions: Story = { args: { actions: undefined } };
export const OtherIcon: Story = { args: { icon: 'wallet', title: 'No transfers found', description: 'Change the dates or clear the filters to see more.', actions: undefined } };
