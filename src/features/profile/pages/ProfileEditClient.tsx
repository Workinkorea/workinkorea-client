'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Settings,
  Camera,
  AlertCircle,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
import { FormField } from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import {
  basicProfileSchema,
  contactInfoSchema,
  preferencesSchema,
  passwordChangeSchema,
  accountSettingsSchema,
  BasicProfileForm,
  ContactInfoForm,
  PreferencesForm,
  PasswordChangeForm,
  AccountSettingsForm
} from '../validations/profile';
import { cn } from '@/shared/lib/utils/utils';
import { profileApi } from '../api/profileApi';
import { apiClient } from '@/shared/api/client';
import { uploadFileToMinio } from '@/shared/api/minio';
import type { ContactUpdateRequest, AccountConfigUpdateRequest } from '@/shared/types/api';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import { getPositionsByHierarchy } from '@/shared/constants/positions';

type SectionType = 'basic' | 'contact' | 'preferences' | 'account';

// 경력 옵션 (API 스펙에 맞춤)
const CAREER_OPTIONS = [
  { key: 'NEWCOMER', label: '신입' },
  { key: 'YEAR_1_LESS', label: '1년 이하' },
  { key: 'YEAR_1', label: '1년' },
  { key: 'YEAR_2_LESS', label: '2년 이하' },
  { key: 'YEAR_2', label: '2년' },
  { key: 'YEAR_3_LESS', label: '3년 이하' },
  { key: 'YEAR_3', label: '3년' },
  { key: 'YEAR_5_LESS', label: '5년 이하' },
  { key: 'YEAR_5', label: '5년' },
  { key: 'YEAR_7_LESS', label: '7년 이하' },
  { key: 'YEAR_7', label: '7년' },
  { key: 'YEAR_10_LESS', label: '10년 이하' },
  { key: 'YEAR_10', label: '10년' },
  { key: 'YEAR_10_MORE', label: '10년 이상' },
] as const;

// 언어 옵션
const LANGUAGE_OPTIONS = [
  { value: 'korean', label: '한국어' },
  { value: 'english', label: '영어' },
  { value: 'japanese', label: '일본어' },
  { value: 'chinese', label: '중국어' },
  { value: 'spanish', label: '스페인어' },
  { value: 'french', label: '프랑스어' },
  { value: 'german', label: '독일어' },
  { value: 'vietnamese', label: '베트남어' },
  { value: 'thai', label: '태국어' },
  { value: 'other', label: '기타' },
] as const;

// 언어 수준 옵션
const LANGUAGE_LEVEL_OPTIONS = [
  { value: 'native', label: '원어민' },
  { value: 'advanced', label: '고급' },
  { value: 'intermediate', label: '중급' },
  { value: 'beginner', label: '초급' },
] as const;

// API response의 value를 key로 변환하는 함수
const getCareerKeyFromValue = (value: string): string => {
  const option = CAREER_OPTIONS.find(opt => opt.label === value);
  return option?.key || 'NEWCOMER';
};

const ProfileEditClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<SectionType>('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const portfolioFileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPortfolioFile, setSelectedPortfolioFile] = useState<File | null>(null);
  const [portfolioFileName, setPortfolioFileName] = useState<string>('');

  // 프로필 데이터 가져오기
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      return await profileApi.getProfile();
    }
  });

  // 프로필 업데이트 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: BasicProfileForm) => {
      // UserProfile 데이터를 ProfileUpdateRequest 형식으로 변환
      const requestData = {
        name: updatedData.name,
        profile_image_url: updatedData.profile_image_url,
        location: updatedData.location,
        introduction: updatedData.introduction,
        portfolio_url: updatedData.portfolio_url,
        job_status: updatedData.job_status,
        address: updatedData.address,
        position_id: updatedData.position_id,
        career: updatedData.career,
        country_id: updatedData.country_id,
        language_skills: updatedData.language_skills,
      };

      return profileApi.updateProfile(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('프로필이 성공적으로 저장되었습니다.');
      setHasUnsavedChanges(false);
      router.push('/user/profile');
    },
    onError: () => {
      toast.error('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 연락처 업데이트 뮤테이션
  const updateContactMutation = useMutation({
    mutationFn: async (updatedData: ContactUpdateRequest) => {
      return profileApi.updateContact(updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      toast.success('연락처가 성공적으로 저장되었습니다.');
      setHasUnsavedChanges(false);
      router.push('/user/profile');
    },
    onError: () => {
      toast.error('연락처 저장에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 계정 설정 업데이트 뮤테이션
  const updateAccountConfigMutation = useMutation({
    mutationFn: async (updatedData: AccountConfigUpdateRequest) => {
      return profileApi.updateAccountConfig(updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountConfig'] });
      toast.success('계정 설정이 성공적으로 저장되었습니다.');
      setHasUnsavedChanges(false);
    },
    onError: () => {
      toast.error('계정 설정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  });


  // 폼 설정
  const basicForm = useForm<BasicProfileForm>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      name: '',
      profile_image_url: '',
      position_id: undefined,
      location: '',
      introduction: '',
      address: '',
      career: undefined,
      job_status: '',
      portfolio_url: '',
      language_skills: [],
      country_id: 122, // 기본값: 대한민국
    }
  });

  // language_skills 배열 필드 관리
  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control: basicForm.control,
    name: 'language_skills'
  });

  const contactForm = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      user_id: undefined,
      phone_number: '',
      github_url: '',
      linkedin_url: '',
      website_url: '',
    }
  });

  const preferencesForm = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      job_status: 'available',
      experience: 0,
      completedProjects: 0,
      preferredSalary: {
        min: 0,
        max: 0,
        currency: '만원'
      },
    }
  });

  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const accountForm = useForm<AccountSettingsForm>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      notifications: {
        contactRequestNotifications: true,
        skillEndorsementNotifications: true,
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        marketingEmails: false,
      },
      privacy: {
        profileVisibility: 'public' as const,
        searchable: true,
        showEmail: false,
        showLocation: true,
      }
    }
  });

  // 프로필 데이터가 로드되면 기본 정보 폼만 업데이트
  useEffect(() => {
    if (profile) {
      // career 값을 API response의 value(한글)에서 key(영문)로 변환
      const careerKey = profile.career ? (getCareerKeyFromValue(profile.career) as 'NEWCOMER' | 'YEAR_1_LESS' | 'YEAR_1' | 'YEAR_2_LESS' | 'YEAR_2' | 'YEAR_3_LESS' | 'YEAR_3' | 'YEAR_5_LESS' | 'YEAR_5' | 'YEAR_7_LESS' | 'YEAR_7' | 'YEAR_10_LESS' | 'YEAR_10' | 'YEAR_10_MORE') : undefined;

      basicForm.reset({
        profile_image_url: profile.profile_image_url ?? '',
        location: profile.location ?? '',
        introduction: profile.introduction ?? '',
        address: profile.address ?? '',
        position_id: profile.position_id ?? undefined,
        career: careerKey,
        job_status: profile.job_status ?? '',
        portfolio_url: profile.portfolio_url ?? '',
        language_skills: (profile.language_skills ?? []).map(skill => ({
          language_type: skill.language_type ?? '',
          level: skill.level ?? '',
        })),
        name: profile.name ?? '',
        country_id: profile.country_id ?? 122, // 기본값: 대한민국
      });

      // 기존 포트폴리오 URL에서 파일명 추출
      if (profile.portfolio_url) {
        const fileName = profile.portfolio_url.split('/').pop() || profile.portfolio_url;
        setPortfolioFileName(fileName);
      }
    }

    setHasUnsavedChanges(false);

  }, [profile, basicForm, preferencesForm]);

  // 변경사항 감지
  useEffect(() => {
    const subscription1 = basicForm.watch(() => setHasUnsavedChanges(true));
    const subscription2 = contactForm.watch(() => setHasUnsavedChanges(true));
    const subscription4 = passwordForm.watch(() => setHasUnsavedChanges(true));
    const subscription5 = accountForm.watch(() => setHasUnsavedChanges(true));

    return () => {
      subscription1.unsubscribe();
      subscription2.unsubscribe();
      subscription4.unsubscribe();
      subscription5.unsubscribe();
    };
  }, [basicForm, contactForm, passwordForm, accountForm]);

  // 섹션 변경 시 API 호출
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        if (activeSection === 'contact') {
          const contactData = await apiClient.get('/contact') as ContactInfoForm;
          if (contactData) {
            contactForm.reset({
              user_id: contactData.user_id ?? undefined,
              phone_number: contactData.phone_number ?? '',
              github_url: contactData.github_url ?? '',
              linkedin_url: contactData.linkedin_url ?? '',
              website_url: contactData.website_url ?? '',
            });
          }
        } else if (activeSection === 'account') {
          const accountData = await profileApi.getAccountConfig();
          if (accountData) {
            // API response를 form 형식으로 변환
            accountForm.reset({
              notifications: {
                contactRequestNotifications: accountData.sns_message_notice,
                skillEndorsementNotifications: accountData.sns_message_notice,
                emailNotifications: accountData.email_notice,
                pushNotifications: false,
                weeklyDigest: accountData.email_notice,
                marketingEmails: false,
              },
              privacy: {
                profileVisibility: 'public' as const,
                searchable: true,
                showEmail: false,
                showLocation: true,
              }
            });
          }
        }
      } catch (error) {
        console.error('섹션 데이터 로드 실패:', error);
        // API 호출 실패 시 빈 폼 유지 (placeholder만 표시)
        if (activeSection === 'contact') {
          contactForm.reset({
            user_id: undefined,
            phone_number: '',
            github_url: '',
            linkedin_url: '',
            website_url: '',
          });
        } else if (activeSection === 'account') {
          accountForm.reset({
            notifications: {
              contactRequestNotifications: false,
              skillEndorsementNotifications: false,
              emailNotifications: false,
              pushNotifications: false,
              weeklyDigest: false,
              marketingEmails: false,
            },
            privacy: {
              profileVisibility: 'public' as const,
              searchable: false,
              showEmail: false,
              showLocation: false,
            }
          });
        }
      }
    };

    if (activeSection === 'contact' || activeSection === 'account') {
      fetchSectionData();
    }
  }, [activeSection, contactForm, accountForm]);

  const sections = [
    { key: 'basic', label: '기본 정보', icon: User },
    { key: 'contact', label: '연락처', icon: Mail },
    { key: 'account', label: '계정 설정', icon: Settings },
  ];

  const handleSave = async () => {
    let isValid = false;
    let formData: BasicProfileForm | object = {};

    // 현재 섹션의 폼 검증 및 데이터 수집
    switch (activeSection) {
      case 'basic':
        isValid = await basicForm.trigger();

        if (isValid || selectedImageFile || selectedPortfolioFile) {
          formData = basicForm.getValues();

          // 프로필 이미지 업로드
          if (selectedImageFile) {
            const imageUrl = await uploadFileToMinio({
              file: selectedImageFile,
              file_type: 'profile_image',
              endpoint: '/minio/user/file',
            });
            if (imageUrl) {
              formData = { ...formData, profile_image_url: imageUrl };
            }
          }

          // 포트폴리오 파일 업로드
          if (selectedPortfolioFile) {
            const portfolioUrl = await uploadFileToMinio({
              file: selectedPortfolioFile,
              file_type: 'portfolio',
              endpoint: '/minio/user/file',
            });
            if (portfolioUrl) {
              formData = { ...formData, portfolio_url: portfolioUrl };
            }
          }

          updateProfileMutation.mutate(formData as BasicProfileForm);
        }
        break;
      case 'contact':
        isValid = await contactForm.trigger();
        if (isValid) {
          const formValues = contactForm.getValues();
          const contactData: ContactUpdateRequest = {
            ...formValues,
            user_id: profile?.user_id || undefined,
          };
          updateContactMutation.mutate(contactData);
        }
        break;
      case 'account':
        // 비밀번호 변경과 계정 설정을 구분하여 처리
        const passwordValid = await passwordForm.trigger();
        const accountValid = await accountForm.trigger();

        if (passwordValid) {
          const passwordData = passwordForm.getValues();
          // 비밀번호가 입력된 경우에만 변경 요청
          if (passwordData.currentPassword && passwordData.newPassword) {
            // TODO: 비밀번호 변경 API 구현 필요
            toast.info('비밀번호 변경 기능은 준비 중입니다.');
          }
        }

        if (accountValid) {
          const accountData = accountForm.getValues();
          // Form 데이터를 API request 형식으로 변환
          const accountConfigData: AccountConfigUpdateRequest = {
            sns_message_notice: accountData.notifications.contactRequestNotifications || accountData.notifications.skillEndorsementNotifications,
            email_notice: accountData.notifications.emailNotifications || accountData.notifications.weeklyDigest,
          };
          updateAccountConfigMutation.mutate(accountConfigData);
        }

        isValid = passwordValid && accountValid;
        break;
    }

  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?');
      if (!confirmLeave) return;
    }
    router.push('/user/profile');
  };

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일을 state에 저장하고 미리보기 생성
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setHasUnsavedChanges(true);

  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 포트폴리오 파일 업로드 핸들러
  const handlePortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 허용된 파일 타입 검증 (PDF, DOCX, etc.)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('PDF, DOCX, 이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일을 state에 저장
    setSelectedPortfolioFile(file);
    setPortfolioFileName(file.name);
    setHasUnsavedChanges(true);
  };

  const handlePortfolioButtonClick = () => {
    portfolioFileInputRef.current?.click();
  };

  const handleRemovePortfolio = () => {
    setSelectedPortfolioFile(null);
    setPortfolioFileName('');
    if (portfolioFileInputRef.current) {
      portfolioFileInputRef.current.value = '';
    }
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <Header type="homepage" />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-primary-200 rounded-full mx-auto mb-4"></div>
            <p className="text-label-500">프로필 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <Header type="homepage" />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="text-status-error mx-auto mb-4" />
            <h2 className="text-title-3 font-semibold text-label-900 mb-2">
              프로필을 불러올 수 없습니다
            </h2>
            <p className="text-body-3 text-label-500 mb-4">
              잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const renderBasicSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          {imagePreview || profile.profile_image_url ? (
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center border-4 border-primary-100"
              style={{ backgroundImage: `url(${imagePreview || profile.profile_image_url})` }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-component-alternative border-4 border-primary-100 flex items-center justify-center">
              <span className="text-2xl font-semibold text-label-500">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <Camera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div>
          <h3 className="text-body-2 font-semibold text-label-900">프로필 사진</h3>
          <p className="text-caption-2 text-label-500">JPG, PNG 파일만 업로드 가능 (최대 5MB)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          name="name"
          control={basicForm.control}
          label="이름"
          error={basicForm.formState.errors.name?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              placeholder="이름을 입력하세요"
              error={!!basicForm.formState.errors.name}
            />
          )}
        />

        <FormField
          name="location"
          control={basicForm.control}
          label="위치"
          error={basicForm.formState.errors.location?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              placeholder="이름을 입력하세요"
              error={!!basicForm.formState.errors.name}
            />
          )}
        />

        <FormField
          name="address"
          control={basicForm.control}
          label="주소"
          error={basicForm.formState.errors.address?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              placeholder="예: 서울특별시 강남구"
              error={!!basicForm.formState.errors.address}
            />
          )}
        />

        <FormField
          name="introduction"
          control={basicForm.control}
          label="소개"
          error={basicForm.formState.errors.introduction?.message}
          render={(field, fieldId) => (
            <div className="relative">
              <textarea
                {...field}
                id={fieldId}
                placeholder="자신에 대해 간단히 소개해주세요"
                rows={4}
                maxLength={500}
                className={cn(
                  "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent resize-none",
                  "border-line-400 focus:ring-primary",
                  basicForm.formState.errors.introduction && "border-status-error focus:ring-status-error"
                )}
              />
              <div className="absolute bottom-2 right-2 text-caption-2 text-label-400">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />

        <FormField
          name="job_status"
          control={basicForm.control}
          label="구직 상태"
          error={basicForm.formState.errors.job_status?.message}
          render={(field, fieldId) => (
            <select
              {...field}
              id={fieldId}
              className={cn(
                "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                "border-line-400 focus:ring-primary",
                preferencesForm.formState.errors.job_status && "border-status-error focus:ring-status-error"
              )}
            >
              <option value="">상태를 선택하세요</option>
              <option value="available">구직중</option>
              <option value="busy">바쁨</option>
              <option value="not-looking">구직안함</option>
            </select>
          )}
        />

        <FormField
          name="career"
          control={basicForm.control}
          label="경력"
          error={basicForm.formState.errors.career?.message}
          render={(field, fieldId) => (
            <select
              {...field}
              id={fieldId}
              className={cn(
                "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                "border-line-400 focus:ring-primary",
                basicForm.formState.errors.career && "border-status-error focus:ring-status-error"
              )}
            >
              <option value="">경력을 선택하세요</option>
              {CAREER_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />

        {/* 포트폴리오 파일 업로드 */}
        <div className="space-y-2">
          <label className="text-caption-2 font-medium text-label-900">
            포트폴리오
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePortfolioButtonClick}
              className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-caption-2 text-label-700 hover:bg-component-alternative transition-colors cursor-pointer"
            >
              <Camera size={16} />
              파일 선택
            </button>
            <input
              ref={portfolioFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handlePortfolioUpload}
              className="hidden"
            />
            {(portfolioFileName || profile.portfolio_url) && (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-caption-2 text-label-600 truncate">
                  {portfolioFileName || profile.portfolio_url}
                </span>
                <button
                  type="button"
                  onClick={handleRemovePortfolio}
                  className="text-status-error hover:text-status-error/80 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <p className="text-caption-2 text-label-500">
            PDF, DOCX, 이미지 파일 업로드 가능 (최대 10MB)
          </p>
        </div>

        <FormField
          name="position_id"
          control={basicForm.control}
          label="직무 선택"
          error={basicForm.formState.errors.position_id?.message}
          render={(field, fieldId) => {
            const positionHierarchy = getPositionsByHierarchy();
            return (
              <select
                {...field}
                id={fieldId}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                className={cn(
                  "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                  "border-line-400 focus:ring-primary",
                  basicForm.formState.errors.position_id && "border-status-error focus:ring-status-error"
                )}
              >
                <option value="">직무를 선택하세요</option>
                {positionHierarchy.map((category) => (
                  <optgroup key={category.categoryCode} label={category.category}>
                    {category.subcategories.map((subcategory) =>
                      subcategory.positions.map((position) => (
                        <option key={position.id} value={position.id}>
                          {subcategory.name} - {position.name}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            );
          }}
        />

        <FormField
          name="country_id"
          control={basicForm.control}
          label="국적"
          error={basicForm.formState.errors.country_id?.message}
          render={(field, fieldId) => (
            <select
              {...field}
              id={fieldId}
              value={field.value ?? 122}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 122)}
              className={cn(
                "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                "border-line-400 focus:ring-primary",
                basicForm.formState.errors.country_id && "border-status-error focus:ring-status-error"
              )}
            >
              {COUNTRIES_FULL.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          )}
        />

        {/* 언어 스킬 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-caption-2 font-medium text-label-900">언어 스킬</label>
            <button
              type="button"
              onClick={() => appendLanguage({ language_type: '', level: '' })}
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-caption-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>추가</span>
            </button>
          </div>

          {languageFields.length === 0 && (
            <p className="text-caption-2 text-label-400">언어 스킬을 추가해주세요</p>
          )}

          <div className="space-y-3">
            {languageFields.map((field, index) => (
              <div key={field.id} className="border border-line-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption-2 font-medium text-label-700">언어 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="text-status-error hover:text-status-error/80 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <FormField
                  name={`language_skills.${index}.language_type`}
                  control={basicForm.control}
                  label="언어"
                  error={basicForm.formState.errors.language_skills?.[index]?.language_type?.message}
                  render={(field, fieldId) => (
                    <select
                      {...field}
                      id={fieldId}
                      className={cn(
                        "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                        "border-line-400 focus:ring-primary",
                        basicForm.formState.errors.language_skills?.[index]?.language_type && "border-status-error focus:ring-status-error"
                      )}
                    >
                      <option value="">언어를 선택하세요</option>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />

                <FormField
                  name={`language_skills.${index}.level`}
                  control={basicForm.control}
                  label="수준"
                  error={basicForm.formState.errors.language_skills?.[index]?.level?.message}
                  render={(field, fieldId) => (
                    <select
                      {...field}
                      id={fieldId}
                      className={cn(
                        "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                        "border-line-400 focus:ring-primary",
                        basicForm.formState.errors.language_skills?.[index]?.level && "border-status-error focus:ring-status-error"
                      )}
                    >
                      <option value="">수준을 선택하세요</option>
                      {LANGUAGE_LEVEL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <FormField
        name="phone_number"
        control={contactForm.control}
        label="전화번호"
        error={contactForm.formState.errors.phone_number?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            type="tel"
            placeholder="전화번호를 입력하세요"
            error={!!contactForm.formState.errors.phone_number}
          />
        )}
      />

      <FormField
        name="github_url"
        control={contactForm.control}
        label="GitHub URL"
        error={contactForm.formState.errors.github_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://github.com/username"
            error={!!contactForm.formState.errors.github_url}
          />
        )}
      />

      <FormField
        name="linkedin_url"
        control={contactForm.control}
        label="LinkedIn URL"
        error={contactForm.formState.errors.linkedin_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://linkedin.com/in/username"
            error={!!contactForm.formState.errors.linkedin_url}
          />
        )}
      />

      <FormField
        name="website_url"
        control={contactForm.control}
        label="웹사이트 URL"
        error={contactForm.formState.errors.website_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://yourportfolio.com"
            error={!!contactForm.formState.errors.website_url}
          />
        )}
      />
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">

    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-8">
      {/* 비밀번호 변경 */}
      {/* <div className="space-y-4">
        <div className="border-b border-line-200 pb-3">
          <h4 className="text-body-2 font-semibold text-label-700">비밀번호 변경</h4>
          <p className="text-caption-2 text-label-500 mt-1">
            보안을 위해 정기적으로 비밀번호를 변경하세요
          </p>
        </div>

        <FormField
          name="currentPassword"
          control={passwordForm.control}
          label="현재 비밀번호 *"
          error={passwordForm.formState.errors.currentPassword?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              error={!!passwordForm.formState.errors.currentPassword}
            />
          )}
        />

        <FormField
          name="newPassword"
          control={passwordForm.control}
          label="새 비밀번호 *"
          error={passwordForm.formState.errors.newPassword?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              type="password"
              placeholder="새 비밀번호를 입력하세요"
              error={!!passwordForm.formState.errors.newPassword}
            />
          )}
        />

        <FormField
          name="confirmPassword"
          control={passwordForm.control}
          label="새 비밀번호 확인 *"
          error={passwordForm.formState.errors.confirmPassword?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              error={!!passwordForm.formState.errors.confirmPassword}
            />
          )}
        />

        <div className="text-caption-2 text-label-500 bg-component-alternative p-3 rounded-lg">
          <div className="font-medium mb-1">비밀번호 요구사항:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>최소 8자 이상</li>
            <li>영문자, 숫자, 특수문자 포함</li>
            <li>현재 비밀번호와 달라야 함</li>
          </ul>
        </div>
      </div> */}

      {/* 알림 설정 */}
      <div className="space-y-4">
        <div className="border-b border-line-200 pb-3">
          <h4 className="text-body-2 font-semibold text-label-700">알림 설정</h4>
          <p className="text-caption-2 text-label-500 mt-1">
            받고 싶은 알림을 선택하세요
          </p>
        </div>

        <div className="space-y-3">
          <FormField
            name="notifications.contactRequestNotifications"
            control={accountForm.control}
            label=""
            render={(field, fieldId) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                  <div>
                    <span className="text-body-3 font-medium">SNS 메시지 알림</span>
                    <p className="text-caption-2 text-label-500">중요한 활동을 SNS 메시지로 알림 받습니다</p>
                  </div>
                  <input
                    {...fieldWithoutValue}
                    id={fieldId}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                </label>
              );
            }}
          />

          <FormField
            name="notifications.emailNotifications"
            control={accountForm.control}
            label=""
            render={(field, fieldId) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                  <div>
                    <span className="text-body-3 font-medium">이메일 알림</span>
                    <p className="text-caption-2 text-label-500">중요한 활동을 이메일로 알림 받습니다</p>
                  </div>
                  <input
                    {...fieldWithoutValue}
                    id={fieldId}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                </label>
              );
            }}
          />
        </div>
      </div>


      {/* 위험 영역 */}
      <div className="space-y-4">
        <div className="border-b border-status-error pb-3">
          <h4 className="text-body-2 font-semibold text-status-error">계정 관리</h4>
          <p className="text-caption-2 text-label-500 mt-1">
            주의가 필요한 계정 관리 옵션입니다
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-status-error rounded-lg text-body-3 text-status-error hover:bg-component-alternative transition-colors cursor-pointer">
            계정 삭제 요청
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-label-600 hover:text-label-800 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} />
                <span>돌아가기</span>
              </button>
              <div>
                <h1 className="text-title-2 font-bold text-label-900">프로필 편집</h1>
                <p className="text-body-3 text-label-500">개인 정보를 수정하여 프로필을 최신 상태로 유지하세요</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-status-caution text-caption-2">
                  <AlertCircle size={16} />
                  <span>저장되지 않은 변경사항</span>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    저장
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <div className="flex gap-8">
            {/* 사이드바 네비게이션 */}
            <motion.div
              className="w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-lg shadow-normal p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key as SectionType)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer',
                          activeSection === section.key
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'text-label-700 hover:bg-component-alternative'
                        )}
                      >
                        <Icon size={18} />
                        <span className="text-body-3 font-medium">{section.label}</span>
                        {updateProfileMutation.isSuccess && activeSection === section.key && (
                          <CheckCircle size={16} className="text-status-correct ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* 메인 컨텐츠 */}
            <motion.div
              className="flex-1 bg-white rounded-lg shadow-normal p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'basic' && renderBasicSection()}
                {activeSection === 'contact' && renderContactSection()}
                {activeSection === 'preferences' && renderPreferencesSection()}
                {activeSection === 'account' && renderAccountSection()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileEditClient;