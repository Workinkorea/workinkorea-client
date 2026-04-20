/**
 * Template 컴포넌트는 모든 라우트 전환마다 렌더링되는 wrapper 입니다.
 *
 * 이전 구현은 framer-motion 의 `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
 * 패턴을 사용했으나, framer-motion 하이드레이션이 실패하거나 지연될 경우
 * 전체 페이지가 `opacity:0` 상태로 고정되는 "미마운트" 이슈를 유발했습니다.
 *
 * 페이지 전환 효과가 필요하더라도 CSS 기반 transition 으로 구현해야 하며,
 * 최소한 기본 렌더 상태는 opacity:1 이어야 합니다.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
