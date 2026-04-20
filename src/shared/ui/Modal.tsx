'use client';

import { ReactNode, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Portal } from './Portal';
import { cn } from '@/shared/lib/utils/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // 모달이 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 모달이 열릴 때 포커스 관리
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // 오버레이 클릭으로 모달 닫기
  const handleOverlayClick = (e: MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 모달 크기 클래스
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // 애니메이션 variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        duration: 0.3,
        bounce: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Portal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleOverlayClick}
            />

            {/* 모달 컨테이너 */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  ref={modalRef}
                  className={cn(
                    'relative w-full bg-white rounded-xl shadow-xl',
                    sizeClasses[size],
                    className
                  )}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  tabIndex={-1}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={title ? 'modal-title' : undefined}
                >
                  {/* 헤더 */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                      {title && (
                        <h2
                          id="modal-title"
                          className="text-title-5 font-semibold text-slate-900"
                        >
                          {title}
                        </h2>
                      )}

                      {showCloseButton && (
                        <motion.button
                          onClick={onClose}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          aria-label="모달 닫기"
                          whileHover={{ rotate: 90 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        >
                          <X size={20} />
                        </motion.button>
                      )}
                    </div>
                  )}

                  {/* 컨텐츠 */}
                  <div className="p-6">
                    {children}
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}