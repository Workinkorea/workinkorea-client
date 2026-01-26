import { create } from 'zustand';
import { cookieManager, UserType } from '@/shared/lib/utils/cookieManager';

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
    // 1. Zustand State 업데이트
    set({
      isAuthenticated: true,
      userType,
      isInitialized: true,
    });

    // 2. 쿠키에도 userType 설정 (백엔드 쿠키와 동기화)
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
   * 백엔드가 userType 쿠키를 httponly=false로 설정하므로
   * 클라이언트에서 직접 읽어서 초기화
   */
  initialize: async () => {
    if (typeof window === 'undefined') return;

    const userType = cookieManager.getUserType();

    set({
      isAuthenticated: !!userType,
      userType,
      isInitialized: true,
    });
  },

  /**
   * 인증 상태 재확인 (쿠키 기반)
   *
   * 사용 시점:
   * - 로그인 성공 후
   * - 페이지 포커스 복귀 시
   */
  checkAuth: async () => {
    if (typeof window === 'undefined') return;

    const userType = cookieManager.getUserType();

    set({
      isAuthenticated: !!userType,
      userType,
    });
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
