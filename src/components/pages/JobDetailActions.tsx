'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function JobDetailActions() {
  const router = useRouter();

  return (
    <>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-label-600 hover:text-label-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>목록으로</span>
      </button>

      {/* 하단 지원하기 버튼은 나중에 추가 */}
    </>
  );
}
