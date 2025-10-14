import { tokenManager } from './tokenManager';
import { decodeJWT, getTokenExpiration, isTokenExpired, getTokenRemainingTime } from './jwtUtils';

interface TokenStatus {
  exists: boolean;
  valid: boolean;
  expired: boolean;
  payload: Record<string, unknown> | null;
  expiration: number | null;
  expirationDate: string | null;
  remainingTime: number | null;
  remainingTimeFormatted: string | null;
}

class TokenDebug {
  private monitorInterval: NodeJS.Timeout | null = null;

  /**
   * 현재 토큰 상태를 예쁘게 출력합니다
   */
  status(): TokenStatus {
    const token = tokenManager.getAccessToken();

    if (!token) {
      console.log('🔴 No token found');
      return {
        exists: false,
        valid: false,
        expired: true,
        payload: null,
        expiration: null,
        expirationDate: null,
        remainingTime: null,
        remainingTimeFormatted: null,
      };
    }

    const payload = decodeJWT(token);
    const expiration = getTokenExpiration(token);
    const expired = isTokenExpired(token);
    const remainingTime = getTokenRemainingTime(token);

    const status: TokenStatus = {
      exists: true,
      valid: !expired,
      expired,
      payload,
      expiration,
      expirationDate: expiration ? new Date(expiration * 1000).toLocaleString('ko-KR') : null,
      remainingTime,
      remainingTimeFormatted: remainingTime !== null ? this.formatTime(remainingTime) : null,
    };

    this.printStatus(status);
    return status;
  }

  /**
   * 토큰 상태를 실시간으로 모니터링합니다
   * @param intervalSeconds 모니터링 간격 (초) - 기본값 5초
   */
  monitor(intervalSeconds: number = 5): void {
    if (this.monitorInterval) {
      console.log('⚠️  Monitor already running. Stop it first with tokenDebug.stopMonitor()');
      return;
    }

    console.log(`🔍 Starting token monitor (interval: ${intervalSeconds}s)`);
    console.log('📌 Stop with: tokenDebug.stopMonitor()');
    console.log('---');

    // 즉시 한번 실행
    this.status();

    this.monitorInterval = setInterval(() => {
      console.log(`\n⏱️  [${new Date().toLocaleTimeString('ko-KR')}]`);
      this.status();
    }, intervalSeconds * 1000);
  }

