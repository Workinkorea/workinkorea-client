import { fetchClient, fetchAPI, FetchError } from '@/shared/api/fetchClient';
import {
  CompanyPost,
  CompanyPostsResponse,
  CreateCompanyPostRequest,
  CreateCompanyPostResponse,
  CompanyPostDetailResponse,
  UpdateCompanyPostRequest,
  UpdateCompanyPostResponse,
  DeleteCompanyPostResponse,
  ApplyToJobRequest,
  ApplyToJobResponse,
} from '@/shared/types/api';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

/** 백엔드가 { company_posts } 또는 { data: { company_posts } } 로 래핑할 경우 모두 대응 */
interface RawCompanyPostsApiResponse {
  company_posts?: CompanyPostsResponse['company_posts'];
  pagination?: {
    count?: number;
    skip?: number;
    limit?: number;
  };
  data?: {
    company_posts?: CompanyPostsResponse['company_posts'];
    pagination?: {
      count?: number;
      skip?: number;
      limit?: number;
    };
  };
}

/**
 * 서버 컴포넌트에서 사용하는 공고 목록 조회 함수
 *
 * Next.js 16 최적화:
 * - fetch API 사용 (Next.js 캐싱 통합)
 * - revalidate 옵션으로 ISR 가능
 * - Server Components 전용
 *
 * TODO: 서버에 공개 목록 엔드포인트 추가 필요
 * - GET /api/posts/company/list?skip=&limit= 엔드포인트 서버에 없음
 * - 서버의 GET /api/posts/company/는 company auth 필요 (공개 아님)
 */
/**
 * CompanyPost 의 required string 필드가 null/undefined 로 내려오면 서버 컴포넌트 렌더에서
 * `.split(',')`, `.toLowerCase()`, `new Date(null)` 파생값 등에서 예외가 발생한다.
 * 타입 경계에서 안전한 기본값을 채워넣어 렌더 실패를 차단한다.
 */
function normalizeCompanyPost(raw: Partial<CompanyPost> & { id: number }): CompanyPost {
  return {
    id: raw.id,
    company_id: raw.company_id ?? 0,
    title: raw.title ?? '',
    content: raw.content ?? '',
    work_experience: raw.work_experience ?? '',
    position_id: raw.position_id ?? 0,
    education: raw.education ?? '',
    language: raw.language ?? '',
    employment_type: raw.employment_type ?? '',
    work_location: raw.work_location ?? '',
    working_hours: raw.working_hours ?? 0,
    salary: raw.salary ?? 0,
    start_date: raw.start_date ?? '',
    end_date: raw.end_date ?? '',
  };
}

