'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';
import { useState } from 'react';
import { X } from 'lucide-react';

interface Session2Data {
  workExperience: string;
  jobField: string;
  education: string;
  languages: Array<{
    language: string;
    level: string;
  }>;
}

interface Session2Props {
  initialData: Partial<Session2Data>;
  onNext: (data: Session2Data) => void;
  onBack: () => void;
}

const WORK_EXPERIENCE = [
  { value: 'less1', label: '이제 막 시작했어요 (1년 미만)' },
  { value: '1-3', label: '1~3년 정도요' },
  { value: '3-5', label: '3~5년 정도요' },
  { value: '5-10', label: '꽤 오래 했어요 (5~10년)' },
  { value: '10plus', label: '베테랑이에요 (10년 이상)' },
];

const JOB_FIELDS = [
  { value: 'it', label: 'IT/개발 (코딩, 프로그래밍)' },
  { value: 'marketing', label: '마케팅/영업 (세일즈, 홍보)' },
  { value: 'design', label: '디자인/크리에이티브' },
  { value: 'education', label: '교육/강의' },
  { value: 'manufacturing', label: '제조/엔지니어링' },
  { value: 'service', label: '서비스/호스피탈리티' },
  { value: 'other', label: '그 외 다른 분야' },
];

const EDUCATION = [
  { value: 'phd', label: '박사 학위' },
  { value: 'master', label: '석사 학위' },
  { value: 'bachelor', label: '학사 학위 (4년제 대학)' },
  { value: 'associate', label: '전문학사 (2-3년제)' },
  { value: 'highschool', label: '고등학교 졸업' },
  { value: 'other', label: '기타' },
];

const AVAILABLE_LANGUAGES = [
  '영어', '중국어', '일본어', '스페인어', '프랑스어',
  '베트남어', '태국어', '독일어', '러시아어', '아랍어'
];

const LANGUAGE_LEVELS = [
  { value: 'native', label: '원어민 수준' },
  { value: 'business', label: '비즈니스 레벨 (유창)' },
  { value: 'intermediate', label: '중급 (업무 가능)' },
  { value: 'beginner', label: '초급 (기본 회화)' },
];

export const Session2CareerSkills = ({ initialData, onNext, onBack }: Session2Props) => {
  const { control, handleSubmit, setValue } = useForm<Session2Data>({
    defaultValues: {
      ...initialData,
      languages: initialData.languages || [],
    },
    mode: 'onChange',
  });

  const [selectedLanguages, setSelectedLanguages] = useState<Array<{ language: string; level: string }>>(
    initialData.languages || []
  );
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('');

  const addLanguage = () => {
    if (newLanguage && newLanguageLevel) {
      const updated = [...selectedLanguages, { language: newLanguage, level: newLanguageLevel }];
      setSelectedLanguages(updated);
      setValue('languages', updated);
      setNewLanguage('');
      setNewLanguageLevel('');
      setShowLanguageModal(false);
    }
  };

  const removeLanguage = (index: number) => {
    const updated = selectedLanguages.filter((_, i) => i !== index);
    setSelectedLanguages(updated);
    setValue('languages', updated);
  };

  const onSubmit = (data: Session2Data) => {
    onNext({ ...data, languages: selectedLanguages });
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          경력 및 스킬 💼
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          당신의 경험을 알려주세요
        </p>
      </div>

      {/* Q4. 경력 */}
      <FormField
        variant="diagnosis"
        name="workExperience"
        control={control}
        label="Q4. 일한 경험은 얼마나 되시나요?"
        rules={{ required: '경력을 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {WORK_EXPERIENCE.map((exp) => (
              <label
                key={exp.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === exp.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  value={exp.value}
                  checked={field.value === exp.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{exp.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q5. 직무 분야 */}
      <FormField
        variant="diagnosis"
        name="jobField"
        control={control}
        label="Q5. 어떤 일을 가장 잘하시나요? ⭐"
        rules={{ required: '직무 분야를 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {JOB_FIELDS.map((job) => (
              <label
                key={job.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === job.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  value={job.value}
                  checked={field.value === job.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{job.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q6. 학력 */}
      <FormField
        variant="diagnosis"
        name="education"
        control={control}
        label="Q6. 최종 학력을 알려주세요 🎓"
        rules={{ required: '학력을 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {EDUCATION.map((edu) => (
              <label
                key={edu.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === edu.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  value={edu.value}
                  checked={field.value === edu.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{edu.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q7. 언어 */}
      <div>
        <label className="text-slate-900 text-xl font-semibold mb-2 block">
          Q7. 어떤 언어를 사용하실 수 있나요? 🗣️
        </label>
        <p className="text-sm text-slate-500 mb-4">여러 개 선택 가능</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
            >
              <span className="text-sm font-medium">{lang.language}</span>
              <span className="text-[11px]">
                ({LANGUAGE_LEVELS.find(l => l.value === lang.level)?.label})
              </span>
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="ml-1 hover:text-blue-900"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => setShowLanguageModal(true)}
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + 언어 추가
        </motion.button>

        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 border-2 border-blue-300 rounded-lg bg-blue-50"
          >
            <h3 className="text-base font-semibold text-slate-900 mb-4">언어 선택</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">언어</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">선택해주세요</option>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">레벨</label>
                <div className="space-y-2">
                  {LANGUAGE_LEVELS.map((level) => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={level.value}
                        checked={newLanguageLevel === level.value}
                        onChange={(e) => setNewLanguageLevel(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={addLanguage}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  추가
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowLanguageModal(false);
                    setNewLanguage('');
                    setNewLanguageLevel('');
                  }}
                  className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  취소
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-base rounded-lg transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          이전
        </motion.button>
        <motion.button
          type="submit"
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          다음
        </motion.button>
      </div>
    </motion.form>
  );
};
