import { Skeleton } from '@/shared/ui/Skeleton';

export default function UserProfileLoading() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="page-container space-y-6">

        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton variant="text" className="h-8 w-32" />
            <Skeleton variant="text" className="h-4 w-56" />
          </div>
        </div>

        {/* UserProfileHeader 카드 */}
        <div className="bg-white rounded-2xl border border-line-400 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            <Skeleton variant="circle" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <Skeleton variant="text" className="h-6 w-40 mx-auto sm:mx-0" />
              <Skeleton variant="text" className="h-4 w-28 mx-auto sm:mx-0" />
              <Skeleton variant="text" className="h-4 w-56 mx-auto sm:mx-0" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
          </div>
        </div>

        {/* 탭 네비게이션 — pill 스타일 (실제와 동일) */}
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex gap-2">
            {['대시보드', '이력서', '스킬 관리', '경력 관리'].map((label, i) => (
              <div
                key={label}
                className={`px-4 py-2 rounded-lg text-body-3 font-medium shrink-0 ${
                  i === 0 ? 'bg-primary-500' : 'bg-transparent'
                }`}
              >
                <Skeleton
                  variant="text"
                  className={`h-4 ${i === 0 ? 'w-16 bg-white/60' : 'w-12'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 — overview: 1컬럼, 레이더 차트 */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <Skeleton variant="text" className="h-5 w-32" />
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <div className="flex justify-center">
              <Skeleton variant="circle" className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
