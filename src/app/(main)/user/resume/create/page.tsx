'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeEditor from '@/features/resume/components/ResumeEditor';
import { ResumeTemplate } from '@/features/user/types/user';

function CreateResumePage() {
  const [currentStep] = useState<'template' | 'editor'>('editor');
  const [selectedTemplate] = useState<ResumeTemplate>('modern');

  return (
    <div className="space-y-6">
      {/* 진행 단계 표시 */}
      {/* <div className="flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${
            currentStep === 'template' ? 'text-blue-600' : 'text-green-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption-1 font-semibold ${
              currentStep === 'template'
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'
            }`}>
              1
            </div>
            <span className="text-body-3 font-medium">템플릿 선택</span>
          </div>

          <div className={`w-8 h-0.5 ${
            currentStep === 'editor' ? 'bg-blue-500' : 'bg-slate-200'
          }`} />

          <div className={`flex items-center gap-2 ${
            currentStep === 'editor' ? 'text-blue-600' : 'text-slate-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption-1 font-semibold ${
              currentStep === 'editor'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-400'
            }`}>
              2
            </div>
            <span className="text-body-3 font-medium">내용 작성</span>
          </div>
        </div>
      </div> */}

      {/* 단계별 컨텐츠 */}
      <AnimatePresence mode="wait">
        {/* {currentStep === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onNext={handleNext}
            />
          </motion.div>
        )} */}

        {currentStep === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ResumeEditor
              templateType={selectedTemplate}
              isEditMode={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateResumePage;