'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  label: string;
  /** 연결할 input id — <label htmlFor> 로 시맨틱 연결 */
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 공통 폼 필드 래퍼
 * - 레이블 + 필수 표시(*) + 자식 인풋 + 힌트/에러 메시지
 * - UX: 에러 발생 시 shake 애니메이션으로 오류 위치를 즉각 인지시킴
 * - 에러 메시지는 AnimatePresence로 부드럽게 등장/퇴장
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <motion.div
      className={className}
      /* 에러 시 수평 shake: 오류 위치를 즉각 시각화 */
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* 레이블: text-slate-700 = #334155(slate-700), 13px semibold */}
      <label htmlFor={htmlFor} className="block text-caption-1 font-semibold text-slate-700 mb-1.5">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>
            <span className="sr-only">(필수)</span>
          </>
        )}
      </label>

      {children}

      {/* 힌트 텍스트 (에러가 없을 때만 표시) */}
      {hint && !error && (
        <p className="mt-1 text-caption-2 text-slate-400">{hint}</p>
      )}

      {/* 에러 메시지: 등장/퇴장 애니메이션 포함 */}
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            className="mt-1 text-caption-3 text-red-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
