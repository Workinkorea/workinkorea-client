import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

describe('Skeleton', () => {
  it('renders with skeleton-shimmer class', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('skeleton-shimmer');
  });

  it('applies rounded-lg for default rect variant', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-lg');
  });

  it('applies rounded-full for circle variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-full');
  });

  it('applies rounded for text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded');
    expect(el.className).not.toContain('rounded-lg');
    expect(el.className).not.toContain('rounded-full');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="w-full h-4" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('w-full');
    expect(el.className).toContain('h-4');
  });

  it('applies width and height via style', () => {
    const { container } = render(<Skeleton width={200} height={20} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('applies string width and height', () => {
    const { container } = render(<Skeleton width="100%" height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('2rem');
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges custom style prop', () => {
    const { container } = render(<Skeleton style={{ opacity: 0.5 }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
  });
});
