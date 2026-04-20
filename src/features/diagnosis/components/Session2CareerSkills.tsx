'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

export const Session2CareerSkills = ({ initialData, onNext, onBack }: Session2Props) => {
  const t = useTranslations('diagnosis.session2');
  const tCommon = useTranslations('diagnosis');

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

  const WORK_EXPERIENCE = [
    { value: 'less1', label: t('workExperience.less1') },
    { value: '1-3', label: t('workExperience.1-3') },
    { value: '3-5', label: t('workExperience.3-5') },
    { value: '5-10', label: t('workExperience.5-10') },
    { value: '10plus', label: t('workExperience.10plus') },
  ];

  const JOB_FIELDS = [
    { value: 'it', label: t('jobFields.it') },
    { value: 'marketing', label: t('jobFields.marketing') },
    { value: 'design', label: t('jobFields.design') },
    { value: 'education', label: t('jobFields.education') },
    { value: 'manufacturing', label: t('jobFields.manufacturing') },
    { value: 'service', label: t('jobFields.service') },
    { value: 'other', label: t('jobFields.other') },
  ];

  const EDUCATION = [
    { value: 'phd', label: t('education.phd') },
    { value: 'master', label: t('education.master') },
    { value: 'bachelor', label: t('education.bachelor') },
    { value: 'associate', label: t('education.associate') },
    { value: 'highschool', label: t('education.highschool') },
    { value: 'other', label: t('education.other') },
  ];

  const AVAILABLE_LANGUAGES = t.raw('languages') as string[];

  const LANGUAGE_LEVELS = [
    { value: 'native', label: t('languageLevels.native') },
    { value: 'business', label: t('languageLevels.business') },
    { value: 'intermediate', label: t('languageLevels.intermediate') },
    { value: 'beginner', label: t('languageLevels.beginner') },
  ];

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
        <h2 className="text-title-4 font-bold text-slate-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-body-3 text-slate-500 mb-6">
          {t('subtitle')}
        </p>
      </div>

      {/* Q4. 경력 */}
      <FormField
        variant="diagnosis"
        name="workExperience"
        control={control}
        label={t('q4Label')}
        rules={{ required: t('q4Required') }}
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
                <span className="text-body-3 text-slate-700">{exp.label}</span>
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
        label={t('q5Label')}
        rules={{ required: t('q5Required') }}
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
                <span className="text-body-3 text-slate-700">{job.label}</span>
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
        label={t('q6Label')}
        rules={{ required: t('q6Required') }}
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
                <span className="text-body-3 text-slate-700">{edu.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q7. 언어 */}
      <div>
        <label className="text-slate-900 text-title-4 font-semibold mb-2 block">
          {t('q7Label')}
        </label>
        <p className="text-body-3 text-slate-500 mb-4">{t('q7Multiple')}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
            >
              <span className="text-body-3 font-medium">{lang.language}</span>
              <span className="text-caption-3">
                ({LANGUAGE_LEVELS.find(l => l.value === lang.level)?.label})
              </span>
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="ml-1 hover:text-blue-900 cursor-pointer"
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
          {t('addLanguage')}
        </motion.button>

        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 border-2 border-blue-300 rounded-lg bg-blue-50"
          >
            <h3 className="text-body-1 font-semibold text-slate-900 mb-4">{t('languageModalTitle')}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-caption-2 text-slate-400 mb-2 block">{t('languageLabel')}</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-body-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('selectPlaceholder')}</option>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                  <option value={t('otherOption')}>{t('otherOption')}</option>
                </select>
              </div>
              <div>
                <label className="text-caption-2 text-slate-400 mb-2 block">{t('levelLabel')}</label>
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
                      <span className="text-body-3 text-slate-700">{level.label}</span>
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
                  {t('addButton')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowLanguageModal(false);
                    setNewLanguage('');
                    setNewLanguageLevel('');
                  }}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cancelButton')}
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
          className="flex-1 py-4 bg-slate-100 hover:bg-slate-300 text-slate-700 font-semibold text-body-1 rounded-lg transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tCommon('back')}
        </motion.button>
        <motion.button
          type="submit"
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-body-1 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tCommon('next')}
        </motion.button>
      </div>
    </motion.form>
  );
};
