import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Pagination } from './Pagination';

const labels = () => screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'));

describe('Pagination (acceptance from spec northgate/pagination)', () => {
  it('is a nav landmark with a name', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });
  it('shows the range and the real total', () => {
    render(<Pagination page={2} pageCount={26} total={1284} pageSize={50} onPageChange={() => {}} />);
    expect(screen.getByText(/51\u2013100 of 1\s284/)).toBeInTheDocument();
  });
  it('the last range stops at the total', () => {
    render(<Pagination page={26} pageCount={26} total={1284} pageSize={50} onPageChange={() => {}} />);
    expect(screen.getByText(/1\s251\u20131\s284 of 1\s284/)).toBeInTheDocument();
  });
  it('the current page carries aria-current="page" and choosing it does nothing', async () => {
    const fn = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={fn} />);
    const cur = screen.getByRole('button', { name: 'Page 3' });
    expect(cur).toHaveAttribute('aria-current', 'page');
    await userEvent.click(cur);
    expect(fn).not.toHaveBeenCalled();
  });
  it('Previous is disabled on the first page and Next on the last, never hidden', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    rerender(<Pagination page={5} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
  it('Previous, Next and a page number call onPageChange', async () => {
    const fn = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={fn} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(fn.mock.calls.map((c) => c[0])).toEqual([2, 4, 5]);
  });
  it('a long run collapses the middle but keeps the first and last page, and keeps its length', () => {
    const { rerender } = render(<Pagination page={1} pageCount={26} onPageChange={() => {}} />);
    expect(labels()).toEqual(['Previous page', 'Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 26', 'Next page']);
    rerender(<Pagination page={13} pageCount={26} onPageChange={() => {}} />);
    expect(labels()).toEqual(['Previous page', 'Page 1', 'Page 12', 'Page 13', 'Page 14', 'Page 26', 'Next page']);
    rerender(<Pagination page={26} pageCount={26} onPageChange={() => {}} />);
    expect(labels()).toEqual(['Previous page', 'Page 1', 'Page 22', 'Page 23', 'Page 24', 'Page 25', 'Page 26', 'Next page']);
  });
  it('a gap is not focusable and is hidden from assistive technology', () => {
    const { container } = render(<Pagination page={1} pageCount={26} onPageChange={() => {}} />);
    const gap = container.querySelector('.ds-page-gap')!;
    expect(gap.closest('li')).toHaveAttribute('aria-hidden', 'true');
    expect(gap.querySelector('button, a')).toBeNull();
  });
  it('has no axe violations', async () => {
    const { container } = render(<Pagination page={13} pageCount={26} total={1284} pageSize={50} onPageChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
