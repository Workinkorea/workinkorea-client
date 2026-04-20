'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';
import { useState } from 'react';

interface Session4Data {
  challenges: string[];
  email?: string;
  receiveInfo: boolean;
}

interface Session4Props {
  initialData: Partial<Session4Data>;
  onNext: (data: Session4Data) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  prefillEmail?: string;
}

const CHALLENGES = [
  { value: 'visa', label: '비자나 법적인 문제들', emoji: '📋' },
  { value: 'language', label: '한국어가 어려워요', emoji: '🗣️' },
  { value: 'job-search', label: '어디서 채용 정보를 찾아야 할지 모르겠어요', emoji: '🔍' },
  { value: 'culture', label: '한국 회사 문화가 걱정돼요', emoji: '🏢' },
  { value: 'recognition', label: '제 경력이나 학위를 인정받을 수 있을지 불안해요', emoji: '🎓' },
  { value: 'network', label: '아는 사람이 없어요', emoji: '👥' },
];

export const Session4Matching = ({ initialData, onNext, onBack, isSubmitting = false, prefillEmail }: Session4Props) => {
  const { control, handleSubmit, watch, setValue } = useForm<Session4Data>({
    defaultValues: {
      ...initialData,
      challenges: initialData.challenges || [],
      email: initialData.email || prefillEmail || '',
      receiveInfo: initialData.receiveInfo || false,
    },
    mode: 'onChange',
  });

  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(
    initialData.challenges || []
  );

  const receiveInfo = watch('receiveInfo');

  const toggleChallenge = (value: string) => {
    const updated = selectedChallenges.includes(value)
      ? selectedChallenges.filter((c) => c !== value)
      : [...selectedChallenges, value];
    setSelectedChallenges(updated);
    setValue('challenges', updated);
  };

  const onSubmit = (data: Session4Data) => {
    onNext({ ...data, challenges: selectedChallenges });
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
          마지막 단계 🎯
        </h2>
        <p className="text-body-3 text-label-500 mb-6">
          조금만 더 알려주시면 맞춤 정보를 드릴 수 있어요
        </p>
      </div>

      {/* Q12. 어려운 점 */}
      <div>
        <label className="text-label-900 text-title-4 font-semibold mb-2 block">
          Q12. 한국 취업, 어떤 부분이 가장 막막하신가요? 😓
          <span className="text-status-error ml-1">*</span>
        </label>
        <p className="text-body-3 text-label-500 mb-4">여러 개 선택 가능</p>

        <div className="space-y-3">
          {CHALLENGES.map((challenge) => (
            <label
              key={challenge.value}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedChallenges.includes(challenge.value)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-line-400 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedChallenges.includes(challenge.value)}
                onChange={() => toggleChallenge(challenge.value)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
              />
              <div className="flex items-center gap-2">
                <span className="text-title-4">{challenge.emoji}</span>
                <span className="text-body-3 text-label-700">{challenge.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Q13. 이메일 */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
        <h3 className="text-body-1 font-semibold text-label-900 mb-2">
          Q13. 결과를 이메일로 받아보시겠어요? 📧
        </h3>
        <p className="text-body-3 text-label-600 mb-4">
          당신에게 딱 맞는 채용 정보와 맞춤 진단 결과를 보내드릴게요!
        </p>

        <FormField
        variant="diagnosis"
          name="email"
          control={control}
          label="이메일 주소"
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 주소를 입력해주세요.',
            },
          }}
          render={(field, fieldId) => (
            <input
              {...field}
              id={fieldId}
              type="email"
              placeholder="example@email.com"
              className="w-full border-2 border-line-400 rounded-lg px-4 py-3 text-body-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )}
        />

        <label className="flex items-center gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={receiveInfo}
            onChange={(e) => setValue('receiveInfo', e.target.checked)}
            className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
          />
          <span className="text-body-3 text-label-700">
            취업 정보 및 혜택 받기 (선택)
          </span>
        </label>
      </div>

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
          disabled={selectedChallenges.length === 0 || isSubmitting}
          className={`flex-1 py-4 font-semibold text-body-1 rounded-lg transition-all shadow-sm hover:shadow-md ${
            selectedChallenges.length === 0 || isSubmitting
              ? 'bg-label-300 text-label-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
          }`}
          whileHover={selectedChallenges.length > 0 && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={selectedChallenges.length > 0 && !isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? '제출 중...' : '결과 보기'}
        </motion.button>
      </div>
    </motion.form>
  );
};
