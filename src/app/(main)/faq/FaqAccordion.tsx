'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

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
  const t = useTranslations('faq');

  return (
    <div className="space-y-3">
      {FAQ_KEYS.map((key, i) => (
        <FaqItem
          key={key}
          question={t(`${key}.question`)}
          answer={t(`${key}.answer`)}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}
