import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, ...props }: Record<string, unknown>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
  },
  useAnimation: () => ({
    start: vi.fn(),
  }),
}));

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts and displays a value', () => {
    render(<Input value="hello" onChange={() => {}} />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('converts null value to empty string', () => {
    render(<Input value={null as unknown as string} onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('applies error border class when error is true', () => {
    const { container } = render(<Input error />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-red-500');
  });

  it('applies success border class when success is true', () => {
    const { container } = render(<Input success />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-emerald-500');
  });

  it('renders password toggle button when variant is password', () => {
    const toggleFn = vi.fn();
    render(
      <Input variant="password" showPassword={false} onTogglePassword={toggleFn} />,
    );
    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn).toBeInTheDocument();
  });

  it('calls onTogglePassword when toggle button is clicked', async () => {
    const user = userEvent.setup();
    const toggleFn = vi.fn();
    render(
      <Input variant="password" showPassword={false} onTogglePassword={toggleFn} />,
    );
    await user.click(screen.getByRole('button'));
    expect(toggleFn).toHaveBeenCalledOnce();
  });

  it('sets input type to text when showPassword is true', () => {
    render(
      <Input variant="password" showPassword={true} onTogglePassword={vi.fn()} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('disables the input when disabled prop is set', () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText('disabled')).toBeDisabled();
  });

  it('renders rightElement when variant is default', () => {
    render(<Input rightElement={<span data-testid="right">R</span>} />);
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(Input.displayName).toBe('Input');
  });
});