export async function getCompanyPosts(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<CompanyPostsResponse> {
  const skip = (page - 1) * limit;
  const endpoint = `/api/posts/company/list?skip=${skip}&limit=${limit}`;

  try {
    const rawData = await fetchAPI<RawCompanyPostsApiResponse>(endpoint, {
      skipAuth: true,
      // Next.js 16 캐싱: 1시간마다 재검증 (ISR)
      next: {
        revalidate: 3600,
        tags: ['jobs', `jobs-page-${page}`],
      },
    });

    // 래핑된 응답({ data: { company_posts } })과 일반 응답({ company_posts }) 모두 처리
    const inner = rawData.data ?? rawData;
    const rawPosts: unknown[] = Array.isArray(inner.company_posts) ? inner.company_posts : [];
    // id 가 없는 row 는 key/라우팅에 쓸 수 없으므로 제외 + 나머지 필드는 안전한 기본값으로 정규화
    const posts = rawPosts
      .filter((p): p is Partial<CompanyPost> & { id: number } =>
        !!p && typeof p === 'object' && typeof (p as { id?: unknown }).id === 'number'
      )
      .map(normalizeCompanyPost);
    const pagination = inner.pagination;

    // Pagination 계산
    const currentCount = pagination?.count ?? posts.length;
    const isLastPage = currentCount < limit;
    const estimatedTotal = isLastPage ? skip + currentCount : skip + currentCount + 1;

    return {
      company_posts: posts,
      total: estimatedTotal,
      page,
      limit,
      total_pages: isLastPage ? page : page + 1,
    };
  } catch (err) {
    // SSR 실패는 모두 "빈 결과" 로 치환한다. 클라이언트의 useCompanyPosts 훅이
    // 빈 initialData 를 감지하면 rewrite 경로(/api/*)로 다시 호출하므로, SSR
    // 경로(SERVER_API_URL 직통)가 실패해도 UX 가 자연스럽게 복구된다.
    // error.tsx 대신 empty state 가 먼저 보이고, 클라이언트 재시도 결과가 덮어씀.
    console.error('[getCompanyPosts] SSR fetch failed, falling back to empty:', err);
    return { company_posts: [], total: 0, page: 1, limit, total_pages: 0 };
  }
}

export const postsApi = {
  /**
   * 공개 API: 인증 없이 공고 목록 조회
   * Client Components에서 사용 (TanStack Query와 함께)
   *
   * TODO: 서버에 공개 목록 엔드포인트 추가 필요
   * - 현재 서버에는 GET /api/posts/company/ (company auth 필요)만 존재
   * - 공개 목록 엔드포인트 예: GET /api/posts/company/list?skip=&limit=
   */
  async getPublicCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    const page = params?.page || DEFAULT_PAGE;
    const limit = params?.limit || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const endpoint = `/api/posts/company/list?skip=${skip}&limit=${limit}`;

    const rawData = await fetchClient.get<RawCompanyPostsApiResponse>(endpoint, {
      skipAuth: true,
    });

    // 래핑된 응답({ data: { company_posts } })과 일반 응답({ company_posts }) 모두 처리
    const inner = rawData.data ?? rawData;
    const rawPosts: unknown[] = Array.isArray(inner.company_posts) ? inner.company_posts : [];
    const posts = rawPosts
      .filter((p): p is Partial<CompanyPost> & { id: number } =>
        !!p && typeof p === 'object' && typeof (p as { id?: unknown }).id === 'number'
      )
      .map(normalizeCompanyPost);
    const pagination = inner.pagination;

    // Pagination 계산
    const currentCount = pagination?.count ?? posts.length;
    const isLastPage = currentCount < limit;
    const estimatedTotal = isLastPage ? skip + currentCount : skip + currentCount + 1;

    return {
      company_posts: posts,
      total: estimatedTotal,
      page,
      limit,
      total_pages: isLastPage ? page : page + 1,
    };
  },

  /**
   * 인증 필요: 내 회사의 공고 목록만 조회 (기업 전용)
   * 서버: GET /api/posts/company/ (company auth 필요, 페이지네이션 미지원)
   */
  async getMyCompanyPosts(): Promise<CompanyPostsResponse> {
    const data = await fetchClient.get<{ company_posts: CompanyPostsResponse['company_posts'] }>('/api/posts/company');

    const posts = data.company_posts || [];
    return {
      company_posts: posts,
      total: posts.length,
      page: 1,
      limit: posts.length,
      total_pages: 1,
    };
  },

  /**
   * @deprecated getPublicCompanyPosts 사용 권장
   */
  async getCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    return this.getPublicCompanyPosts(params);
  },

  /**
   * 공고 상세 조회 (공개)
   */
  async getCompanyPostById(companyPostId: number): Promise<CompanyPostDetailResponse> {
    return fetchClient.get<CompanyPostDetailResponse>(
      `/api/posts/company/${companyPostId}`,
      { skipAuth: true }
    );
  },

  /**
   * 공고 생성 (기업 전용, 인증 필요)
   */
  async createCompanyPost(
    data: CreateCompanyPostRequest
  ): Promise<CreateCompanyPostResponse> {
    return fetchClient.post<CreateCompanyPostResponse>(
      '/api/posts/company',
      data
    );
  },

  /**
   * 공고 수정 (기업 전용, 인증 필요)
   */
  async updateCompanyPost(
    companyPostId: number,
    data: UpdateCompanyPostRequest
  ): Promise<UpdateCompanyPostResponse> {
    return fetchClient.put<UpdateCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`,
      data
    );
  },

  /**
   * 공고 삭제 (기업 전용, 인증 필요)
   */
  async deleteCompanyPost(companyPostId: number): Promise<DeleteCompanyPostResponse> {
    return fetchClient.delete<DeleteCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`
    );
  },

  /**
   * 채용 공고에 지원하기 (일반 사용자, 인증 필요)
   * @param data - 지원 정보 (company_post_id, resume_id, cover_letter)
   *
   * 서버 404 시 "기능 준비 중" 메시지로 치환해 사용자에게 명확히 안내한다.
   */
  async applyToJob(data: ApplyToJobRequest): Promise<ApplyToJobResponse> {
    try {
      return await fetchClient.post<ApplyToJobResponse>('/api/applications', data);
    } catch (err) {
      if (err instanceof FetchError && err.status === 404) {
        throw new FetchError('지원 기능은 현재 준비 중입니다. 잠시 후 다시 시도해주세요.', 404);
      }
      throw err;
    }
  },

  /**
   * 내 지원 목록 조회
   */
  async getMyApplications(): Promise<{ applications: Array<{ id: number; post_id: number; resume_id: number; status: string; applied_at: string }> }> {
    return fetchClient.get('/api/applications/me');
  },
};
