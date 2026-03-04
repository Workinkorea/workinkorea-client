'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ResumeTemplate } from '@/features/user/types/user';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateSelect: (template: ResumeTemplate) => void;
  onNext: () => void;
}

function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  onNext
}: TemplateSelectorProps) {
  const templates = [
    {
      type: 'modern' as ResumeTemplate,
      name: '모던',
      description: '깔끔하고 현대적인 디자인으로 IT 업계에 적합',
      preview: '📝',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      features: ['심플한 레이아웃', '아이콘 활용', '컬러 포인트']
    },
    {
      type: 'classic' as ResumeTemplate,
      name: '클래식',
      description: '전통적이고 신뢰감 있는 스타일로 모든 업계에 적합',
      preview: '📄',
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      features: ['정형화된 구조', '읽기 쉬운 폰트', '안정적인 인상']
    },
    {
      type: 'creative' as ResumeTemplate,
      name: '크리에이티브',
      description: '창의적이고 독특한 레이아웃으로 디자인 분야에 적합',
      preview: '🎨',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      features: ['독창적인 디자인', '시각적 효과', '개성 표현']
    },
    {
      type: 'minimal' as ResumeTemplate,
      name: '미니멀',
      description: '간단하고 깔끔한 구성으로 핵심 정보에 집중',
      preview: '📋',
      color: 'bg-green-50 border-green-200 text-green-700',
      features: ['여백 활용', '핵심 정보 강조', '깔끔한 인상']
    },
    {
      type: 'professional' as ResumeTemplate,
      name: '프로페셔널',
      description: '비즈니스 환경에 최적화된 공식적인 스타일',
      preview: '💼',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      features: ['공식적인 형식', '비즈니스 적합', '전문성 강조']
    }
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-[28px] font-bold text-slate-900 mb-2">
          이력서 템플릿 선택
        </h2>
        <p className="text-sm text-slate-600">
          나에게 맞는 템플릿을 선택해서 이력서를 작성해보세요
        </p>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.button
            key={template.type}
            onClick={() => onTemplateSelect(template.type)}
            className={`relative p-6 border-2 rounded-lg text-left transition-all hover:shadow-sm ${
              selectedTemplate === template.type
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 선택 표시 */}
            {selectedTemplate === template.type && (
              <motion.div
                className="absolute top-4 right-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle size={24} className="text-blue-600" />
              </motion.div>
            )}

            {/* 템플릿 프리뷰 */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${template.color}`}>
                {template.preview}
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            {/* 특징 */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700">주요 특징</h4>
              <ul className="space-y-1">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* 호버 효과 */}
            <motion.div
              className={`absolute inset-0 rounded-lg pointer-events-none ${
                selectedTemplate === template.type
                  ? 'bg-blue-500 opacity-5'
                  : 'bg-blue-500 opacity-0 hover:opacity-3'
              }`}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-center pt-6">
        <motion.button
          onClick={onNext}
          disabled={!selectedTemplate}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            selectedTemplate
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          whileHover={selectedTemplate ? { scale: 1.02 } : {}}
          whileTap={selectedTemplate ? { scale: 0.98 } : {}}
        >
          다음 단계로
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* 안내 메시지 */}
      <div className="text-center">
        <p className="text-[11px] text-slate-500">
          템플릿은 나중에 변경할 수 있습니다
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;