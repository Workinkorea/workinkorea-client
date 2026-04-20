'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

// ─── 단일 아코디언 아이템 ─────────────────────────────────────────
export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'border border-slate-200 rounded-lg overflow-hidden',
        disabled && 'opacity-40 pointer-events-none',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between px-5 py-4',
          'text-left text-body-3 font-semibold text-slate-800',
          'bg-white hover:bg-slate-50 transition-colors duration-150 cursor-pointer',
          'focus:outline-none',
        )}
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          className={cn(
            'shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 py-4 text-body-3 text-slate-700 border-t border-slate-100 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── 아코디언 그룹 (단일 열림 모드) ──────────────────────────────
export interface AccordionGroupProps {
  items: Array<{
    id: string;
    title: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
  defaultOpenId?: string;
  allowMultiple?: boolean;
  gap?: 'none' | 'sm' | 'md';
  className?: string;
}

export function AccordionGroup({
  items,
  defaultOpenId,
  allowMultiple = false,
  gap = 'sm',
  className,
}: AccordionGroupProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set(),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const gapStyle = { none: '', sm: 'space-y-1', md: 'space-y-2' };

  return (
    <div className={cn(gapStyle[gap], className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              'border border-slate-200 rounded-lg overflow-hidden',
              item.disabled && 'opacity-40 pointer-events-none',
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className={cn(
                'w-full flex items-center justify-between px-5 py-4',
                'text-left text-body-3 font-semibold text-slate-800',
                'bg-white hover:bg-slate-50 transition-colors duration-150 cursor-pointer',
                'focus:outline-none',
              )}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={18}
                className={cn(
                  'shrink-0 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="px-5 py-4 text-body-3 text-slate-700 border-t border-slate-100 bg-white">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

AccordionItem.displayName = 'AccordionItem';
AccordionGroup.displayName = 'AccordionGroup';
