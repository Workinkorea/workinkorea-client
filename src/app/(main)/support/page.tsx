import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '고객센터',
  description: '워크인코리아 고객센터입니다. 서비스 이용 문의, 불편사항 신고 및 제휴 문의를 접수하세요.',
});

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-title-3 font-bold text-label-900 mb-8">고객센터</h1>
      <div className="space-y-6 text-label-700">
        <section className="bg-white border border-line-200 rounded-xl p-6">
          <h2 className="text-title-5 font-semibold text-label-800 mb-3">이메일 문의</h2>
          <p className="text-body-3 text-label-600">
            문의사항은 아래 이메일로 보내주시면 빠르게 답변드리겠습니다.
          </p>
          <p className="mt-2 text-primary-600 font-medium">support@workinkorea.com</p>
        </section>
        <section className="bg-white border border-line-200 rounded-xl p-6">
          <h2 className="text-title-5 font-semibold text-label-800 mb-3">운영 시간</h2>
          <p className="text-body-3 text-label-600">평일 오전 9시 ~ 오후 6시 (주말 및 공휴일 휴무)</p>
        </section>
      </div>
    </main>
  );
}
