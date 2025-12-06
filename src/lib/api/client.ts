import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { tokenManager } from "../utils/tokenManager";
import { ApiErrorResponse } from "./types";

export interface ApiRequestOptions extends AxiosRequestConfig {
  // 커스텀 플래그: 이 옵션이 true면 Authorization 토큰을 붙이지 않음
  skipAuth?: boolean;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type TokenType = "user" | "company";

let isRefreshing = false;
let refreshQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  refreshQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  refreshQueue = [];
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 3000,
});

// Select valid token automatically
function getValidToken(): { token: string | null; type: TokenType | null } {
  const userToken = tokenManager.getToken("user");
  const companyToken = tokenManager.getToken("company");

  if (userToken && tokenManager.isTokenValid("user"))
    return { token: userToken, type: "user" };
  if (companyToken && tokenManager.isTokenValid("company"))
    return { token: companyToken, type: "company" };

  return { token: null, type: null };
}

// Automatically attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (config.skipAuth) return config;

    const { token } = getValidToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Refresh token
async function refreshToken(): Promise<{ token: string; type: TokenType }> {
  const { type } = getValidToken();

  if (!type) throw new Error("No valid token type for refresh");

  const endpoint =
    type === "company" ? "/api/auth/company/refresh" : "/api/auth/refresh";

  try {
    const response = await api.post(
      endpoint,
      {},
      { skipAuth: true, withCredentials: true } as ApiRequestOptions
    );

    const newToken =
      response.data.accessToken ||
      response.data.access_token ||
      response.data.token;

    if (!newToken) throw new Error("Missing token during refresh");

    const rememberMe = tokenManager.isTokenInLocalStorage(type);
    tokenManager.setToken(newToken, type, rememberMe);

    return { token: newToken, type };
  } catch (err) {
    const { type } = getValidToken();
    if (type) tokenManager.removeToken(type);

    if (typeof window !== "undefined") {
      window.location.href =
        type === "company" ? "/company-login" : "/login";
    }
    throw err;
  }
}

// Intercept 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as any;

    // If refresh endpoint failed → forced logout
    if (
      originalConfig?.url?.includes("/auth/refresh") ||
      originalConfig?.url?.includes("/auth/company/refresh")
    ) {
      const { type } = getValidToken();
      if (type) tokenManager.removeToken(type);

      if (typeof window !== "undefined") {
        window.location.href =
          type === "company" ? "/company-login" : "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { token } = await refreshToken();
        processQueue(null, token);
        isRefreshing = false;

        originalConfig.headers.Authorization = `Bearer ${token}`;
        return api(originalConfig);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get<T>(endpoint: string, options?: ApiRequestOptions) {
    return api.get<T>(endpoint, options).then((res) => res.data);
  },
  post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return api.post<T>(endpoint, data, options).then((res) => res.data);
  },
  put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return api.put<T>(endpoint, data, options).then((res) => res.data);
  },
  delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return api.delete<T>(endpoint, options).then((res) => res.data);
  },
};