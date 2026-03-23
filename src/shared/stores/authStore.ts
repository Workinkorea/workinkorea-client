import { create } from 'zustand';
import { cookieManager, UserType } from '@/shared/lib/utils/cookieManager';
import { tokenStore, decodeUserType } from '@/shared/api/tokenStore';

// 로컬 개발 테스트용 인증 우회
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
const BYPASS_AUTH_TYPE = (process.env.NEXT_PUBLIC_BYPASS_AUTH_TYPE ?? 'user') as UserType;

interface AuthState {
  // State
  isAuthenticated: boolean;
  userType: UserType | null;
  isInitialized: boolean; // 초기화 완료 여부

  // Actions
  login: (userType: UserType) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuthenticated: false,
  userType: null,
  isInitialized: false,

  /**
   * 로그인 성공 시 호출
   * @param userType - 'user' | 'company' | 'admin'
   *
   * 백엔드가 userType 쿠키를 설정하지만,
   * 클라이언트에서도 명시적으로 설정하여 동기화 보장
   */
  login: (userType: UserType) => {
    set({
      isAuthenticated: true,
      userType,
      isInitialized: true,
    });

    // non-HttpOnly 쿠키를 별도 설정 — initialize() 폴백에서 document.cookie로 읽기 위해 필요
    // 백엔드가 설정한 쿠키는 HttpOnly이므로 JS에서 읽을 수 없음
    // (브라우저 DevTools에 2개로 표시되나 값은 동일하며 각각 역할이 다름)
    cookieManager.setUserType(userType);
  },

  /**
   * 로그아웃 (비동기 처리 포함)
   */
  logout: async () => {
    if (typeof window === 'undefined') return;

    // 1. userType 먼저 읽기 (쿠키 삭제 전)
    const currentUserType = cookieManager.getUserType();

    // 2. State 즉시 업데이트 (UI 반영) + 토큰 삭제
    tokenStore.clear();
    set({
      isAuthenticated: false,
      userType: null,
    });

    try {
      // 3. 백엔드에 로그아웃 요청
      const { fetchClient } = await import('@/shared/api/fetchClient');
      await fetchClient.delete('/api/auth/logout');
    } catch (err) {
      console.error('[AuthStore] Logout API failed:', err);
    } finally {
      // 성공/실패 무관하게 클라이언트 쿠키 항상 정리
      // (백엔드가 삭제 안 하거나 domain 불일치 대비)
      cookieManager.clearAuth();
    }

    // 4. 로그인 페이지로 리다이렉트
    const loginPath =
      currentUserType === 'company' ? '/company-login' :
        currentUserType === 'admin' ? '/admin/login' :
          '/login';

    window.location.href = loginPath;
  },

  /**
   * 앱 시작 시 인증 상태 초기화
   *
   * refresh_token (HttpOnly Cookie)으로 access_token을 재발급받고
   * JWT payload에서 userType을 추출하여 인증 상태 결정
   */
  initialize: async () => {
    if (typeof window === 'undefined') return;

    // 로컬 개발 테스트 모드: 인증 우회
    if (BYPASS_AUTH) {
      set({
        isAuthenticated: true,
        userType: BYPASS_AUTH_TYPE,
        isInitialized: true,
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const token: string | undefined = data.access_token;
        const userTypeFromBody: UserType | undefined = data.user_type;

        if (token) {
          // Legacy path: backend returns token in body
          tokenStore.set(token);
          const userType = decodeUserType(token);
          set({
            isAuthenticated: true,
            userType,
            isInitialized: true,
          });
          return;
        }

        if (userTypeFromBody) {
          // Current path: backend sets token as cookie, returns user_type in body
          set({
            isAuthenticated: true,
            userType: userTypeFromBody,
            isInitialized: true,
          });
          return;
        }

        // Fallback: 서버가 200 OK를 반환했지만 body에 token/user_type이 없는 경우
        // userType 쿠키를 확인해 인증 상태 복원 (로그인 시 서버가 설정한 쿠키)
        const cookieUserType = cookieManager.getUserType();
        if (cookieUserType) {
          set({
            isAuthenticated: true,
            userType: cookieUserType,
            isInitialized: true,
          });
          return;
        }
      }
    } catch {
      // 네트워크 오류 등 — 비인증 상태로 처리
    }

    tokenStore.clear();
    set({
      isAuthenticated: false,
      userType: null,
      isInitialized: true,
    });
  },

  /**
   * 인증 상태 재확인 (token 기반)
   *
   * 사용 시점:
   * - 로그인 성공 후
   * - 페이지 포커스 복귀 시
   */
  checkAuth: async () => {
    if (typeof window === 'undefined') return;

    const token = tokenStore.get();
    if (token) {
      const userType = decodeUserType(token);
      set({ isAuthenticated: true, userType });
    } else {
      set({ isAuthenticated: false, userType: null });
    }
  },
}));

/**
 * 앱 시작 시 자동 초기화
 * (Root Layout이나 App Component에서 호출)
 */
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}

/**
 * Helper hook - 로딩 상태 포함
 */
export const useAuth = () => {
  const store = useAuthStore();

  return {
    isAuthenticated: store.isAuthenticated,
    userType: store.userType,
    isLoading: !store.isInitialized,
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
  };
};

/**
 * Helper - 특정 role 체크
 */
export const useIsUser = () => useAuthStore((state) => state.userType === 'user');
export const useIsCompany = () => useAuthStore((state) => state.userType === 'company');
export const useIsAdmin = () => useAuthStore((state) => state.userType === 'admin');
export const useIsGuest = () => useAuthStore((state) => !state.isAuthenticated);
