import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Radio, RadioGroup } from './Radio';

const Group = (p: Partial<React.ComponentProps<typeof RadioGroup>> = {}) => (
  <RadioGroup legend="Statement frequency" {...p}>
    <Radio value="monthly" label="Monthly" />
    <Radio value="quarterly" label="Quarterly" />
    <Radio value="never" label="Never" disabled />
  </RadioGroup>
);

describe('Radio (acceptance from spec northgate/radio)', () => {
  it('the group is named by its legend and holds the options', () => {
    render(<Group />);
    expect(screen.getByRole('radiogroup', { name: 'Statement frequency' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });
  it('clicking a label chooses the option and clears the others', async () => {
    render(<Group defaultValue="monthly" />);
    await userEvent.click(screen.getByText('Quarterly'));
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Monthly' })).not.toBeChecked();
  });
  it('Tab enters the group once, arrows move the choice and skip a disabled option', async () => {
    render(<Group defaultValue="monthly" />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Monthly' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked(); // Never is disabled, so it wraps
  });
  it('reports the chosen value', async () => {
    const fn = vi.fn();
    render(<Group onValueChange={fn} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Quarterly' }));
    expect(fn).toHaveBeenCalledWith('quarterly');
  });
  it('is controlled when value is given', async () => {
    const { rerender } = render(<Group value="monthly" />);
    await userEvent.click(screen.getByRole('radio', { name: 'Quarterly' }));
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    rerender(<Group value="quarterly" />);
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toBeChecked();
  });
  it('a disabled group cannot be changed or focused', async () => {
    render(<Group disabled defaultValue="monthly" />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Monthly' })).not.toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toBeDisabled();
  });
  it('an error marks the group invalid, is linked to it and replaces the hint', () => {
    render(<Group hint="Later in Settings" error="Choose one" />);
    const g = screen.getByRole('radiogroup');
    expect(g).toHaveAttribute('aria-invalid', 'true');
    expect(g).toHaveAccessibleDescription('Choose one');
    expect(screen.queryByText('Later in Settings')).not.toBeInTheDocument();
  });
  it('a hint is the description of the group', () => {
    render(<Group hint="Later in Settings" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Later in Settings');
  });
  it('a standalone radio works without a group', async () => {
    render(<Radio value="a" name="solo" label="Solo" />);
    await userEvent.click(screen.getByText('Solo'));
    expect(screen.getByRole('radio', { name: 'Solo' })).toBeChecked();
  });
  it('has no axe violations', async () => {
    const { container } = render(<Group hint="Later in Settings" defaultValue="monthly" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
