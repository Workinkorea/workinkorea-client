export const API_BASE_URL = 'https://arw.byeong98.xyz';
export { API_BASE_URL as apiBaseUrl };

export interface ApiError {
  status: number;
  statusText: string;
  message: string;
  detail?: unknown;
}

export class ApiClient {
  private accessToken: string | null = null;
  private adminToken: string | null = null;

  /**
   * Access Token 설정 (일반 사용자/기업 인증)
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Admin Token 설정 (관리자 인증)
   */
  setAdminToken(token: string | null) {
    this.adminToken = token;
  }

  /**
   * 현재 Access Token 반환
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * 현재 Admin Token 반환
   */
  getAdminToken(): string | null {
    return this.adminToken;
  }

  /**
   * 공통 헤더 생성
   */
  private getHeaders(useAdminToken = false, isFormData = false): HeadersInit {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (useAdminToken && this.adminToken) {
      headers['Authorization'] = `Bearer ${this.adminToken}`;
    } else if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * GET 요청
   */
  async get<T>(
    path: string,
    options?: {
      useAdminToken?: boolean;
      queryParams?: Record<string, string | number | boolean>;
    }
  ): Promise<T> {
    let url = `${API_BASE_URL}${path}`;

    if (options?.queryParams) {
      const params = new URLSearchParams();
      Object.entries(options.queryParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options?.useAdminToken),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST 요청
   */
  async post<T>(
    path: string,
    body?: unknown,
    options?: { useAdminToken?: boolean; isFormData?: boolean }
  ): Promise<T> {
    const isFormData = options?.isFormData || false;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(options?.useAdminToken, isFormData),
      credentials: 'include',
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT 요청
   */
  async put<T>(
    path: string,
    body?: unknown,
    options?: { useAdminToken?: boolean }
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(options?.useAdminToken),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH 요청
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options?: { useAdminToken?: boolean }
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(options?.useAdminToken),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE 요청
   */
  async delete<T>(
    path: string,
    options?: { useAdminToken?: boolean }
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(options?.useAdminToken),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Response 핸들링 (에러 처리 포함)
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorDetail: unknown = null;
      try {
        errorDetail = await response.json();
      } catch {
        errorDetail = await response.text();
      }

      const error: ApiError = {
        status: response.status,
        statusText: response.statusText,
        message: `API Error: ${response.status} ${response.statusText}`,
        detail: errorDetail,
      };

      throw error;
    }

    // 204 No Content 처리
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text() as T;
  }

  /**
   * 인증 상태 초기화
   */
  clearTokens() {
    this.accessToken = null;
    this.adminToken = null;
  }
}

// Singleton 인스턴스
export const apiClient = new ApiClient();
