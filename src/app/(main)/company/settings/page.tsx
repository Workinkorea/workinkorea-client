import { Metadata } from 'next';
import Link from 'next/link';
import { Settings, Key, Bell, CreditCard, User } from 'lucide-react';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '설정 - WorkInKorea',
  description: '기업 계정 설정을 관리하세요.',
});

/**
 * ISSUE-116: 현재 기업 설정 기능은 프로필 편집만 제공.
 * 비밀번호 변경/알림 설정 등은 서버 구현 후 추가될 예정.
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-title-4 font-bold text-slate-900">기업 설정</h1>
              <p className="text-caption-1 text-slate-500">계정 및 알림 설정을 관리합니다</p>
            </div>
          </div>
          <Link
            href="/company/profile/edit"
            className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-slate-500" />
              <div>
                <p className="text-body-3 font-semibold text-slate-900">기업 프로필 편집</p>
                <p className="text-caption-2 text-slate-500">회사 정보, 연락처를 수정합니다</p>
              </div>
            </div>
            <span className="text-caption-2 text-blue-600 font-semibold">이동 →</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <p className="text-caption-1 font-semibold text-slate-700 mb-3">준비 중인 설정</p>
          <ul className="space-y-3 text-caption-2 text-slate-500">
            <li className="flex items-center gap-3 opacity-60">
              <Key size={16} className="text-slate-400" />
              <span>비밀번호 변경 (예정)</span>
            </li>
            <li className="flex items-center gap-3 opacity-60">
              <Bell size={16} className="text-slate-400" />
              <span>알림 설정 (예정)</span>
            </li>
            <li className="flex items-center gap-3 opacity-60">
              <CreditCard size={16} className="text-slate-400" />
              <span>결제/구독 관리 (예정)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