  /**
   * 모니터링을 중지합니다
   */
  stopMonitor(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('✅ Monitor stopped');
    } else {
      console.log('⚠️  No monitor running');
    }
  }

  /**
   * 특정 토큰을 분석합니다
   * @param token JWT 토큰 문자열
   */
  analyze(token: string): void {
    const payload = decodeJWT(token);
    const expiration = getTokenExpiration(token);
    const expired = isTokenExpired(token);
    const remainingTime = getTokenRemainingTime(token);

    console.log('🔬 Token Analysis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!payload) {
      console.log('❌ Invalid token format');
      return;
    }

    console.log('📦 Payload:', payload);
    console.log('');

    if (expiration) {
      console.log('⏰ Expiration:', new Date(expiration * 1000).toLocaleString('ko-KR'));
      console.log('📅 Unix Timestamp:', expiration);
    }

    console.log('');
    console.log('Status:', expired ? '🔴 EXPIRED' : '🟢 VALID');

    if (remainingTime !== null) {
      console.log('⏳ Remaining Time:', this.formatTime(remainingTime));

      if (remainingTime > 0 && remainingTime <= 300) {
        console.log('⚠️  Warning: Token expires in less than 5 minutes');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * 3초 후 만료되는 토큰을 시뮬레이션합니다
   */
  simulateExpiring(): void {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3; // 3초 후 만료

    const mockPayload = {
      userId: 'test-user',
      email: 'test@example.com',
      iat: now - 1800, // 30분 전 발급
      exp: exp,
    };

    const mockToken = this.createMockToken(mockPayload);
    tokenManager.setAccessToken(mockToken);

    console.log('✅ Simulated expiring token (expires in 3 seconds)');
    console.log('🧪 Test command: tokenDebug.monitor(1)');
    this.status();
  }

  /**
   * 이미 만료된 토큰을 시뮬레이션합니다
   */
  simulateExpired(): void {
    const now = Math.floor(Date.now() / 1000);
    const exp = now - 60; // 1분 전 만료

    const mockPayload = {
      userId: 'test-user',
      email: 'test@example.com',
      iat: now - 3600, // 1시간 전 발급
      exp: exp,
    };

    const mockToken = this.createMockToken(mockPayload);
    tokenManager.setAccessToken(mockToken);

    console.log('✅ Simulated expired token (expired 1 minute ago)');
    this.status();
  }

  /**
   * 정상적인 토큰을 시뮬레이션합니다 (1시간 유효)
   */
  simulateValid(): void {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1시간 후 만료

    const mockPayload = {
      userId: 'test-user',
      email: 'test@example.com',
      iat: now,
      exp: exp,
    };

    const mockToken = this.createMockToken(mockPayload);
    tokenManager.setAccessToken(mockToken);

    console.log('✅ Simulated valid token (expires in 1 hour)');
    this.status();
  }

  /**
   * Mock JWT 토큰을 생성합니다 (실제 서명 없음, 테스트용)
   */
  private createMockToken(payload: Record<string, unknown>): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    return `${encodedHeader}.${encodedPayload}.mock-signature`;
  }

  /**
   * 초 단위 시간을 읽기 쉬운 형식으로 변환합니다
   */
  private formatTime(seconds: number): string {
    if (seconds < 0) return '0초';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}초`);

    return parts.join(' ');
  }

  /**
   * 토큰 상태를 콘솔에 예쁘게 출력합니다
   */
  private printStatus(status: TokenStatus): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Token Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!status.exists) {
      console.log('Status: 🔴 NO TOKEN');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return;
    }

    console.log('Status:', status.valid ? '🟢 VALID' : '🔴 EXPIRED');
    console.log('');

    if (status.payload) {
      console.log('📦 Payload:');
      Object.entries(status.payload).forEach(([key, value]) => {
        if (key === 'exp' || key === 'iat') {
          const timestamp = value as number;
          const date = new Date(timestamp * 1000).toLocaleString('ko-KR');
          console.log(`   ${key}: ${timestamp} (${date})`);
        } else {
          console.log(`   ${key}:`, value);
        }
      });
      console.log('');
    }

    if (status.expirationDate) {
      console.log('⏰ Expiration:', status.expirationDate);
    }

    if (status.remainingTimeFormatted !== null) {
      const emoji = status.expired ? '⏱️' : status.remainingTime! <= 300 ? '⚠️' : '⏳';
      console.log(`${emoji} Remaining:`, status.remainingTimeFormatted);

      if (!status.expired && status.remainingTime! <= 300) {
        console.log('   ⚠️  Warning: Less than 5 minutes remaining');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * 도움말을 표시합니다
   */
  help(): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Token Debug Utility - Help');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📊 Status & Monitoring:');
    console.log('  tokenDebug.status()           - Show current token status');
    console.log('  tokenDebug.monitor(5)         - Monitor every 5 seconds');
    console.log('  tokenDebug.stopMonitor()      - Stop monitoring');
    console.log('');
    console.log('🔬 Analysis:');
    console.log('  tokenDebug.analyze(token)     - Analyze specific token');
    console.log('');
    console.log('🧪 Simulation:');
    console.log('  tokenDebug.simulateValid()    - Set valid token (1 hour)');
    console.log('  tokenDebug.simulateExpiring() - Set expiring token (3 sec)');
    console.log('  tokenDebug.simulateExpired()  - Set expired token');
    console.log('');
    console.log('ℹ️  Other:');
    console.log('  tokenDebug.help()             - Show this help');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

export const tokenDebug = new TokenDebug();

// 브라우저 콘솔에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  (window as unknown as { tokenDebug: TokenDebug }).tokenDebug = tokenDebug;
  console.log('🔐 Token Debug Utility loaded!');
  console.log('💡 Type "tokenDebug.help()" for available commands');
}
