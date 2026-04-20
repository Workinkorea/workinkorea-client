import { create } from 'zustand';
import { cookieManager, UserType } from '@/shared/lib/utils/cookieManager';
import { tokenStore, decodeUserType } from '@/shared/api/tokenStore';

// 로컬 개발 테스트용 인증 우회
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
const BYPASS_AUTH_TYPE = (process.env.NEXT_PUBLIC_BYPASS_AUTH_TYPE ?? 'user') as UserType;

// initialize() 중복 실행 방지 (페이지 이동마다 refresh 호출 방지)
let _initializationPromise: Promise<void> | null = null;

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

/**
 * GET /api/me 로 세션 유효성 ���인
 * HttpOnly access_token 쿠키가 살아있으면 200 반환 → userType 결정
 */
async function verifySessionWithProfile(): Promise<UserType | null> {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('/api/me', {
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(tid);

    if (res.ok) {
      // /api/me 가 200이면 개인 회원으로 인증됨
      // (기업 회원은 /api/company-profile 을 사용)
      const cookieUserType = cookieManager.getUserType();
      const userType = cookieUserType ?? 'user';
      cookieManager.setUserType(userType);
      return userType;
    }
    return null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

    // non-HttpOnly 쿠키를 별도 설정 -- initialize() 폴백에서 document.cookie로 읽기 위해 필요
    // 백엔드가 설정한 쿠키는 HttpOnly이므로 JS에서 읽을 수 없음
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
   * 전략 (우선순위 순):
   * 1. POST /api/auth/refresh -> access_token 재발급 + userType 결정
   * 2. refresh 실패 시 GET /api/me -> HttpOnly access_token 쿠키가 유효한지 확인
   * 3. 위 모두 실패 시 userType 쿠키 폴백
   *
   * 타임아웃: 5초 (skeleton 무한 표시 방지)
   */
  initialize: async () => {
    if (typeof window === 'undefined') return;
    if (get().isInitialized) return;
    if (_initializationPromise) return _initializationPromise;

    _initializationPromise = (async () => {
      // 로컬 개발 테스트 모드: 인증 우회
      if (BYPASS_AUTH) {
        set({
          isAuthenticated: true,
          userType: BYPASS_AUTH_TYPE,
          isInitialized: true,
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const token: string | undefined = data.access_token;
          const userTypeFromBody: UserType | undefined = data.user_type;

          if (token) {
            tokenStore.set(token);
            const userType = decodeUserType(token);
            if (userType) cookieManager.setUserType(userType);
            set({
              isAuthenticated: true,
              userType,
              isInitialized: true,
            });
            return;
          }

          if (userTypeFromBody) {
            cookieManager.setUserType(userTypeFromBody);
            set({
              isAuthenticated: true,
              userType: userTypeFromBody,
              isInitialized: true,
            });
            return;
          }

          // 서버가 200 OK지만 body에 token/user_type 없음
          const cookieUserType = cookieManager.getUserType();
          if (cookieUserType) {
            set({
              isAuthenticated: true,
              userType: cookieUserType,
              isInitialized: true,
            });
            return;
          }
        } else {
          // refresh 실패 (401 등)
          // HttpOnly access_token 쿠키가 살아있을 수 있으므로 GET /api/me 로 확인
          const verified = await verifySessionWithProfile();
          if (verified) {
            set({
              isAuthenticated: true,
              userType: verified,
              isInitialized: true,
            });
            return;
          }

          // /api/me 도 실패 -- userType 쿠키 폴백
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
      } catch (err) {
        clearTimeout(timeoutId);

        // 네트워크 오류 또는 타임아웃 -- GET /api/me 폴백
        const verified = await verifySessionWithProfile();
        if (verified) {
          set({
            isAuthenticated: true,
            userType: verified,
            isInitialized: true,
          });
          return;
        }

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

      tokenStore.clear();
      set({
        isAuthenticated: false,
        userType: null,
        isInitialized: true,
      });
    })().finally(() => { _initializationPromise = null; });

    return _initializationPromise;
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
