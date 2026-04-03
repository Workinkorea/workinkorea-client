/**
 * 공통 API 응답 타입
 *
 * FastAPI 백엔드와 Next.js Route Handler 모두에서 사용하는 공통 타입.
 * 도메인별 상세 타입은 src/shared/types/api.ts 참조.
 */

// ---------------------------------------------------------------------------
// 공통 래퍼 타입
// ---------------------------------------------------------------------------

/**
 * 단일 리소스 응답 래퍼.
 * FastAPI가 명시적인 래퍼 없이 객체를 직접 반환하는 경우가 많으므로,
 * 실제 사용 시 T 자체를 반환하는 경우가 더 많습니다.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * 페이지네이션 응답 래퍼.
 * FastAPI 백엔드의 페이지네이션 형식을 따릅니다.
 *
 * @example
 * const response = await fetchClient.get<PaginatedResponse<CompanyPost>>(
 *   '/api/posts/company/list?skip=0&limit=12'
 * );
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  count: number;
}

/**
 * 프로젝트 내 실제 사용 형태 (company_posts 패턴).
 * FastAPI 서버가 리소스명 키로 배열을 반환합니다.
 */
export interface ListResponse<TKey extends string, TItem> {
  [key: string]: TItem[] | number | undefined;
  total?: number;
  skip?: number;
  limit?: number;
  count?: number;
}

// ---------------------------------------------------------------------------
// 에러 타입
// ---------------------------------------------------------------------------

/**
 * FastAPI 기본 에러 응답 형식.
 * HTTPException: { "detail": "..." }
 * ValidationError: { "detail": [{ "loc": [...], "msg": "...", "type": "..." }] }
 */
export interface ApiError {
  detail: string | ValidationErrorDetail[];
  message?: string;
  error?: string;
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * FetchError 인스턴스에서 추출한 표준화 에러 정보.
 */
export interface NormalizedError {
  message: string;
  status: number;
  isAuth: boolean;      // 401/403
  isNotFound: boolean;  // 404
  isServer: boolean;    // 5xx
  isNetwork: boolean;   // status === 0
}

// ---------------------------------------------------------------------------
// 인증 관련 공통 타입
// ---------------------------------------------------------------------------

export type UserType = 'user' | 'company' | 'admin';

export type TokenType = 'access' | 'access_company' | 'admin_access';

export interface JwtPayload {
  sub: string;
  type: TokenType;
  exp: number;
  iat: number;
}

// ---------------------------------------------------------------------------
// Next.js Route Handler 유틸리티 타입
// ---------------------------------------------------------------------------

/**
 * GET /api/health 응답 타입.
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
}

/**
 * POST /api/revalidate 요청 바디 타입.
 */
export interface RevalidateRequest {
  tag: string;
  secret: string;
}

/**
 * POST /api/revalidate 응답 타입.
 */
export interface RevalidateResponse {
  revalidated: boolean;
  tag: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// 유틸리티 함수
// ---------------------------------------------------------------------------

/**
 * FetchError를 NormalizedError로 변환합니다.
 *
 * @example
 * try {
 *   const data = await fetchClient.get<T>('/api/endpoint');
 * } catch (error) {
 *   if (error instanceof FetchError) {
 *     const normalized = normalizeError(error);
 *     if (normalized.isAuth) router.push('/login');
 *   }
 * }
 */
export function normalizeError(error: { message: string; status: number }): NormalizedError {
  const status = error.status ?? 0;
  return {
    message: error.message,
    status,
    isAuth: status === 401 || status === 403,
    isNotFound: status === 404,
    isServer: status >= 500,
    isNetwork: status === 0,
  };
}

/**
 * FastAPI detail 에러 메시지를 사람이 읽을 수 있는 문자열로 변환합니다.
 */
export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;

    if (typeof e['message'] === 'string') return e['message'];
    if (typeof e['detail'] === 'string') return e['detail'];

    if (Array.isArray(e['detail'])) {
      const details = e['detail'] as ValidationErrorDetail[];
      return details.map(d => d.msg).join(', ');
    }
  }

  return '알 수 없는 오류가 발생했습니다.';
}
