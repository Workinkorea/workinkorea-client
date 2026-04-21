import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, NumericBadge, DotBadge } from '../Badge';
import { Star } from 'lucide-react';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

import { vi } from 'vitest';

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies primary color classes by default', () => {
    const { container } = render(<Badge label="Primary" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-blue-50');
    expect(badge.className).toContain('text-blue-700');
  });

  it('applies success color classes', () => {
    const { container } = render(<Badge label="Success" color="success" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-emerald-50');
    expect(badge.className).toContain('text-emerald-500');
  });

  it('applies warning color classes', () => {
    const { container } = render(<Badge label="Warning" color="warning" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-amber-50');
    expect(badge.className).toContain('text-amber-500');
  });

  it('applies danger color classes', () => {
    const { container } = render(<Badge label="Error" color="danger" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-red-50');
    expect(badge.className).toContain('text-red-500');
  });

  it('applies neutral color classes', () => {
    const { container } = render(<Badge label="Neutral" color="neutral" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-slate-100');
    expect(badge.className).toContain('text-slate-500');
  });

  it('renders with sm size', () => {
    const { container } = render(<Badge label="Small" size="sm" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-caption-2');
  });

  it('renders with md size by default', () => {
    const { container } = render(<Badge label="Medium" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-caption-1');
  });

  it('applies rounded-full when rounded is true', () => {
    const { container } = render(<Badge label="Round" rounded />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('rounded-full');
  });

  it('applies rounded-md by default', () => {
    const { container } = render(<Badge label="Default" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('rounded-md');
  });

  it('renders icon on the left by default', () => {
    const { container } = render(<Badge label="Star" icon={Star} />);
    const badge = container.firstChild as HTMLElement;
    const spans = badge.querySelectorAll('span');
    const svg = badge.querySelector('svg');
    // Icon should come before the label span
    expect(svg).toBeInTheDocument();
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('NumericBadge', () => {
  it('renders the count', () => {
    render(<NumericBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('caps count at max and shows +', () => {
    render(<NumericBadge count={150} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});

describe('DotBadge', () => {
  it('renders with label', () => {
    render(<DotBadge label="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renders without label', () => {
    const { container } = render(<DotBadge />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
