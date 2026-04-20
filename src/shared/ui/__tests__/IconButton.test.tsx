import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../IconButton';
import { X, Star } from 'lucide-react';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

describe('IconButton', () => {
  it('renders a button with aria-label', () => {
    render(<IconButton icon={X} label="Close" />);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    render(<IconButton icon={X} label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<IconButton icon={X} label="Close" onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<IconButton icon={X} label="Close" disabled onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<IconButton icon={X} label="Close" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading is true', () => {
    render(<IconButton icon={X} label="Close" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    const { container } = render(<IconButton icon={X} label="Close" loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies sm size class', () => {
    const { container } = render(<IconButton icon={X} label="Small" size="sm" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('w-7');
    expect(button.className).toContain('h-7');
  });

  it('applies md size class by default', () => {
    const { container } = render(<IconButton icon={X} label="Medium" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('w-9');
    expect(button.className).toContain('h-9');
  });

  it('applies lg size class', () => {
    const { container } = render(<IconButton icon={X} label="Large" size="lg" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('w-11');
    expect(button.className).toContain('h-11');
  });

  it('applies ghost variant by default', () => {
    const { container } = render(<IconButton icon={X} label="Ghost" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('text-slate-600');
    expect(button.className).toContain('hover:bg-slate-100');
  });

  it('applies filled variant', () => {
    const { container } = render(<IconButton icon={Star} label="Filled" variant="filled" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('bg-blue-600');
    expect(button.className).toContain('text-white');
  });

  it('applies circle shape', () => {
    const { container } = render(<IconButton icon={X} label="Circle" shape="circle" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('rounded-full');
  });

  it('applies square shape by default', () => {
    const { container } = render(<IconButton icon={X} label="Square" />);
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('rounded-lg');
  });

  it('has type="button"', () => {
    render(<IconButton icon={X} label="Close" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
