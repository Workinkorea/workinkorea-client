'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Layout from '@/shared/components/layout/Layout';
import { FormField } from '@/shared/ui/FormField';
import { useTranslations } from 'next-intl';

interface SelfDiagnosisFormData {
  gender: 'male' | 'female' | '';
  koreanLevel: string;
  desiredSalary: string;
}

const SelfDiagnosisClient = () => {
  const router = useRouter();
  const t = useTranslations('diagnosis.selfDiagnosis');

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SelfDiagnosisFormData>({
    mode: 'onChange',
    defaultValues: {
      gender: '',
      koreanLevel: '',
      desiredSalary: '',
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (_data: SelfDiagnosisFormData) => {
    try {
      toast.success(t('toastSuccess'));
      // TODO: API 호출 및 결과 페이지로 이동
      router.push('/');
    } catch (error) {
      toast.error(t('toastError'));
    }
  };

  const koreanLevels = [
    { value: '1', description: t('koreanLevel1') },
    { value: '2', description: t('koreanLevel2') },
    { value: '3', description: t('koreanLevel3') },
    { value: '4', description: t('koreanLevel4') },
    { value: '5', description: t('koreanLevel5') },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white py-12">
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-title-4 md:text-title-2 font-bold text-slate-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* 성별 선택 */}
              <FormField
                name="gender"
                control={control}
                label={t('genderLabel')}
                rules={{ required: t('genderRequired') }}
                render={(field) => (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="male"
                        checked={field.value === 'male'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{t('male')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        checked={field.value === 'female'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">{t('female')}</span>
                    </label>
                  </div>
                )}
              />

              {/* 한국어 레벨 선택 */}
              <FormField
                name="koreanLevel"
                control={control}
                label={t('koreanLevelLabel')}
                rules={{ required: t('koreanLevelRequired') }}
                render={(field) => (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {koreanLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => field.onChange(level.value)}
                          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all border-2 cursor-pointer ${
                            field.value === level.value
                              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {level.description}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />

              {/* 받고싶은 연봉 */}
              <FormField
                name="desiredSalary"
                control={control}
                label={t('salaryLabel')}
                rules={{
                  required: t('salaryRequired'),
                  pattern: {
                    value: /^\d+$/,
                    message: t('salaryPattern'),
                  },
                  min: {
                    value: 1,
                    message: t('salaryMin'),
                  }
                }}
                render={(field, fieldId) => (
                  <div className="flex items-center border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      placeholder={t('salaryPlaceholder')}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent outline-none"
                    />
                    <span className="pr-4 text-sm text-slate-500 shrink-0">{t('salaryUnit')}</span>
                  </div>
                )}
              />

              {/* 제출 버튼 */}
              <motion.button
                type="submit"
                disabled={!isValid}
                className={`w-full py-4 rounded-lg font-semibold text-base transition-all ${
                  isValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                whileTap={isValid ? { scale: 0.98 } : {}}
              >
                {t('submitButton')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SelfDiagnosisClient;
