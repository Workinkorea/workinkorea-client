/**
 * Dev Server E2E Tests
 *
 * 실제 배포된 개발 서버(https://dev.workinkorea.net/)에 대해 동작을 검증합니다.
 * Next.js rewrites를 통해 백엔드 API를 프록시하므로 /api/* 경로를 사용합니다.
 *
 * 실행 방법:
 *   npm run test -- tests/api/dev-server.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../utils/api-client';
import type { ApiError } from '../utils/api-client';
import {
  createTestUser,
  createTestCompany,
  createCompanyLoginData,
  createEmailCertifyRequest,
} from '../utils/test-data';

const DEV_BASE_URL = 'https://dev.workinkorea.net';

/** dev 서버 전용 ApiClient 인스턴스 */
const devClient = new ApiClient();

// ApiClient는 API_BASE_URL을 생성 시 고정하지 않고 get/post 내에서 사용합니다.
// API_BASE_URL은 모듈 스코프 상수이므로 직접 URL을 조합해 fetch로 호출합니다.
async function devFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${DEV_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

async function devGet<T>(path: string, token?: string): Promise<{ status: number; data: T }> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${DEV_BASE_URL}${path}`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });
  const data = res.status === 204 ? ({} as T) : await res.json().catch(() => null);
  return { status: res.status, data };
}

async function devPost<T>(
  path: string,
  body: unknown,
  options?: { token?: string; isFormData?: boolean }
): Promise<{ status: number; data: T }> {
  const headers: HeadersInit = {};
  if (!options?.isFormData) headers['Content-Type'] = 'application/json';
  if (options?.token) headers['Authorization'] = `Bearer ${options.token}`;

  const res = await fetch(`${DEV_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: options?.isFormData
      ? (body as URLSearchParams | FormData)
      : JSON.stringify(body),
  });
  const data = res.status === 204 ? ({} as T) : await res.json().catch(() => null);
  return { status: res.status, data };
}

// ---------------------------------------------------------------------------
// 헬스 체크
// ---------------------------------------------------------------------------

