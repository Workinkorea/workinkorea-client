import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('support');
}

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-title-3 font-bold text-slate-900 mb-8">고객센터</h1>
      <div className="space-y-6 text-slate-700">
        <section className="bg-white border border-slate-100 rounded-xl p-6">
          <h2 className="text-title-5 font-semibold text-slate-800 mb-3">이메일 문의</h2>
          <p className="text-body-3 text-slate-600">
            문의사항은 아래 이메일로 보내주시면 빠르게 답변드리겠습니다.
          </p>
          <a
            href="mailto:support@workinkorea.com"
            className="mt-2 inline-block text-blue-600 font-medium underline underline-offset-4 hover:text-blue-700 transition-colors"
          >
            support@workinkorea.com
          </a>
        </section>
        <section className="bg-white border border-slate-100 rounded-xl p-6">
          <h2 className="text-title-5 font-semibold text-slate-800 mb-3">운영 시간</h2>
          <p className="text-body-3 text-slate-600">평일 오전 9시 ~ 오후 6시 (주말 및 공휴일 휴무)</p>
        </section>
      </div>
    </main>
  );
}
