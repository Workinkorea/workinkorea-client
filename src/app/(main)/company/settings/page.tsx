import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '설정 - WorkInKorea',
  description: '기업 계정 설정을 관리하세요.',
});

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-title-2 font-semibold text-slate-900 mb-2">준비 중입니다</h2>
        <p className="text-body-2 text-slate-500">설정 기능은 곧 지원될 예정입니다</p>
      </div>
    </div>
  );
}
