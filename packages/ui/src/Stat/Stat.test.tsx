import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Stat } from './Stat';

describe('Stat (acceptance from spec northgate/stat)', () => {
  it('pairs the label with the figure', () => {
    render(<Stat label="Collected this week" value="184 920" />);
    expect(screen.getByText('Collected this week').tagName).toBe('DT');
    expect(screen.getByText('184 920').tagName).toBe('DD');
  });
  it('says the direction in words as well as colour and icon', () => {
    const { rerender } = render(<Stat label="L" value="1" trend="up" change="12.4%" period="vs last week" />);
    expect(screen.getByText('12.4%').parentElement).toHaveTextContent('Up 12.4%vs last week');
    rerender(<Stat label="L" value="1" trend="down" change="3%" />);
    expect(screen.getByText('3%').parentElement).toHaveTextContent('Down 3%');
    rerender(<Stat label="L" value="1" trend="flat" change="0%" />);
    expect(screen.getByText('0%').parentElement).toHaveTextContent('Unchanged 0%');
  });
  it('shows no change row without a trend and a change', () => {
    const { container, rerender } = render(<Stat label="L" value="1" />);
    expect(container.querySelector('.ds-stat__delta')).toBeNull();
    rerender(<Stat label="L" value="1" trend="up" />);
    expect(container.querySelector('.ds-stat__delta')).toBeNull();
  });
  it('carries size and trend as data attributes', () => {
    const { container } = render(<Stat label="L" value="1" size="small" trend="down" change="1%" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
    expect(container.firstElementChild).toHaveAttribute('data-trend', 'down');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Stat label="Collected this week" value="184 920" trend="up" change="12.4%" period="vs last week" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
