import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('shadow-sm');
  });

  it('applies elevated variant styles', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('shadow-md');
  });

  it('applies outlined variant styles', () => {
    const { container } = render(<Card variant="outlined">Outlined</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-2');
  });

  it('applies ghost variant styles', () => {
    const { container } = render(<Card variant="ghost">Ghost</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-slate-50');
  });

  it('applies default md padding', () => {
    const { container } = render(<Card>Padded</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-6');
  });

  it('applies sm padding', () => {
    const { container } = render(<Card padding="sm">Small pad</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-4');
  });

  it('applies lg padding', () => {
    const { container } = render(<Card padding="lg">Large pad</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-8');
  });

  it('applies no padding', () => {
    const { container } = render(<Card padding="none">No pad</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('p-4');
    expect(card.className).not.toContain('p-6');
    expect(card.className).not.toContain('p-8');
  });

  it('applies hoverable styles', () => {
    const { container } = render(<Card hoverable>Hoverable</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:shadow-md');
  });

  it('applies clickable styles', () => {
    const { container } = render(<Card clickable>Clickable</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-custom">Custom</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('my-custom');
  });

  it('has rounded-xl', () => {
    const { container } = render(<Card>Rounded</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('rounded-xl');
  });
});

describe('Card sub-components', () => {
  it('CardHeader renders children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('CardTitle renders as h3', () => {
    render(<CardTitle>Title</CardTitle>);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Title');
  });

  it('CardDescription renders text', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('CardContent renders children', () => {
    render(<CardContent>Content area</CardContent>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  it('CardFooter renders children', () => {
    render(<CardFooter>Footer area</CardFooter>);
    expect(screen.getByText('Footer area')).toBeInTheDocument();
  });
});
