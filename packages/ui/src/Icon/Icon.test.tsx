import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Icon } from './Icon';
import { ICONS } from './icons';

describe('Icon (acceptance from spec northgate/icon)', () => {
  it('has the whole Figma set (140 icons)', () => { expect(Object.keys(ICONS).length).toBe(140); });
  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('has a name when it means something', async () => {
    const { container } = render(<Icon name="circle-alert" label="Warning" />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
