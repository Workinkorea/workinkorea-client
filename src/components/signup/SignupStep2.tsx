'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { SelectSearchInput } from '@/components/ui/SelectSearchInput';
import { COUNTRIES } from '@/constants/countries';

export default function SignupStep2() {
  const router = useRouter();
  
  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: '',
      birth: '',
      country: '',
    }
  });

  const onSubmit = async (data: any) => {
    console.log('Form data:', data);
    // TODO: API 호출
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[400px] w-full space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-title-2 text-label-900 mb-8">
            개인 회원가입
          </h1>
        </motion.div>

        <motion.form 
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <FormField
              name="name"
              control={control}
              label="이름 (영문)"
              render={(field, fieldId) => (
                <input
                  {...field}
                  id={fieldId}
                  type="text"
                  value={field.value || ''}
                  placeholder="Hong Gildong"
                  className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            />

            <FormField
              name="birth"
              control={control}
              label="생년월일"
              render={(field, fieldId) => (
                <input
                  {...field}
                  id={fieldId}
                  type="text"
                  value={field.value || ''}
                  placeholder="YYYYMMDD"
                  maxLength={8}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                  className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            />

            <FormField
              name="country"
              control={control}
              label="국적"
              render={(field) => (
                <SelectSearchInput
                  options={COUNTRIES}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="국적을 선택하세요"
                />
              )}
            />
          </motion.div>

          <motion.div className="space-y-3 mt-6">
            <motion.button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-primary-300 text-white hover:bg-primary-400 cursor-pointer transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              회원가입
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}