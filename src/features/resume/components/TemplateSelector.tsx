'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('resume.template');

  const templates = [
    {
      type: 'modern' as ResumeTemplate,
      name: t('modernName'),
      description: t('modernDesc'),
      preview: '📝',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      features: [t('modernF1'), t('modernF2'), t('modernF3')],
    },
    {
      type: 'classic' as ResumeTemplate,
      name: t('classicName'),
      description: t('classicDesc'),
      preview: '📄',
      color: 'bg-slate-50 border-slate-200 text-slate-700',
      features: [t('classicF1'), t('classicF2'), t('classicF3')],
    },
    {
      type: 'creative' as ResumeTemplate,
      name: t('creativeName'),
      description: t('creativeDesc'),
      preview: '🎨',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      features: [t('creativeF1'), t('creativeF2'), t('creativeF3')],
    },
    {
      type: 'minimal' as ResumeTemplate,
      name: t('minimalName'),
      description: t('minimalDesc'),
      preview: '📋',
      color: 'bg-green-50 border-green-200 text-green-700',
      features: [t('minimalF1'), t('minimalF2'), t('minimalF3')],
    },
    {
      type: 'professional' as ResumeTemplate,
      name: t('professionalName'),
      description: t('professionalDesc'),
      preview: '💼',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      features: [t('professionalF1'), t('professionalF2'), t('professionalF3')],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-title-2 font-bold text-slate-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-body-3 text-slate-600">
          {t('subtitle')}
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
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-title-3 ${template.color}`}>
                {template.preview}
              </div>
              <div className="flex-1">
                <h3 className="text-body-2 font-semibold text-slate-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-caption-2 text-slate-600 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            {/* 특징 */}
            <div className="space-y-2">
              <h4 className="text-caption-2 font-semibold text-slate-700">{t('featuresLabel')}</h4>
              <ul className="space-y-1">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="text-caption-3 text-slate-600 flex items-center gap-2">
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
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-body-3 font-medium transition-all ${
            selectedTemplate
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          style={{ color: selectedTemplate ? '#ffffff' : undefined }}
          whileHover={selectedTemplate ? { scale: 1.02 } : {}}
          whileTap={selectedTemplate ? { scale: 0.98 } : {}}
        >
          {t('nextBtn')}
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* 안내 메시지 */}
      <div className="text-center">
        <p className="text-caption-3 text-slate-500">
          {t('changeHint')}
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;