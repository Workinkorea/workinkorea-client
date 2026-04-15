'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';

interface Session3Data {
  desiredSalary: string;
  employmentType: string;
  companySize: string;
  startDate: string;
}

interface Session3Props {
  initialData: Partial<Session3Data>;
  onNext: (data: Session3Data) => void;
  onBack: () => void;
}

const SALARY_RANGES = [
  { value: 'under30', label: '3천만원 미만' },
  { value: '30-40', label: '3천만원~4천만원' },
  { value: '40-50', label: '4천만원~5천만원' },
  { value: '50-70', label: '5천만원~7천만원' },
  { value: 'over70', label: '7천만원 이상' },
];

const EMPLOYMENT_TYPES = [
  { value: 'fulltime', label: '안정적인 정규직이 좋아요' },
  { value: 'contract', label: '계약직도 괜찮아요' },
  { value: 'freelance', label: '자유롭게 프리랜서로 일하고 싶어요' },
  { value: 'parttime', label: '파트타임으로 시작하고 싶어요' },
  { value: 'intern', label: '일단 인턴으로 경험을 쌓고 싶어요' },
];

const COMPANY_SIZES = [
  { value: 'large', label: '안정적인 대기업', emoji: '🏢' },
  { value: 'medium', label: '탄탄한 중견기업', emoji: '🏭' },
  { value: 'startup', label: '역동적인 스타트업', emoji: '🚀' },
  { value: 'small', label: '아담한 중소기업', emoji: '🏪' },
  { value: 'any', label: '회사 규모는 중요하지 않아요', emoji: '✨' },
];

const START_DATES = [
  { value: 'immediate', label: '당장 내일이라도!' },
  { value: '1-3months', label: '1~3개월 안에' },
  { value: '3-6months', label: '3~6개월 정도 후에' },
  { value: 'after6months', label: '6개월 이후에' },
  { value: 'undecided', label: '아직 정하지 못했어요' },
];

export const Session3Preferences = ({ initialData, onNext, onBack }: Session3Props) => {
  const { control, handleSubmit } = useForm<Session3Data>({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const onSubmit = (data: Session3Data) => {
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
        <h2 className="text-title-4 font-bold text-label-900 mb-2">
          취업 선호도 💡
        </h2>
        <p className="text-body-3 text-label-500 mb-6">
          당신이 원하는 조건을 알려주세요
        </p>
      </div>

      {/* Q8. 희망 연봉 */}
      <FormField
        variant="diagnosis"
        name="desiredSalary"
        control={control}
        label="Q8. 원하시는 연봉 수준은 어느 정도인가요? 💰"
        rules={{ required: '희망 연봉을 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {SALARY_RANGES.map((salary) => (
              <label
                key={salary.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === salary.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={salary.value}
                  checked={field.value === salary.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-3 text-label-700">{salary.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q9. 고용 형태 */}
      <FormField
        variant="diagnosis"
        name="employmentType"
        control={control}
        label="Q9. 어떤 방식으로 일하고 싶으세요? 🏢"
        rules={{ required: '고용 형태를 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {EMPLOYMENT_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === type.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  checked={field.value === type.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-3 text-label-700">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q10. 회사 규모 */}
      <FormField
        variant="diagnosis"
        name="companySize"
        control={control}
        label="Q10. 어떤 회사가 마음에 드시나요? 🏭"
        rules={{ required: '회사 규모를 선택해주세요.' }}
        render={(field) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMPANY_SIZES.map((size) => (
              <label
                key={size.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === size.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={size.value}
                  checked={field.value === size.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-title-4">{size.emoji}</span>
                  <span className="text-body-3 text-label-700">{size.label}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q11. 시작 시기 */}
      <FormField
        variant="diagnosis"
        name="startDate"
        control={control}
        label="Q11. 언제부터 일을 시작하고 싶으세요? 📅"
        rules={{ required: '시작 시기를 선택해주세요.' }}
        render={(field) => (
          <div className="space-y-3">
            {START_DATES.map((date) => (
              <label
                key={date.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === date.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={date.value}
                  checked={field.value === date.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-3 text-label-700">{date.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* 버튼 */}
      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-label-100 hover:bg-label-300 text-label-700 font-semibold text-body-1 rounded-lg transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          이전
        </motion.button>
        <motion.button
          type="submit"
          className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-body-1 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          다음
        </motion.button>
      </div>
    </motion.form>
  );
};
