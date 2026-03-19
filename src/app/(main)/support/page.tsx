import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '고객센터 | Work in Korea',
};

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">고객센터</h1>
      <div className="space-y-6 text-slate-700">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">이메일 문의</h2>
          <p className="text-sm text-slate-600">
            문의사항은 아래 이메일로 보내주시면 빠르게 답변드리겠습니다.
          </p>
          <p className="mt-2 text-blue-600 font-medium">support@workinkorea.com</p>
        </section>
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">운영 시간</h2>
          <p className="text-sm text-slate-600">평일 오전 9시 ~ 오후 6시 (주말 및 공휴일 휴무)</p>
        </section>
      </div>
    </main>
  );
}
