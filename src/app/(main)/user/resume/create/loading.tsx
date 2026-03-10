import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';

function SectionCard({
  titleWidth,
  rows,
  rowWidths,
  hasAddButton,
  hasPair,
}: {
  titleWidth: string;
  rows?: number;
  rowWidths?: string[];
  hasAddButton?: boolean;
  hasPair?: boolean;
}) {
  const items = rowWidths || Array.from({ length: rows || 3 }, (_, i) => i % 2 === 0 ? 'full' : '4/5');
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
        <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
        <Skeleton variant="text" className={`h-5 w-${titleWidth}`} />
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-4">
        {hasPair ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          items.map((w, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton className={`h-10 w-${w} rounded-lg`} />
            </div>
          ))
        )}
        {hasAddButton && (
          <Skeleton className="h-9 w-full rounded-lg mt-2" />
        )}
      </div>
    </div>
  );
}

export default function ResumeCreateLoading() {
  return (
    <Layout>
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="page-container h-16 flex items-center justify-between">
          <Skeleton variant="text" className="h-7 w-32" />
          <div className="flex gap-2">
            <Skeleton variant="circle" className="w-9 h-9" />
            <Skeleton variant="circle" className="w-9 h-9" />
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">

          {/* Page header: back button + title + save */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <Skeleton variant="text" className="h-7 w-32" />
            </div>
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>

          {/* 이력서 제목 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>

          {/* 프로필 사진 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
              <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
              <Skeleton variant="text" className="h-5 w-24" />
            </div>
            <div className="px-5 sm:px-6 py-5 flex items-center gap-5">
              <Skeleton variant="circle" className="w-24 h-24 shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton variant="text" className="h-3 w-40" />
              </div>
            </div>
          </div>

          {/* 언어 능력 */}
          <SectionCard titleWidth="24" hasPair rows={2} />

          {/* 학력 사항 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
              <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
              <Skeleton variant="text" className="h-5 w-20" />
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* 경력 사항 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
              <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
              <Skeleton variant="text" className="h-5 w-24" />
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* 자기소개 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
              <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
              <Skeleton variant="text" className="h-5 w-28" />
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* 자격증 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
              <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
              <Skeleton variant="text" className="h-5 w-20" />
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* Save / Cancel buttons */}
          <div className="flex gap-3 pb-8">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
