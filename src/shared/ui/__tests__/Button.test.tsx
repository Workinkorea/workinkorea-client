import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from '../Button';

// Mock the cn utility function
vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with default primary variant', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-blue-600');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-blue-50');
  });

  it('renders with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-white');
  });

  it('renders with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-transparent');
  });

  it('renders with destructive variant', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-red-500');
  });

  it('renders with default md size', () => {
    const { container } = render(<Button>Medium</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-5');
    expect(button?.className).toContain('py-2.5');
  });

  it('renders with sm size', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-3.5');
  });

  it('renders with lg size', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-7');
  });

  it('renders with xl size', () => {
    const { container } = render(<Button size="xl">Extra Large</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-9');
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Loading...</Button>);
    const spinner = container.querySelector('span.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays children text alongside spinner when loading', () => {
    render(<Button isLoading>Loading...</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables button when isLoading is true', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = container.querySelector('button') as HTMLButtonElement;
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('works with forwardRef', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Forward Ref</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('has correct displayName', () => {
    expect(Button.displayName).toBe('Button');
  });

  it('supports custom className', () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('applies focus ring styles', () => {
    const { container } = render(<Button>Focus Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('focus:outline-none');
    expect(button?.className).toContain('focus:ring-2');
    expect(button?.className).toContain('focus:ring-blue-500');
  });

  it('applies disabled state styles', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('disabled:opacity-50');
    expect(button?.className).toContain('disabled:cursor-not-allowed');
  });

  it('supports passing button attributes', () => {
    const { container } = render(
      <Button title="Test Title" data-testid="custom-button">
        Test
      </Button>
    );
    const button = container.querySelector('[data-testid="custom-button"]');
    expect(button).toBeInTheDocument();
    expect(button?.getAttribute('title')).toBe('Test Title');
  });

  it('renders as button element', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button');
    expect(button?.tagName).toBe('BUTTON');
  });

  it('applies gap-2 flex alignment classes', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('inline-flex');
    expect(button?.className).toContain('items-center');
    expect(button?.className).toContain('justify-center');
    expect(button?.className).toContain('gap-2');
  });

  it('has rounded-lg border radius', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('rounded-lg');
  });

  it('has semibold font weight', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('font-semibold');
  });

  it('has transition and cursor styles', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('transition-colors');
    expect(button?.className).toContain('duration-150');
    expect(button?.className).toContain('cursor-pointer');
  });

  it('combines multiple variants and sizes correctly', () => {
    const { container } = render(
      <Button variant="secondary" size="lg">
        Combined
      </Button>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-blue-50');
    expect(button?.className).toContain('px-7');
  });

  it('does not call onClick when isLoading is true', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
