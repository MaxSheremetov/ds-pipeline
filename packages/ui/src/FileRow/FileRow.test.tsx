import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { FileRow } from './FileRow';

describe('FileRow (acceptance from spec northgate/file-row)', () => {
  it('is a group named by the file and shows its size', () => {
    render(<FileRow name="a.csv" size="1.4 MB" status="done" />);
    expect(screen.getByRole('group', { name: 'a.csv' })).toBeInTheDocument();
    expect(screen.getByText('1.4 MB')).toBeInTheDocument();
  });
  it('shows a named progress bar only while uploading', () => {
    const { rerender } = render(<FileRow name="a.csv" status="uploading" progress={40} />);
    expect(screen.getByRole('progressbar', { name: 'Uploading a.csv' })).toHaveAttribute('aria-valuenow', '40');
    rerender(<FileRow name="a.csv" status="done" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  it('says done in words through the status icon', () => {
    render(<FileRow name="a.csv" status="done" />);
    expect(screen.getByRole('img', { name: 'Uploaded' })).toBeInTheDocument();
  });
  it('shows the error message, announced, with a failed icon', () => {
    render(<FileRow name="a.csv" status="error" message="Upload failed. Retry." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed. Retry.');
    expect(screen.getByRole('img', { name: 'Failed' })).toBeInTheDocument();
  });
  it('names the remove and retry buttons after the file', async () => {
    const onRemove = vi.fn(); const onRetry = vi.fn();
    render(<FileRow name="a.csv" status="error" message="Failed" onRemove={onRemove} onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Retry a.csv' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.csv' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
  it('offers retry only after a failure and remove only when asked', () => {
    render(<FileRow name="a.csv" status="done" onRetry={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('lets the user translate the button words', () => {
    render(<FileRow name="a.csv" status="done" onRemove={() => {}} removeLabel="Entfernen" />);
    expect(screen.getByRole('button', { name: 'Entfernen a.csv' })).toBeInTheDocument();
  });
  it('has no axe violations in every status', async () => {
    const { container } = render(
      <div>
        <FileRow name="a.csv" size="1 MB" status="uploading" progress={30} onRemove={() => {}} />
        <FileRow name="b.csv" size="1 MB" status="done" onRemove={() => {}} />
        <FileRow name="c.csv" size="1 MB" status="error" message="Failed" onRetry={() => {}} onRemove={() => {}} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
