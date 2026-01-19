import { create } from 'zustand';
import { cookieManager, UserType } from '@/shared/lib/utils/cookieManager';

/**
 * Auth Store (Zustand)
 *
 * AuthContext 대체 - 더 빠른 동기화와 간단한 상태 관리
 *
 * 장점:
 * - Context Provider 불필요
 * - 리렌더링 최적화
 * - 동기화 문제 없음
 * - DevTools 지원
 */

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
   * 중요: Middleware가 쿠키를 확인하므로 쿠키도 설정해야 함!
   */
  login: (userType: UserType) => {
    // 1. Zustand State 업데이트
    set({
      isAuthenticated: true,
      userType,
      isInitialized: true,
    });

    // 2. 쿠키에도 userType 설정 (Middleware가 확인함)
    // 백엔드가 userType 쿠키를 설정하지 않는 경우를 대비
    cookieManager.setUserType(userType);
  },

  /**
   * 로그아웃 (비동기 처리 포함)
   */
  logout: async () => {
    if (typeof window === 'undefined') return;

    // 1. userType 먼저 읽기 (쿠키 삭제 전)
    const currentUserType = cookieManager.getUserType();

    // 2. State 즉시 업데이트 (UI 반영)
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
      // API 실패 시 폴백
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
   * 전략:
   * 1. 먼저 쿠키에서 빠르게 초기화 (깜빡임 방지)
   * 2. 그 다음 /api/me에서 정확한 user_type 확인
   */
  initialize: async () => {
    if (typeof window === 'undefined') return;

    // 1단계: 쿠키에서 빠른 초기화
    const cookieUserType = cookieManager.getUserType();

    if (cookieUserType) {
      set({
        isAuthenticated: true,
        userType: cookieUserType,
        isInitialized: true,
      });
    }

    // 2단계: API에서 정확한 user_type 확인
    try {
      const { authApi } = await import('@/features/auth/api/authApi');
      const profile = await authApi.getProfile();

      // ✅ 백엔드에서 받은 user_type 사용
      if (profile?.user_type) {
        set({
          isAuthenticated: true,
          userType: profile.user_type,
          isInitialized: true,
        });

        // Middleware를 위해 쿠키도 동기화
        cookieManager.setUserType(profile.user_type);
      } else {
        // user_type이 없으면 쿠키만 신뢰
        set({
          isAuthenticated: !!cookieUserType,
          userType: cookieUserType,
          isInitialized: true,
        });
      }
    } catch (err) {
      // API 실패 시 (401 등)
      console.warn('[AuthStore] Failed to fetch user profile:', err);
      set({
        isAuthenticated: false,
        userType: null,
        isInitialized: true,
      });
    }
  },

  /**
   * 인증 상태 재확인 (API 기반)
   *
   * 사용 시점:
   * - 로그인 성공 후
   * - 페이지 포커스 복귀 시
   */
  checkAuth: async () => {
    if (typeof window === 'undefined') return;

    try {
      const { authApi } = await import('@/features/auth/api/authApi');
      const profile = await authApi.getProfile();

      if (profile?.user_type) {
        set({
          isAuthenticated: true,
          userType: profile.user_type,
        });

        cookieManager.setUserType(profile.user_type);
      } else {
        // Fallback to cookie
        const cookieUserType = cookieManager.getUserType();
        set({
          isAuthenticated: !!cookieUserType,
          userType: cookieUserType,
        });
      }
    } catch (err) {
      // 401 등 인증 실패
      set({
        isAuthenticated: false,
        userType: null,
      });
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
