'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, UserCircle, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileApi } from '../api/profileCompany';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyProfileRequest } from '@/shared/types/api';
import toast from 'react-hot-toast';
import { formatPhoneByType } from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';
import { validateCompanyProfileField, validateCompanyProfileForm } from '../validations/companyProfileValidation';
import { CompanyInfoSection } from '@/features/company/components/CompanyInfoSection';
import { ContactPersonSection } from '@/features/company/components/ContactPersonSection';
import { cn } from '@/shared/lib/utils/utils';

const CompanyProfileEditClient = () => {
  const t = useTranslations('company.profile.edit');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoading: authLoading } = useAuth();

  // 완성도 체크 항목 (inside component to use t())
  type RequiredField = { key: keyof CompanyProfileRequest; label: string; section: 'info' | 'contact' };
  const REQUIRED_FIELDS: RequiredField[] = [
    { key: 'industry_type',       label: t('fields.requiredLabels.industryType'),       section: 'info' },
    { key: 'company_type',        label: t('fields.requiredLabels.companyType'),         section: 'info' },
    { key: 'employee_count',      label: t('fields.requiredLabels.employeeCount'),       section: 'info' },
    { key: 'establishment_date',  label: t('fields.requiredLabels.establishmentDate'),   section: 'info' },
    { key: 'address',             label: t('fields.requiredLabels.address'),             section: 'info' },
    { key: 'email',               label: t('fields.requiredLabels.email'),               section: 'contact' },
    { key: 'phone_number',        label: t('fields.requiredLabels.phoneNumber'),         section: 'contact' },
  ];

  const [formData, setFormData] = useState<CompanyProfileRequest>({
    industry_type: '',
    employee_count: 0,
    establishment_date: '',
    company_type: '',
    insurance: '',
    phone_number: '',
    address: '',
    website_url: '',
    email: '',
  });

  const [originalData, setOriginalData] = useState<CompanyProfileRequest | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany(),
  });

  useEffect(() => {
    if (profile) {
      const data: CompanyProfileRequest = {
        industry_type: profile.industry_type || '',
        employee_count: profile.employee_count || 0,
        establishment_date: profile.establishment_date || '',
        company_type: profile.company_type || '',
        insurance: profile.insurance || '',
        phone_number: String(profile.phone_number || ''),
        address: profile.address || '',
        website_url: profile.website_url || '',
        email: profile.email || '',
      };

      setFormData(data);
      setOriginalData(data);
    }
  }, [profile]);

  const hasChanges = useMemo(() => {
    if (!originalData) {
      return Object.values(formData).some((v) => v !== '' && v !== 0);
    }
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  // 완성도 계산
  const { filledCount, progress } = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter(({ key }) => {
      const val = formData[key];
      return val !== '' && val !== 0 && val !== null && val !== undefined;
    }).length;
    return { filledCount: filled, progress: Math.round((filled / REQUIRED_FIELDS.length) * 100) };
  }, [formData]);

  const infoFields  = REQUIRED_FIELDS.filter((f) => f.section === 'info');
  const contactFields = REQUIRED_FIELDS.filter((f) => f.section === 'contact');

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) =>
      profile ? profileApi.updateProfileCompany(data) : profileApi.createProfileCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      toast.success(profile ? t('updateSuccess') : t('createSuccess'));
      setTimeout(() => router.push('/company'), 1000);
    },
    onError: (error: unknown) => {
      logError(error, 'CompanyProfileEditClient.updateProfile');
      toast.error(extractErrorMessage(error, t('updateError')));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (name === 'phone_number') {
      processedValue = formatPhoneByType(value, 'MOBILE');
    } else if (name === 'employee_count') {
      processedValue = value ? Number(value) : 0;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (touchedFields[name]) {
      const error = validateCompanyProfileField(name, processedValue, {
        ...formData,
        [name]: processedValue,
      } as CompanyProfileRequest);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const val =
      name === 'employee_count'
        ? formData[name as keyof CompanyProfileRequest]
        : e.target.value;
    const error = validateCompanyProfileField(name, val as string | number, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateCompanyProfileForm(formData);
    setErrors(newErrors);
    setTouchedFields(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    );

    if (Object.keys(newErrors).length > 0) {
      toast.error(t('validationError'));
      return;
    }
    if (!hasChanges) {
      toast.error(t('noChanges'));
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  if (authLoading || (profileLoading && !profile)) {
    return (
      <Layout>
        <main className="flex-1 bg-background-alternative flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 bg-background-alternative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 페이지 헤더 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('subtitle')}</p>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">

            {/* ─── 좌측: 폼 ─── */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* 기업 정보 섹션 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-blue-600" />
                  </span>
                  <div>
                    <h2 className="text-body-2 font-bold text-slate-900">{t('sectionInfo')}</h2>
                    <p className="text-caption-3 text-slate-400 mt-0.5">{t('sectionInfoHint')}</p>
                  </div>
                </div>
                <CompanyInfoSection
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  today={today}
                />
              </div>

              {/* 담당자 정보 섹션 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <UserCircle size={16} className="text-blue-600" />
                  </span>
                  <div>
                    <h2 className="text-body-2 font-bold text-slate-900">{t('sectionContact')}</h2>
                    <p className="text-caption-3 text-slate-400 mt-0.5">{t('sectionContactHint')}</p>
                  </div>
                </div>
                <ContactPersonSection
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* 모바일 저장 버튼 (lg 이하에서만 표시) */}
              <div className="flex gap-3 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  {tCommon('button.cancel')}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  isLoading={updateProfileMutation.isPending}
                  disabled={!hasChanges}
                >
                  {updateProfileMutation.isPending ? t('saving') : t('saveBtn')}
                </Button>
              </div>
            </form>

            {/* ─── 우측: 사이드바 ─── */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-20">

              {/* 저장 버튼 */}
              <Button
                type="button"
                size="lg"
                className="w-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
                isLoading={updateProfileMutation.isPending}
                disabled={!hasChanges}
                onClick={handleSubmit}
              >
                {updateProfileMutation.isPending ? t('saving') : t('saveBtn')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.back()}
              >
                {tCommon('button.cancel')}
              </Button>

              {/* 완성도 카드 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                {/* 진행률 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24" cy="24" r="20"
                        fill="none" strokeWidth="4"
                        className="stroke-slate-100"
                      />
                      <circle
                        cx="24" cy="24" r="20"
                        fill="none" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        className="stroke-blue-600 transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-caption-3 font-bold text-blue-600">
                      {progress}%
                    </span>
                  </div>
                  <div>
                    <p className="text-caption-1 font-bold text-slate-900">
                      {t('completionTitle')}{' '}
                      <span className="text-blue-600">{progress}%</span>
                    </p>
                    <p className="text-caption-3 text-slate-400 mt-0.5">
                      {t('completionCount', { filled: filledCount, total: REQUIRED_FIELDS.length })}
                    </p>
                  </div>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* 기업 정보 체크리스트 */}
                <p className="text-caption-3 font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('checklistInfo')}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {infoFields.map(({ key, label }) => {
                    const val = formData[key];
                    const filled = val !== '' && val !== 0;
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                            filled ? 'bg-blue-600' : 'bg-slate-200',
                          )}
                        >
                          {filled && <Check size={10} className="text-white" strokeWidth={3} />}
                        </span>
                        <span
                          className={cn(
                            'text-caption-2',
                            filled ? 'text-slate-700 font-medium' : 'text-slate-400',
                          )}
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* 담당자 정보 체크리스트 */}
                <p className="text-caption-3 font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('checklistContact')}
                </p>
                <ul className="space-y-1.5">
                  {contactFields.map(({ key, label }) => {
                    const val = formData[key];
                    const filled = val !== '' && val !== 0;
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                            filled ? 'bg-blue-600' : 'bg-slate-200',
                          )}
                        >
                          {filled && <Check size={10} className="text-white" strokeWidth={3} />}
                        </span>
                        <span
                          className={cn(
                            'text-caption-2',
                            filled ? 'text-slate-700 font-medium' : 'text-slate-400',
                          )}
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {hasChanges && (
                  <p className="mt-4 text-caption-3 text-amber-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {t('unsavedChanges')}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CompanyProfileEditClient;
