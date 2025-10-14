'use client';

import { useEffect } from 'react';

/**
 * 개발 환경에서 tokenDebug 유틸리티를 브라우저 콘솔에 로드합니다
 * 프로덕션 환경에서는 자동으로 비활성화됩니다
 */
export function TokenDebugLoader() {
  useEffect(() => {
    // 프로덕션 환경에서는 로드하지 않음
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    // 동적 임포트로 tokenDebug 로드
    import('@/lib/utils/tokenDebug')
      .then(() => {
        console.log('🔐 Token Debug Utility is ready!');
        console.log('💡 Type "tokenDebug.help()" in console for available commands');
      })
      .catch((err) => {
        console.error('Failed to load tokenDebug:', err);
      });
  }, []);

  return null;
}
