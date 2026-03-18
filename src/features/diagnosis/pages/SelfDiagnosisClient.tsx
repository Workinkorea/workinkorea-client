'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Layout from '@/shared/components/layout/Layout';
import { FormField } from '@/shared/ui/FormField';

interface SelfDiagnosisFormData {
  gender: 'male' | 'female' | '';
  koreanLevel: string;
  desiredSalary: string;
}

const SelfDiagnosisClient = () => {
  const router = useRouter();
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
      toast.success('자가진단이 완료되었습니다!');
      // TODO: API 호출 및 결과 페이지로 이동
      router.push('/');
    } catch (error) {
      toast.error('자가진단 제출 중 오류가 발생했습니다.');
    }
  };

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
              자가진단
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              아래 정보를 입력하시면 맞춤형 직업 정보를 제공해드립니다.
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
                label="성별"
                rules={{ required: '성별을 선택해주세요.' }}
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
                      <span className="text-sm text-slate-700">남성</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        checked={field.value === 'female'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700">여성</span>
                    </label>
                  </div>
                )}
              />

              {/* 한국어 레벨 선택 */}
              <FormField
                name="koreanLevel"
                control={control}
                label="한국어 레벨"
                rules={{ required: '한국어 레벨을 선택해주세요.' }}
                render={(field) => (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: '1', description: '한글 자모 및 간단한 인사' },
                        { value: '2', description: '일상적인 대화 가능' },
                        { value: '3', description: '업무 관련 대화 가능' },
                        { value: '4', description: '전문적인 업무 수행 가능' },
                        { value: '5', description: '원어민 수준' },
                      ].map((level) => (
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
                label="희망 연봉 (만원)"
                rules={{
                  required: '희망 연봉을 입력해주세요.',
                  pattern: {
                    value: /^\d+$/,
                    message: '숫자만 입력해주세요.'
                  },
                  min: {
                    value: 1,
                    message: '1 이상의 값을 입력해주세요.'
                  }
                }}
                render={(field, fieldId) => (
                  <div className="flex items-center border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      placeholder="ex: 3000"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent outline-none"
                    />
                    <span className="pr-4 text-sm text-slate-500 shrink-0">만원</span>
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
                기본정보 입력 완료
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SelfDiagnosisClient;
