import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Dropzone } from './Dropzone';

const file = (name = 'a.csv') => new File(['x'], name, { type: 'text/csv' });

describe('Dropzone (acceptance from spec northgate/dropzone)', () => {
  it('is a group named by its title and described by the hint', () => {
    render(<Dropzone title="Drop a statement here, or browse" hint="CSV, up to 10 MB" onFiles={() => {}} />);
    const g = screen.getByRole('group', { name: 'Drop a statement here, or browse' });
    expect(g).toHaveAccessibleDescription('CSV, up to 10 MB');
  });
  it('turns to the dragging state while a file is over it and back when it leaves', () => {
    render(<Dropzone title="T" onFiles={() => {}} />);
    const g = screen.getByRole('group');
    fireEvent.dragEnter(g, { dataTransfer: { types: ['Files'] } });
    expect(g).toHaveAttribute('data-state', 'dragging');
    fireEvent.dragLeave(g, { dataTransfer: { types: ['Files'] } });
    expect(g).toHaveAttribute('data-state', 'default');
  });
  it('ignores drags that carry no files', () => {
    render(<Dropzone title="T" onFiles={() => {}} />);
    const g = screen.getByRole('group');
    fireEvent.dragEnter(g, { dataTransfer: { types: ['text/plain'] } });
    expect(g).toHaveAttribute('data-state', 'default');
  });
  it('hands over dropped files and leaves the dragging state', () => {
    const onFiles = vi.fn();
    render(<Dropzone title="T" multiple onFiles={onFiles} />);
    const g = screen.getByRole('group');
    fireEvent.dragEnter(g, { dataTransfer: { types: ['Files'] } });
    fireEvent.drop(g, { dataTransfer: { types: ['Files'], files: [file('a.csv'), file('b.csv')] } });
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.csv', 'b.csv']);
    expect(g).toHaveAttribute('data-state', 'default');
  });
  it('takes only the first file when several are dropped and multiple is off', () => {
    const onFiles = vi.fn();
    render(<Dropzone title="T" onFiles={onFiles} />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { types: ['Files'], files: [file('a.csv'), file('b.csv')] } });
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
  });
  it('opens the file chooser from the button, which the keyboard reaches', async () => {
    render(<Dropzone title="T" onFiles={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click');
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Browse files' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(click).toHaveBeenCalled();
  });
  it('passes accept and multiple to the chooser and reports chosen files', async () => {
    const onFiles = vi.fn();
    render(<Dropzone title="T" accept=".csv" multiple onFiles={onFiles} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', '.csv');
    expect(input).toHaveAttribute('multiple');
    await userEvent.upload(input, file());
    expect(onFiles).toHaveBeenCalledTimes(1);
  });
  it('shows the error in place of the hint, in the error state, and announces it', () => {
    render(<Dropzone title="T" hint="CSV" error="Too large" onFiles={() => {}} />);
    expect(screen.getByRole('group')).toHaveAttribute('data-state', 'error');
    expect(screen.getByRole('alert')).toHaveTextContent('Too large');
    expect(screen.queryByText('CSV')).not.toBeInTheDocument();
  });
  it('keeps the hidden input out of the tab order and the accessibility tree', () => {
    render(<Dropzone title="T" onFiles={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(input).toHaveAttribute('aria-hidden', 'true');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Dropzone title="Drop a statement here" hint="CSV, up to 10 MB" onFiles={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
