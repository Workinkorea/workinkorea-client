import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Briefcase, Bell, Mail } from 'lucide-react';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '지원자 관리 - WorkInKorea',
  description: '채용 공고에 지원한 후보자들을 관리하세요.',
});

/**
 * ISSUE-115: 서버 `/api/posts/company/{id}/applicants` 미구현.
 * 단순 "준비 중" 대신 예정 기능 안내 + 대체 액션을 제공해 기업 회원이 길을 잃지 않도록 한다.
 */
export default function ApplicantsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-title-3 font-bold text-slate-900 mb-2">지원자 관리 기능 준비 중</h1>
          <p className="text-body-3 text-slate-500 mb-8">
            지원자 목록/열람/합격/불합격 처리는 서버 구현 완료 후 제공됩니다.
          </p>

          <div className="text-left bg-slate-50 rounded-lg p-4 mb-8">
            <p className="text-caption-1 font-semibold text-slate-700 mb-2">예정된 기능</p>
            <ul className="space-y-1.5 text-caption-2 text-slate-600">
              <li className="flex items-center gap-2"><Briefcase size={13} className="text-slate-400" /> 공고별 지원자 목록</li>
              <li className="flex items-center gap-2"><Mail size={13} className="text-slate-400" /> 이력서 열람 및 다운로드</li>
              <li className="flex items-center gap-2"><Bell size={13} className="text-slate-400" /> 지원 단계별 상태 관리</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/company"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-body-3 font-semibold hover:bg-blue-700 transition-colors"
            >
              대시보드로 돌아가기
            </Link>
            <Link
              href="/company/jobs"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-body-3 font-semibold hover:bg-slate-50 transition-colors"
            >
              공고 관리
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
