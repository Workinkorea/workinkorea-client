'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';
import { useTranslations } from 'next-intl';

interface Session1Data {
  currentLocation: string;
  otherCountry?: string;
  koreanLevel: string;
  visaStatus: string;
}

interface Session1Props {
  initialData: Partial<Session1Data>;
  onNext: (data: Session1Data) => void;
}

export const Session1BasicInfo = ({ initialData, onNext }: Session1Props) => {
  const t = useTranslations('diagnosis.session1');
  const tCommon = useTranslations('diagnosis');

  const { control, handleSubmit, watch } = useForm<Session1Data>({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const currentLocation = watch('currentLocation');

  const COUNTRIES = t.raw('countries') as string[];

  const KOREAN_LEVELS = [
    { value: 'native', label: t('koreanLevels.native') },
    { value: 'topik6', label: t('koreanLevels.topik6') },
    { value: 'topik45', label: t('koreanLevels.topik45') },
    { value: 'topik23', label: t('koreanLevels.topik23') },
    { value: 'topik1', label: t('koreanLevels.topik1') },
  ];

  const VISA_STATUS = [
    { value: 'have', label: t('visaStatus.have') },
    { value: 'need', label: t('visaStatus.need') },
    { value: 'permanent', label: t('visaStatus.permanent') },
    { value: 'unknown', label: t('visaStatus.unknown') },
  ];

  const onSubmit = (data: Session1Data) => {
    onNext(data);
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
        <p className="text-body-2 text-slate-500 mb-6">
          {t('subtitle')}
        </p>
      </div>

      {/* Q1. 현재 위치 */}
      <FormField
        name="currentLocation"
        control={control}
        label={t('q1Label')}
        rules={{ required: t('q1Required') }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
              <input
                type="radio"
                value="korea"
                checked={field.value === 'korea'}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-body-1 text-slate-700">{t('q1Korea')}</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
              <input
                type="radio"
                value="other"
                checked={field.value === 'other'}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-body-2 text-slate-700">{t('q1Other')}</span>
            </label>
          </div>
        )}
      />

      {/* 다른 나라 선택 */}
      {currentLocation === 'other' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <FormField
            name="otherCountry"
            control={control}
            label={t('otherCountryLabel')}
            rules={{ required: t('otherCountryRequired') }}
            variant="diagnosis"
            render={(field, fieldId) => (
              <select
                {...field}
                id={fieldId}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">{t('selectPlaceholder')}</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            )}
          />
        </motion.div>
      )}

      {/* Q2. 한국어 레벨 */}
      <FormField
        name="koreanLevel"
        control={control}
        label={t('q2Label')}
        rules={{ required: t('q2Required') }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            {KOREAN_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === level.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  value={level.value}
                  checked={field.value === level.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-body-2 text-slate-700">{level.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q3. 비자 상태 */}
      <FormField
        name="visaStatus"
        control={control}
        label={t('q3Label')}
        rules={{ required: t('q3Required') }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            {VISA_STATUS.map((visa) => (
              <label
                key={visa.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === visa.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  value={visa.value}
                  checked={field.value === visa.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-body-2 text-slate-700">{visa.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* 다음 버튼 */}
      <motion.button
        type="submit"
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {tCommon('next')}
      </motion.button>
    </motion.form>
  );
};
