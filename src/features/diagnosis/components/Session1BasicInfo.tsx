'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';

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

const COUNTRIES = [
  '미국', '중국', '일본', '베트남', '필리핀', '태국', '인도네시아',
  '몽골', '우즈베키스탄', '네팔', '캄보디아', '미얀마', '방글라데시',
  '영국', '프랑스', '독일', '러시아', '호주', '캐나다', '기타'
];

const KOREAN_LEVELS = [
  { value: 'native', label: '원어민처럼 자유롭게 해요' },
  { value: 'topik6', label: '비즈니스 대화도 문제없어요 (TOPIK 6급)' },
  { value: 'topik45', label: '일상 대화는 할 수 있어요 (TOPIK 4-5급)' },
  { value: 'topik23', label: '기본적인 회화 정도 가능해요 (TOPIK 2-3급)' },
  { value: 'topik1', label: '아직 공부 중이에요 (TOPIK 1급 이하)' },
];

const VISA_STATUS = [
  { value: 'have', label: '네, 이미 취업 비자가 있어요' },
  { value: 'need', label: '아니요, 회사의 비자 지원이 필요해요' },
  { value: 'permanent', label: '비자 걱정 없어요 (영주권, F비자 등)' },
  { value: 'unknown', label: '잘 모르겠어요' },
];

export const Session1BasicInfo = ({ initialData, onNext }: Session1Props) => {
  const { control, handleSubmit, watch } = useForm<Session1Data>({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const currentLocation = watch('currentLocation');

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
        <h2 className="text-title-3 font-bold text-label-900 mb-2">
          기본 정보 🌍
        </h2>
        <p className="text-body-2 text-label-500 mb-6">
          당신에 대해 알려주세요
        </p>
      </div>

      {/* Q1. 현재 위치 */}
      <FormField
        name="currentLocation"
        control={control}
        label="Q1. 지금 어디에 계신가요?"
        rules={{ required: '현재 위치를 선택해주세요.' }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-line-400 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
              <input
                type="radio"
                value="korea"
                checked={field.value === 'korea'}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-body-2 text-label-700">한국에서 생활 중이에요</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-line-400 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
              <input
                type="radio"
                value="other"
                checked={field.value === 'other'}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-body-2 text-label-700">다른 나라에 있어요</span>
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
            label="어느 나라에 계신가요?"
            rules={{ required: '나라를 선택해주세요.' }}
            variant="diagnosis"
            render={(field, fieldId) => (
              <select
                {...field}
                id={fieldId}
                className="w-full border-2 border-line-400 rounded-lg px-4 py-3 text-body-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="">선택해주세요</option>
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
        label="Q2. 한국어는 얼마나 하실 수 있나요? 🗣️"
        rules={{ required: '한국어 레벨을 선택해주세요.' }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            {KOREAN_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === level.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={level.value}
                  checked={field.value === level.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-2 text-label-700">{level.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Q3. 비자 상태 */}
      <FormField
        name="visaStatus"
        control={control}
        label="Q3. 한국에서 일할 수 있는 비자가 있으신가요? 📋"
        rules={{ required: '비자 상태를 선택해주세요.' }}
        variant="diagnosis"
        render={(field) => (
          <div className="space-y-3">
            {VISA_STATUS.map((visa) => (
              <label
                key={visa.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === visa.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <input
                  type="radio"
                  value={visa.value}
                  checked={field.value === visa.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-2 text-label-700">{visa.label}</span>
              </label>
            ))}
          </div>
        )}
      />

      {/* 다음 버튼 */}
      <motion.button
        type="submit"
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-body-1 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        다음
      </motion.button>
    </motion.form>
  );
};
