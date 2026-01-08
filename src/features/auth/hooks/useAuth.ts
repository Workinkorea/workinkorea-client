/**
 * ✅ 최적화 5: Context API로 마이그레이션 완료
 *
 * @deprecated 이 파일은 하위 호환성을 위해 유지됩니다.
 * 새 코드에서는 다음과 같이 사용하세요:
 *
 * ```typescript
 * import { useAuth } from '@/features/auth/contexts/AuthContext';
 * ```
 *
 * 기존 import 경로도 작동하지만, 새 경로 사용을 권장합니다.
 */

// Re-export from new Context API
export { useAuth } from '../contexts/AuthContext';
