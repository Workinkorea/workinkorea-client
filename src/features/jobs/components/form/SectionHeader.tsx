'use client';

interface SectionHeaderProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

/**
 * 폼 섹션 헤더 — 스텝 번호 + 아이콘 + 제목 + 설명
 * UX: 번호+아이콘으로 완료해야 할 섹션 순서를 시각화해 인지 부하를 줄임
 */
export function SectionHeader({ step, icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-line-200">
      {/* 아이콘 배경: bg-primary-50(indigo-50)으로 섹션 시작을 시각적으로 구분 */}
      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {/* STEP 배지 */}
          <span className="text-caption-3 font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded tracking-wide">
            STEP {step}
          </span>
          <h2 className="text-body-2 font-bold text-label-900">{title}</h2>
        </div>
        {description && (
          <p className="text-caption-2 text-label-400 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
