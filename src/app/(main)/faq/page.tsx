import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '자주 묻는 질문',
  description: '워크인코리아 자주 묻는 질문(FAQ)입니다. 서비스 이용 방법, 채용 절차, 비자 관련 문의를 확인하세요.',
});

const faqs = [
  {
    q: 'Work in Korea는 어떤 서비스인가요?',
    a: 'Work in Korea는 외국인 근로자를 위한 한국 취업 지원 플랫폼입니다. 채용 공고 탐색, 이력서 작성, 자가 진단 등의 기능을 제공합니다.',
  },
  {
    q: '회원가입은 어떻게 하나요?',
    a: '상단의 아이콘을 클릭하여 회원 유형(일반/기업)을 선택한 뒤 이메일로 가입할 수 있습니다.',
  },
  {
    q: '채용 공고에 어떻게 지원하나요?',
    a: '로그인 후 채용 공고 상세 페이지에서 이력서를 선택하여 지원할 수 있습니다.',
  },
  {
    q: '기업 회원으로 채용 공고를 등록하려면 어떻게 하나요?',
    a: '기업 회원으로 가입 후 기업 대시보드에서 채용 공고를 등록할 수 있습니다.',
  },
  {
    q: '서비스 이용 중 문제가 발생하면 어떻게 하나요?',
    a: '고객센터(support@workinkorea.com)로 문의해주시면 빠르게 도와드리겠습니다.',
  },
];

export default function FaqPage() {
  return (
    <main>
      <h1 className="text-title-3 font-bold text-label-900 mb-8">자주 묻는 질문</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-line-200 rounded-xl p-6">
            <p className="font-semibold text-label-800 mb-2">Q. {faq.q}</p>
            <p className="text-body-3 text-label-600">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
