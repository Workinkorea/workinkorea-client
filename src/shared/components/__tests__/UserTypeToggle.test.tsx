import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTypeToggle } from '../UserTypeToggle';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    ),
    span: ({ children, className }: any) => <span className={className}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  User: () => <svg data-testid="user-icon" />,
  Building2: () => <svg data-testid="building-icon" />,
  X: () => <svg />,
  FlaskConical: () => <svg />,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      personal: '개인',
      company: '기업',
    };
    return map[key] ?? key;
  },
}));

// Mock utils
vi.mock('@/shared/lib/utils/utils', () => ({
  cn: (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(' '),
}));

describe('UserTypeToggle', () => {
  it('renders both options', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    expect(screen.getByText('개인')).toBeInTheDocument();
    expect(screen.getByText('기업')).toBeInTheDocument();
  });

  it('active option is personal', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    const personalButton = screen.getByLabelText('개인 모드로 전환');
    const companyButton = screen.getByLabelText('기업 모드로 전환');

    expect(personalButton.className).toContain('text-white');
    expect(companyButton.className).toContain('text-slate-500');
  });

  it('active option is company', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="company" onChange={handleChange} />);

    const personalButton = screen.getByLabelText('개인 모드로 전환');
    const companyButton = screen.getByLabelText('기업 모드로 전환');

    expect(personalButton.className).toContain('text-slate-500');
    expect(companyButton.className).toContain('text-white');
  });

  it('clicking company calls onChange with company', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    const companyButton = screen.getByLabelText('기업 모드로 전환');
    await user.click(companyButton);

    expect(handleChange).toHaveBeenCalledWith('company');
  });

  it('clicking currently active option still calls onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    const personalButton = screen.getByLabelText('개인 모드로 전환');
    await user.click(personalButton);

    expect(handleChange).toHaveBeenCalledWith('personal');
  });

  it('custom className is applied to container', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <UserTypeToggle
        value="personal"
        onChange={handleChange}
        className="my-class"
      />
    );

    const toggleContainer = container.querySelector('[class*="border border-slate-200"]');
    expect(toggleContainer?.className).toContain('my-class');
  });

  it('renders user icon for personal option', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renders building icon for company option', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="company" onChange={handleChange} />);

    expect(screen.getByTestId('building-icon')).toBeInTheDocument();
  });

  it('both buttons have correct aria-label', () => {
    const handleChange = vi.fn();
    render(<UserTypeToggle value="personal" onChange={handleChange} />);

    expect(screen.getByLabelText('개인 모드로 전환')).toBeInTheDocument();
    expect(screen.getByLabelText('기업 모드로 전환')).toBeInTheDocument();
  });

  it('multiple clicks update button styles appropriately', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <UserTypeToggle value="personal" onChange={handleChange} />
    );

    let personalButton = screen.getByLabelText('개인 모드로 전환');
    expect(personalButton.className).toContain('text-white');

    // Simulate update to company
    rerender(
      <UserTypeToggle value="company" onChange={handleChange} />
    );

    const companyButton = screen.getByLabelText('기업 모드로 전환');
    expect(companyButton.className).toContain('text-white');

    personalButton = screen.getByLabelText('개인 모드로 전환');
    expect(personalButton.className).toContain('text-slate-500');
  });
});
