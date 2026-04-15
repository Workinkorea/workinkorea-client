import { Skeleton } from '@/shared/ui/Skeleton';

export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-label-50">
      <div className="page-container py-6 sm:py-8">
        {/* 뒤로가기 버튼 */}
        <Skeleton variant="text" className="h-9 w-28 mb-6 rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* 왼쪽: 메인 콘텐츠 */}
          <div className="space-y-4">

            {/* Hero 헤더 카드 */}
            <div className="bg-white rounded-2xl border border-line-400 p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6 mb-6">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-3 w-24" />
                  <Skeleton variant="text" className="h-7 w-3/4" />
                  <Skeleton variant="text" className="h-7 w-1/2" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton variant="text" className="h-6 w-20 rounded-full" />
                    <Skeleton variant="text" className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton variant="text" className="h-5 w-32 rounded-full" />
                <Skeleton variant="text" className="h-5 w-24 rounded-full" />
              </div>
            </div>

            {/* 파란 정보 배너 (4-그리드) */}
            <div className="bg-primary-50 rounded-xl border border-primary-100 p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center space-y-1.5">
                    <Skeleton variant="text" className="h-3 w-16 mx-auto" />
                    <Skeleton variant="text" className="h-5 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* 채용 기간 배너 */}
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="h-4 w-40" />
              </div>
            </div>

            {/* 채용 설명 섹션 */}
            <div className="bg-white rounded-2xl border border-line-400 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton variant="circle" className="w-6 h-6" />
                <Skeleton variant="text" className="h-6 w-32" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
              ))}
            </div>

            {/* 자격 요건 섹션 */}
            <div className="bg-white rounded-2xl border border-line-400 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton variant="circle" className="w-6 h-6" />
                <Skeleton variant="text" className="h-6 w-28" />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="text" className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* 오른쪽: 스티키 사이드바 */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* 지원 카드 */}
              <div className="bg-white rounded-2xl border border-line-400 p-6 shadow-sm space-y-4">
                <div className="text-center space-y-1">
                  <Skeleton variant="text" className="h-4 w-24 mx-auto" />
                  <Skeleton variant="text" className="h-10 w-40 mx-auto" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>

              {/* 기업 정보 카드 */}
              <div className="bg-white rounded-2xl border border-line-400 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="text" className="h-5 w-32" />
                    <Skeleton variant="text" className="h-3 w-24" />
                  </div>
                </div>
                <div className="pt-3 border-t border-line-200 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton variant="circle" className="w-4 h-4 shrink-0" />
                      <Skeleton variant="text" className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일: 플로팅 지원 버튼 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line-400 px-4 py-3 z-30">
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
