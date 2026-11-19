import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileRow } from './FileRow';

/**
 * One file in an upload list: name and size, how far it got, and what the person can do with it (remove, retry).
 * Mirrors Figma `File row` (State). Put several in a list under the Dropzone.
 */
const meta = {
  title: 'Components/File row',
  component: FileRow,
  tags: ['autodocs'],
  args: { name: 'statements-sep-2026.csv', size: '1.4 MB', status: 'uploading', progress: 60, onRemove: fn() },
  argTypes: { status: { control: 'inline-radio', options: ['uploading', 'done', 'error'] } },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
} satisfies Meta<typeof FileRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Uploading: Story = {};
export const Done: Story = { args: { status: 'done' } };
export const Failed: Story = { args: { status: 'error', message: 'Upload failed. Check the connection and retry.', onRetry: fn() } };
export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FileRow name="statements-sep-2026.csv" size="1.4 MB" status="done" onRemove={() => {}} />
      <FileRow name="statements-oct-2026.csv" size="1.6 MB" status="uploading" progress={35} onRemove={() => {}} />
      <FileRow name="statements-nov-2026.csv" size="1.5 MB" status="error" message="Upload failed. Check the connection and retry." onRetry={() => {}} onRemove={() => {}} />
    </div>
  ),
};
