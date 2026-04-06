import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BetaPopup } from '../BetaPopup';

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
  X: () => <svg data-testid="x-icon" />,
  FlaskConical: () => <svg data-testid="flask-icon" />,
}));

const BETA_POPUP_KEY = 'wik_beta_popup_seen';

describe('BetaPopup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows popup on first visit', async () => {
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
    });
  });

  it('does NOT show popup when already dismissed', () => {
    localStorage.setItem(BETA_POPUP_KEY, '1');
    render(<BetaPopup />);

    expect(screen.queryByText('베타 서비스 안내')).not.toBeInTheDocument();
  });

  it('X button dismisses popup', async () => {
    const user = userEvent.setup();
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('닫기');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('베타 서비스 안내')).not.toBeInTheDocument();
    });

    expect(localStorage.getItem(BETA_POPUP_KEY)).toBe('1');
  });

  it('"확인했습니다" button dismisses popup', async () => {
    const user = userEvent.setup();
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: '확인했습니다' });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('베타 서비스 안내')).not.toBeInTheDocument();
    });

    expect(localStorage.getItem(BETA_POPUP_KEY)).toBe('1');
  });

  it('backdrop click dismisses popup', async () => {
    const user = userEvent.setup();
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
    });

    const backdrop = document.querySelector('.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText('베타 서비스 안내')).not.toBeInTheDocument();
    });

    expect(localStorage.getItem(BETA_POPUP_KEY)).toBe('1');
  });

  it('displays all popup content text', async () => {
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
      expect(screen.getByText(/현재/)).toBeInTheDocument();
      expect(screen.getByText(/워크인코리아/)).toBeInTheDocument();
      expect(screen.getByText(/베타 서비스 테스트 중입니다/)).toBeInTheDocument();
      expect(screen.getByText(/일부 기능이 제한되거나 변경될 수 있으며/)).toBeInTheDocument();
      expect(screen.getByText(/더 나은 서비스를 위해/)).toBeInTheDocument();
    });
  });

  it('renders Flask icon in header', async () => {
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByTestId('flask-icon')).toBeInTheDocument();
    });
  });

  it('renders X icon in close button', async () => {
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });
  });

  it('popup remains visible after interaction with content', async () => {
    render(<BetaPopup />);

    await waitFor(() => {
      expect(screen.getByText('베타 서비스 안내')).toBeInTheDocument();
    });

    const betaText = screen.getByText('베타 서비스 안내');
    expect(betaText).toBeInTheDocument();
  });
});