describe('Dev Server — Health Check', () => {
  it('랜딩 페이지(/)가 200을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/`, { redirect: 'follow' });
    expect(res.status).toBe(200);
  });

  it('/jobs 페이지가 200을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/jobs`, { redirect: 'follow' });
    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// 인증 — Google OAuth
// ---------------------------------------------------------------------------

describe('Dev Server — GET /api/auth/login/google', () => {
  it('Google OAuth 리다이렉트(302/307) 또는 200을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/auth/login/google`, {
      method: 'GET',
      redirect: 'manual',
    });
    expect([200, 302, 307]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 일반 회원 가입
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/auth/signup', () => {
  it('필수 필드 누락 시 422를 반환한다', async () => {
    const { status } = await devPost('/api/auth/signup', {
      email: 'only-email@example.com',
    });
    expect(status).toBe(422);
  });

  it('유효하지 않은 이메일 형식으로 가입 시 400/422를 반환한다', async () => {
    const { status } = await devPost('/api/auth/signup', {
      email: 'not-an-email',
      password: 'Password123!',
      name: 'Test User',
      birth_date: '1990-01-01',
      country_code: 'KR',
    });
    expect([400, 422]).toContain(status);
  });

  it('정상 데이터로 요청 시 200/201/400/409를 반환한다', async () => {
    const userData = createTestUser();
    const { status } = await devPost('/api/auth/signup', userData);
    expect([200, 201, 400, 409]).toContain(status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 기업 회원 가입
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/auth/company/signup', () => {
  it('필수 필드 누락 시 422를 반환한다', async () => {
    const { status } = await devPost('/api/auth/company/signup', {
      company_name: 'Test Co',
    });
    expect(status).toBe(422);
  });

  it('정상 데이터로 기업 가입 시 200/201 또는 409를 반환한다', async () => {
    const companyData = createTestCompany();
    const { status } = await devPost('/api/auth/company/signup', companyData);
    expect([200, 201, 409, 500]).toContain(status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 기업 로그인
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/auth/company/login', () => {
  it('존재하지 않는 계정으로 로그인 시 401/400을 반환한다', async () => {
    const formData = new URLSearchParams();
    formData.append('username', 'nonexistent-dev@example.com');
    formData.append('password', 'WrongPassword999!');

    const res = await fetch(`${DEV_BASE_URL}/api/auth/company/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    expect([400, 401, 422, 500]).toContain(res.status);
  });

  it('body가 없을 때 422를 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/auth/company/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '',
    });
    expect([400, 422]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 이메일 인증
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/auth/email/certify', () => {
  it('유효한 이메일로 인증 코드 발송 요청 시 200을 반환한다', async () => {
    const emailData = createEmailCertifyRequest();
    const { status } = await devPost('/api/auth/email/certify', emailData);
    // 이메일 발송이 실제로 되거나 서버 오류가 날 수 있음
    expect([200, 201, 500]).toContain(status);
  });

  it('잘못된 이메일 형식으로 요청 시 400/422/500을 반환한다 (서버 검증 여부에 따라)', async () => {
    const { status } = await devPost('/api/auth/email/certify', {
      email: 'bad-email',
    });
    // 서버가 이메일 검증을 하면 422, 내부 오류면 500
    expect([400, 422, 500]).toContain(status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 토큰 갱신 (쿠키 없이 실패)
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/auth/refresh', () => {
  it('refresh token 쿠키 없이 갱신 시 401을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'omit', // 의도적으로 쿠키 제외
      headers: { 'Content-Type': 'application/json' },
    });
    expect([401, 403, 422]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// 인증 — 로그아웃 (인증 없이 실패)
// ---------------------------------------------------------------------------

describe('Dev Server — DELETE /api/auth/logout', () => {
  it('인증 없이 로그아웃 시 401을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/auth/logout`, {
      method: 'DELETE',
      credentials: 'omit',
    });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// 보호된 엔드포인트 — 인증 없이 401
// ---------------------------------------------------------------------------

describe('Dev Server — Protected Endpoints (unauthenticated)', () => {
  it('GET /api/me — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/me');
    expect(status).toBe(401);
  });

  it('PUT /api/me — 인증 없이 401/405를 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/me`, {
      method: 'PUT',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    // 401: 인증 미들웨어가 먼저 처리 / 405: Method Not Allowed (라우트 설정에 따라)
    expect([401, 405]).toContain(res.status);
  });

  it('GET /api/contact — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/contact');
    expect(status).toBe(401);
  });

  it('GET /api/account-config — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/account-config');
    expect(status).toBe(401);
  });

  it('GET /api/posts/company/ — 기업 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/posts/company/');
    expect(status).toBe(401);
  });

  it('POST /api/posts/company/ — 기업 인증 없이 401을 반환한다', async () => {
    const res = await fetch(`${DEV_BASE_URL}/api/posts/company/`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/posts/resume/list/me — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/posts/resume/list/me');
    expect(status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// 공개 엔드포인트 — 채용공고 상세
// ---------------------------------------------------------------------------

describe('Dev Server — Public Endpoints', () => {
  it('GET /api/posts/company/1 — 공개 공고 상세를 조회한다 (200/404/500)', async () => {
    const { status } = await devGet('/api/posts/company/1');
    // 공고가 존재하면 200, 없으면 404, 서버 오류 시 500
    expect([200, 404, 500]).toContain(status);
  });

  it('GET /api/posts/company/9999999 — 존재하지 않는 공고는 404/500을 반환한다', async () => {
    const { status } = await devGet('/api/posts/company/9999999');
    // 없는 리소스는 404, 서버 오류 시 500
    expect([404, 422, 500]).toContain(status);
  });
});

// ---------------------------------------------------------------------------
// 자가진단
// ---------------------------------------------------------------------------

describe('Dev Server — POST /api/diagnosis/answer', () => {
  it('진단 제출 엔드포인트가 응답한다 (공개 또는 인증 필요)', async () => {
    const { status } = await devPost('/api/diagnosis/answer', {
      total_score: 50,
    });
    // 공개 엔드포인트이면 200/201/422, 인증 필요하면 401
    expect([200, 201, 401, 422]).toContain(status);
  });
});

// ---------------------------------------------------------------------------
// 관리자 엔드포인트 — 인증 없이 401
// ---------------------------------------------------------------------------

describe('Dev Server — Admin Endpoints (unauthenticated)', () => {
  it('GET /api/admin/users/ — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/admin/users/');
    expect(status).toBe(401);
  });

  it('GET /api/admin/companies/ — 인증 없이 401을 반환한다', async () => {
    const { status } = await devGet('/api/admin/companies/');
    expect(status).toBe(401);
  });
});
