'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Work in Korea는 어떤 서비스인가요?',
    answer: 'Work in Korea는 외국인 근로자를 위한 한국 취업 지원 플랫폼입니다. 채용 공고 탐색, 이력서 작성, 자가 진단 등의 기능을 제공합니다.',
  },
  {
    question: '회원가입은 어떻게 하나요?',
    answer: '상단의 아이콘을 클릭하여 회원 유형(개인회원/기업회원)을 선택한 뒤 이메일로 가입할 수 있습니다.',
  },
  {
    question: '채용 공고에 어떻게 지원하나요?',
    answer: '로그인 후 채용 공고 상세 페이지에서 이력서를 선택하여 지원할 수 있습니다.',
  },
  {
    question: '기업 회원으로 채용 공고를 등록하려면 어떻게 하나요?',
    answer: '기업 회원으로 가입 후 기업 대시보드에서 채용 공고를 등록할 수 있습니다.',
  },
  {
    question: '서비스 이용 중 문제가 발생하면 어떻게 하나요?',
    answer: '고객센터(support@workinkorea.com)로 문의해주시면 빠르게 도와드리겠습니다.',
  },
];

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-body-1 font-semibold text-slate-900">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-slate-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-5 text-body-2 text-slate-700 border-t border-slate-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion() {
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <FaqItem key={i} {...item} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
