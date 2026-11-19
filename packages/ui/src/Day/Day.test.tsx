import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Day } from './Day';

describe('Day (acceptance from spec northgate/day)', () => {
  it('is a button named by the full date, not the bare number', () => {
    render(<Day label="18 November 2026">18</Day>);
    const b = screen.getByRole('button', { name: '18 November 2026' });
    expect(b).toHaveTextContent('18');
  });
  it('reports a press, with the mouse and the keyboard', async () => {
    const onClick = vi.fn();
    render(<Day label="18 November 2026" onClick={onClick}>18</Day>);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
  it('says selected with aria-pressed, for a chosen day and for both ends of a range', () => {
    const { rerender } = render(<Day label="d" selected>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    rerender(<Day label="d" range="start">1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    rerender(<Day label="d" range="end">1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    rerender(<Day label="d" range="in">1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
  it('marks today with aria-current="date"', () => {
    render(<Day label="d" today>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'date');
  });
  it('derives one state: disabled wins, then range, selected, today, outside', () => {
    const { rerender } = render(<Day label="d" disabled selected today>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'disabled');
    rerender(<Day label="d" range="start" selected>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'range-start');
    rerender(<Day label="d" selected today>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'selected');
    rerender(<Day label="d" today outside>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'today');
    rerender(<Day label="d" outside>1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'outside');
    rerender(<Day label="d" range="in">1</Day>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'in-range');
  });
  it('ignores presses when disabled', async () => {
    const onClick = vi.fn();
    render(<Day label="d" disabled onClick={onClick}>1</Day>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
  it('has no axe violations in every state', async () => {
    const { container } = render(
      <div>
        <Day label="14 November 2026">14</Day><Day label="15 November 2026" today>15</Day><Day label="16 November 2026" outside>16</Day>
        <Day label="17 November 2026" disabled>17</Day><Day label="18 November 2026" selected>18</Day>
        <Day label="19 November 2026" range="start">19</Day><Day label="20 November 2026" range="in">20</Day><Day label="21 November 2026" range="end">21</Day>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
