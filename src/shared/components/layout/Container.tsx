import { cn } from '@/shared/lib/utils/utils';

interface ContainerProps {
  children: React.ReactNode;
  /** 내부 컨텐츠 영역에 추가할 클래스 */
  className?: string;
  /** 외부 그리드 래퍼에 추가할 클래스 */
  wrapperClassName?: string;
}

/**
 * CSS Grid 3단 레이아웃 컨테이너
 *
 * grid-cols-[1fr_min(100%,_64rem)_1fr] 패턴:
 * - 좌우: 1fr 여백 (자동 균등 분배)
 * - 중앙: max-width 64rem(1024px), 화면이 좁으면 100%로 수축
 *
 * mx-auto + max-w-* 조합 대비 장점:
 * - 마진 겹침(margin collapse) 원천 차단
 * - padding으로 인한 레이아웃 시프트 없음
 * - 중앙 컬럼이 항상 안정적으로 정렬됨
 */
export function Container({ children, className, wrapperClassName }: ContainerProps) {
  return (
    <div
      className={cn(
        'grid w-full grid-cols-[1fr_min(100%,_64rem)_1fr] px-4 md:px-8',
        wrapperClassName,
      )}
    >
      <div className={cn('col-start-2 w-full', className)}>
        {children}
      </div>
    </div>
  );
}
