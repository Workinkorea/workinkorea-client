import { fetchClient, fetchAPI } from '@/shared/api/fetchClient';
import {
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
    const posts = inner.company_posts ?? [];
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
  } catch {
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
    const posts = inner.company_posts ?? [];
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
    const data = await fetchClient.get<{ company_posts: CompanyPostsResponse['company_posts'] }>('/api/posts/company/');

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
   * TODO: 백엔드에 POST /api/applications 엔드포인트 구현 필요.
   * 현재 해당 라우터가 존재하지 않아 404 에러 발생.
   */
  async applyToJob(_data: ApplyToJobRequest): Promise<ApplyToJobResponse> {
    throw new Error('지원 기능은 현재 준비 중입니다. 백엔드에 POST /api/applications 엔드포인트 구현이 필요합니다.');
  },
};
