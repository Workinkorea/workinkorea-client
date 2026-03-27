import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '고객센터 | Work in Korea',
};

export default function SupportPage() {
  return (
    <main>
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
