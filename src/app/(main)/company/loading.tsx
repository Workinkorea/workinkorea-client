import { Skeleton } from '@/shared/ui/Skeleton';

function PostCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
          <Skeleton variant="text" className="h-3 w-32" />
          <Skeleton variant="text" className="h-3 w-40" />
        </div>
        <div className="flex flex-col gap-2 items-end shrink-0">
          <Skeleton variant="text" className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 기업 정보 헤더 */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-5 sm:py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
              <div className="space-y-2">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton variant="text" className="h-6 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex gap-1 mt-5 border-b border-slate-100">
            {['관리 중인 공고', '기업 정보'].map((tab, i) => (
              <div
                key={tab}
                className={`flex items-center gap-1.5 px-4 py-3 ${i === 0 ? 'border-b-2 border-blue-600' : ''}`}
              >
                <Skeleton variant="circle" className="w-4 h-4" />
                <Skeleton variant="text" className={`h-4 ${i === 0 ? 'w-24' : 'w-16'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠: 공고 목록 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-28" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
