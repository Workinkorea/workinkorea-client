'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function TermsModal({ isOpen, onClose, title, content }: TermsModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 cursor-pointer"
          />

          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-line-200">
                <h2 className="text-title-3 text-label-900 font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5 text-label-500" />
                </button>
              </div>

              {/* 내용 */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-sm max-w-none">
                  {content.split('\n').map((line, index) => {
                    // 헤딩 처리
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-title-2 font-bold text-label-900 mt-6 mb-4">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-title-3 font-bold text-label-900 mt-5 mb-3">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-body-1 font-semibold text-label-900 mt-4 mb-2">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }

                    // 구분선
                    if (line === '---') {
                      return <hr key={index} className="my-6 border-line-200" />;
                    }

                    // 볼드 처리
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={index} className="text-body-3 text-label-700 mb-2 leading-relaxed">
                          {parts.map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className="font-semibold text-label-900">{part}</strong> : part
                          )}
                        </p>
                      );
                    }

                    // 빈 줄
                    if (line.trim() === '') {
                      return <div key={index} className="h-2" />;
                    }

                    // 일반 텍스트
                    return (
                      <p key={index} className="text-body-3 text-label-700 mb-2 leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* 푸터 */}
              <div className="flex items-center justify-end p-6 border-t border-line-200">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary-300 text-white rounded-lg hover:bg-primary-400 transition-colors font-medium text-sm cursor-pointer"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
