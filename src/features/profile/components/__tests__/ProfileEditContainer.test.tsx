import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/shared/test-utils/render-with-providers';

vi.mock('@/features/profile/api/profileApi', () => ({
  profileApi: {
    getProfile: vi.fn().mockResolvedValue({
      name: '홍길동',
      profile_image_url: null,
      location: '서울시 강남구',
      introduction: '안녕하세요',
      address: '서울특별시 강남구 역삼동',
      position_id: undefined,
      career: '3년',
      job_status: 'available',
      portfolio_url: null,
      country_id: 122,
      language_skills: [],
    }),
    getContact: vi.fn().mockResolvedValue({
      email: 'hong@example.com',
      phone_number: '010-1234-5678',
    }),
    getAccountConfig: vi.fn().mockResolvedValue({
      sns_message_notice: true,
      email_notice: true,
    }),
    updateProfile: vi.fn(),
    updateContact: vi.fn(),
    updateAccountConfig: vi.fn(),
  },
}));

// fetchClient is used directly inside the container for contact section fetch.
// Mock it to avoid real HTTP calls from happy-dom.
vi.mock('@/shared/api/fetchClient', () => ({
  fetchClient: {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
    put: vi.fn().mockResolvedValue({}),
    patch: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

// minio upload helper — not exercised in pre-fill render, but mocked for safety.
vi.mock('@/shared/api/minio', () => ({
  uploadFileToMinio: vi.fn().mockResolvedValue(''),
}));

import ProfileEditContainer from '@/features/profile/components/ProfileEditContainer';

describe('ProfileEditContainer pre-fill (P1 리그레션)', () => {
  it('profile API 응답이 BasicInfoSection 폼 필드에 채워진다', async () => {
    renderWithProviders(<ProfileEditContainer />);

    // name field → Input with value "홍길동"
    await waitFor(() => {
      expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
    });

    // location + address are also Inputs rendered in BasicInfoSection
    expect(screen.getByDisplayValue('서울시 강남구')).toBeInTheDocument();
    expect(screen.getByDisplayValue('서울특별시 강남구 역삼동')).toBeInTheDocument();

    // introduction is a textarea
    expect(screen.getByDisplayValue('안녕하세요')).toBeInTheDocument();
  });
});
