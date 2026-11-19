import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar, initialsOf } from './Avatar';

describe('Avatar (acceptance from spec northgate/avatar)', () => {
  it('takes initials from the first and last word, in capitals', () => {
    expect(initialsOf('ama mensah')).toBe('AM');
    expect(initialsOf('Ama Kofi Mensah')).toBe('AM');
    expect(initialsOf('Ama')).toBe('A');
    expect(initialsOf('  ')).toBe('');
  });
  it('is named by the person, and the initials are hidden from assistive technology', () => {
    render(<Avatar name="Ama Mensah" />);
    const a = screen.getByRole('img', { name: 'Ama Mensah' });
    expect(a.querySelector('[aria-hidden="true"]')).toHaveTextContent('AM');
  });
  it('shows a photo when there is one, with empty alt so the name is not read twice', () => {
    const { container } = render(<Avatar name="Ama Mensah" src="a.png" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'a.png');
    expect(img).toHaveAttribute('alt', '');
  });
  it('falls back to the person icon when the photo fails to load', () => {
    const { container } = render(<Avatar name="Ama Mensah" src="missing.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('carries the size as a data attribute', () => {
    render(<Avatar name="Ama Mensah" size="large" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-size', 'large');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Avatar name="Ama Mensah" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
