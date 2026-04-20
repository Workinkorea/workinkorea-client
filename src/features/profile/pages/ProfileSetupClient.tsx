'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Calendar, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import Layout from '@/shared/components/layout/Layout';
import { Input } from '@/shared/ui/Input';
import { profileApi } from '../api/profileApi';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import type { CreateProfileRequest } from '../types/profile.types';

const createProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50글자를 초과할 수 없습니다.'),
  birth_date: z.string().min(1, '생년월일을 입력해주세요.'),
  country_id: z.number().min(1, '국적을 선택해주세요.'),
});

type CreateProfileForm = z.infer<typeof createProfileSchema>;

export function ProfileSetupClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProfileForm>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      name: '',
      birth_date: '',
      country_id: 0,
    },
  });

  const selectedCountryId = watch('country_id');

  const filteredCountries = COUNTRIES_FULL.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const selectedCountry = COUNTRIES_FULL.find((c) => c.id === selectedCountryId);

  const createProfileMutation = useMutation({
    mutationFn: (data: CreateProfileRequest) => profileApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('프로필이 생성되었습니다!');
      router.replace('/user/profile');
    },
    onError: () => {
      toast.error('프로필 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const onSubmit = (data: CreateProfileForm) => {
    createProfileMutation.mutate({
      name: data.name,
      birth_date: data.birth_date,
      country_id: data.country_id,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background-subtle flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-title-2 font-bold text-slate-900 mb-2">
              프로필 정보를 입력해주세요
            </h1>
            <p className="text-body-3 text-slate-500">
              서비스 이용을 위해 기본 정보가 필요합니다.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-caption-1 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  이름
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder="홍길동"
                  error={!!errors.name}
                />
                {errors.name && (
                  <p className="text-caption-2 text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Birth Date */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-caption-1 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  생년월일
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  {...register('birth_date')}
                  error={!!errors.birth_date}
                />
                {errors.birth_date && (
                  <p className="text-caption-2 text-red-500">{errors.birth_date.message}</p>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-caption-1 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  국적
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={
                      showCountryDropdown
                        ? countrySearch
                        : selectedCountry
                          ? selectedCountry.name
                          : ''
                    }
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setShowCountryDropdown(true);
                      if (!e.target.value) setValue('country_id', 0);
                    }}
                    onFocus={() => {
                      setShowCountryDropdown(true);
                      if (selectedCountry) setCountrySearch(selectedCountry.name);
                    }}
                    onBlur={() => {
                      // delay to allow click on dropdown
                      setTimeout(() => setShowCountryDropdown(false), 200);
                    }}
                    placeholder="국가를 검색하세요..."
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-body-3 text-slate-800 placeholder:text-slate-400 bg-white transition-colors outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 ${
                      errors.country_id ? 'border-red-500' : 'border-slate-200'
                    }`}
                  />

                  {showCountryDropdown && countrySearch && (
                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-md">
                      {filteredCountries.length === 0 ? (
                        <div className="px-4 py-3 text-caption-1 text-slate-500">
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        filteredCountries.slice(0, 20).map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            className="w-full text-left px-4 py-2.5 text-body-3 text-slate-800 hover:bg-blue-50 transition-colors cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setValue('country_id', country.id, { shouldValidate: true });
                              setCountrySearch('');
                              setShowCountryDropdown(false);
                            }}
                          >
                            {country.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {selectedCountry && !showCountryDropdown && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-caption-1 rounded-full w-fit">
                    <Globe className="w-3 h-3" />
                    {selectedCountry.name}
                  </div>
                )}

                {errors.country_id && (
                  <p className="text-caption-2 text-red-500">{errors.country_id.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createProfileMutation.isPending}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-body-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-primary flex items-center justify-center gap-2"
              >
                {createProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  '프로필 생성하기'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-caption-1 text-slate-400 mt-4">
            나머지 정보는 프로필 수정에서 입력할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
