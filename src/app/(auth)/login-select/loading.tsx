import { Skeleton } from '@/shared/ui/Skeleton';

export default function LoginSelectLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div>
        {/* 헤더 */}
        <div className="text-center mb-12 sm:mb-14 space-y-3">
          <Skeleton variant="text" className="h-8 sm:h-10 lg:h-12 w-64 sm:w-80 mx-auto" />
          <Skeleton variant="text" className="h-4 sm:h-5 w-72 sm:w-96 mx-auto" />
        </div>

        {/* 카드 그리드 */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border-2 border-slate-100 rounded-2xl p-6 sm:p-8 space-y-5"
            >
              {/* 아이콘 */}
              <Skeleton className="w-14 h-14 rounded-2xl" />

              {/* 텍스트 */}
              <div className="space-y-2">
                <Skeleton variant="text" className="h-5 w-24" />
                <Skeleton variant="text" className="h-4 w-40" />
              </div>

              {/* CTA */}
              <Skeleton variant="text" className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* 구분선 + 회원가입 링크 */}
        <div className="pt-6 sm:pt-8 border-t border-slate-100 flex justify-center">
          <Skeleton variant="text" className="h-4 w-52" />
        </div>
      </div>
    </div>
  );
}
