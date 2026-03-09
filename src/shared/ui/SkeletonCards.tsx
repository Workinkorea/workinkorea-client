import { Skeleton } from './Skeleton';

/** 채용 공고 카드 스켈레톤 (JobCard) */
export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-12 h-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="text" className="h-6 w-16 rounded-full" />
        <Skeleton variant="text" className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

/** 채용 공고 목록 스켈레톤 (6장) */
export function JobListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** 채용 공고 상세 스켈레톤 */
export function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 뒤로가기 */}
        <Skeleton variant="text" className="h-9 w-24" />

        {/* 헤더 카드 */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <Skeleton className="w-16 h-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-7 w-2/3" />
              <Skeleton variant="text" className="h-4 w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
          <Skeleton className="h-12" />
        </div>

        {/* 상세 카드 */}
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-4">
          <Skeleton variant="text" className="h-6 w-24 mb-6" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-4 w-full" />
          ))}
          <Skeleton variant="text" className="h-4 w-4/5" />
        </div>

        {/* 버튼 */}
        <div className="hidden md:block bg-white rounded-xl p-6 shadow-sm">
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

/** 유저 프로필 스켈레톤 */
export function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <Skeleton variant="circle" className="w-20 h-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-6 w-48" />
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="text" className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-9 w-20" />
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg h-96 border border-slate-100 skeleton-shimmer" />
          <div className="bg-white rounded-lg h-96 border border-slate-100 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

/** 기업 대시보드 스켈레톤 (탭 기반 레이아웃) */
export function CompanyDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 영역: 기업명 + CTA 버튼 */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton variant="text" className="h-3 w-20" />
            <Skeleton variant="text" className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {/* 탭 바 */}
        <div className="max-w-4xl mx-auto mt-4 flex gap-1">
          <Skeleton variant="text" className="h-10 w-32 rounded-none" />
          <Skeleton variant="text" className="h-10 w-24 rounded-none" />
        </div>
      </div>
      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    </div>
  );
}

/** 기업 공고 목록 스켈레톤 */
export function CompanyJobsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-8 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 space-y-3">
              <Skeleton variant="text" className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton variant="text" className="h-4 w-16 rounded-full" />
                <Skeleton variant="text" className="h-4 w-20 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-3 w-24" />
                <Skeleton variant="text" className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 어드민 테이블 스켈레톤 */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 헤더 */}
      <div className="flex gap-4 px-6 py-4 border-b border-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-4 flex-1" />
        ))}
      </div>
      {/* 행 */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-6 py-4 border-b border-slate-50">
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} variant="text" className="h-4 flex-1" style={{ opacity: 1 - j * 0.1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** 진단 결과 스켈레톤 */
export function DiagnosisResultSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 상단 점수 카드 */}
        <div className="bg-white rounded-xl p-8 shadow-sm text-center space-y-4">
          <Skeleton variant="circle" className="w-32 h-32 mx-auto" />
          <Skeleton variant="text" className="h-8 w-48 mx-auto" />
          <Skeleton variant="text" className="h-4 w-64 mx-auto" />
        </div>

        {/* 결과 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm space-y-3">
              <Skeleton variant="text" className="h-5 w-32" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} variant="text" className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 폼 페이지 스켈레톤 (공고 작성/수정, 프로필 편집 등) */
export function FormPageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <Skeleton variant="text" className="h-8 w-48 mb-6" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 진단/자가진단 스켈레톤 */
export function DiagnosisSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 프로그레스 바 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-3">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <Skeleton variant="text" className="h-6 w-full" />
          <Skeleton variant="text" className="h-6 w-4/5" />
          <div className="space-y-3 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between">
          <Skeleton className="h-11 w-28" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    </div>
  );
}

/** 어드민 대시보드 스켈레톤 */
export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      {/* 빠른 링크 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
