import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Dropzone } from './Dropzone';

/**
 * An area that takes dropped files, with a button for choosing them instead. It hands the files over and nothing more; their progress is the File row.
 * Mirrors Figma `Dropzone` (State): neutral, info while a file is dragged over, error after a failure.
 */
const meta = {
  title: 'Components/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  args: { title: 'Drop a statement here, or browse', hint: 'CSV or MT940, up to 10 MB', accept: '.csv,.sta', onFiles: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
} satisfies Meta<typeof Dropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dragging: Story = {
  play: async ({ canvasElement }) => {
    const zone = within(canvasElement).getByRole('group');
    const dt = new DataTransfer();
    dt.items.add(new File(['x'], 'statement.csv', { type: 'text/csv' }));
    // A native event: the instrumented fireEvent copies its arguments and would lose the DataTransfer.
    zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }));
    await waitFor(() => expect(zone).toHaveAttribute('data-state', 'dragging'));
  },
};
export const Failed: Story = { args: { error: 'That file is larger than 10 MB. Choose a smaller one.' } };
