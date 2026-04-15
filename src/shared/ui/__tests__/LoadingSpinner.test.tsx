import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

describe('LoadingSpinner', () => {
  it('renders with status role', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '로딩 중');
  });

  it('accepts custom label', () => {
    render(<LoadingSpinner label="Loading data" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading data');
  });

  it('renders sr-only text', () => {
    render(<LoadingSpinner label="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('w-4');
    expect(spinner.className).toContain('h-4');
  });

  it('applies md size classes by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('w-6');
    expect(spinner.className).toContain('h-6');
  });

  it('applies lg size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('w-9');
    expect(spinner.className).toContain('h-9');
  });

  it('applies blue color classes by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('border-primary-200');
    expect(spinner.className).toContain('border-t-primary-600');
  });

  it('applies white color classes', () => {
    const { container } = render(<LoadingSpinner color="white" />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('border-white/30');
    expect(spinner.className).toContain('border-t-white');
  });

  it('applies slate color classes', () => {
    const { container } = render(<LoadingSpinner color="slate" />);
    const spinner = container.querySelector('.animate-spin') as HTMLElement;
    expect(spinner.className).toContain('border-line-400');
    expect(spinner.className).toContain('border-t-label-500');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="mt-4" />);
    const status = screen.getByRole('status');
    expect(status.className).toContain('mt-4');
  });

  it('has animate-spin class on spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
