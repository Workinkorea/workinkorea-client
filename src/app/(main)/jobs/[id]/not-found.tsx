import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function JobNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-blue-300" />
        </div>
        <h1 className="text-[22px] font-extrabold text-slate-900 mb-3">
          공고를 찾을 수 없습니다
        </h1>
        <p className="text-body-2 text-slate-500 mb-8">
          해당 채용 공고가 삭제되었거나<br />존재하지 않는 공고입니다.
        </p>
        <div className="space-y-3">
          <Link
            href="/jobs"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            채용 공고 목록으로
          </Link>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
