import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input (acceptance from spec northgate/input)', () => {
  it('label is connected to the field and focuses it', async () => {
    render(<Input label="Email" />);
    await userEvent.click(screen.getByText('Email'));
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('hint is read with the field', () => {
    render(<Input label="Email" hint="We use this for statements only" />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('We use this for statements only');
  });

  it('error replaces the hint, marks the field invalid and is read with the field', () => {
    render(<Input label="Email" hint="We use this for statements only" error="Enter a valid email address" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Enter a valid email address');
    expect(screen.queryByText('We use this for statements only')).toBeNull();
  });

  it('disabled is skipped by Tab and cannot be edited', async () => {
    render(<Input label="Email" disabled defaultValue="a" />);
    await userEvent.tab();
    expect(screen.getByLabelText('Email')).not.toHaveFocus();
  });

  it('read-only is reachable by Tab and cannot be edited', async () => {
    render(<Input label="Email" readOnly defaultValue="a" />);
    await userEvent.tab();
    const input = screen.getByLabelText('Email');
    expect(input).toHaveFocus();
    await userEvent.keyboard('b');
    expect(input).toHaveValue('a');
  });

  it('typing updates the value', async () => {
    render(<Input label="Email" />);
    await userEvent.type(screen.getByLabelText('Email'), 'x@y.z');
    expect(screen.getByLabelText('Email')).toHaveValue('x@y.z');
  });

  it('has no axe violations in default, error, disabled and read-only', async () => {
    const { container } = render(
      <div>
        <Input label="Default" hint="Hint" />
        <Input label="Error" error="Enter a valid email address" />
        <Input label="Disabled" disabled />
        <Input label="Read only" readOnly defaultValue="a" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
