'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { UserProfile } from '@/types/user';
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
} from '@/lib/validations/profile';
import { cn } from '@/lib/utils/utils';
import { profileApi } from '@/lib/api/profile';
import { apiClient } from '@/lib/api/client';

type SectionType = 'basic' | 'contact' | 'preferences' | 'account';

const ProfileEditClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<SectionType>('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 프로필 데이터 가져오기
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const apiProfile = await profileApi.getProfile();

      // API 응답을 UserProfile 형태로 변환
      const transformedProfile: UserProfile = {
        id: apiProfile.user_id?.toString() || 'me',
        name: apiProfile.name || '',
        email: '', // ProfileResponse에 email 필드 없음
        profileImage: apiProfile.profile_image_url || undefined,
        title: '', // ProfileResponse에 title 필드 없음
        location: apiProfile.location || '',
        bio: apiProfile.introduction || '',
        experience: 0, // ProfileResponse에 experience 필드 없음
        completedProjects: 0, // ProfileResponse에 completedProjects 필드 없음
        certifications: [], // ProfileResponse에 certifications 필드 없음
        availability: (apiProfile.job_status as 'available' | 'busy' | 'not-looking') || 'available',
        skills: [], // ProfileResponse에 skills 필드 없음
        education: [], // ProfileResponse에 education 필드 없음
        languages: [], // ProfileResponse에 languages 필드 없음
        githubUrl: '', // ProfileResponse에 github_url 필드 없음
        linkedinUrl: '', // ProfileResponse에 linkedin_url 필드 없음
        portfolioUrl: apiProfile.portfolio_url || '',
        preferredSalary: undefined, // ProfileResponse에 preferredSalary 필드 없음
        createdAt: '', // ProfileResponse에 created_at 필드 없음
        updatedAt: '' // ProfileResponse에 updated_at 필드 없음
      };

      return transformedProfile;
    }
  });

  // 프로필 업데이트 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfile>) => {
      // UserProfile 데이터를 ProfileUpdateRequest 형식으로 변환
      const requestData = {
        name: updatedData.name,
        profile_image_url: updatedData.profileImage,
        location: updatedData.location,
        introduction: updatedData.bio,
        portfolio_url: updatedData.portfolioUrl,
        job_status: updatedData.availability,
        // position_id, country_id, birth_date는 나중에 추가
      };

      return profileApi.updateProfile(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('프로필이 성공적으로 저장되었습니다.');
      setHasUnsavedChanges(false);
    },
    onError: () => {
      toast.error('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 폼 설정
  const basicForm = useForm<BasicProfileForm>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      name: '',
      title: '',
      location: '',
      bio: '',
    }
  });

  const contactForm = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
    }
  });

  const preferencesForm = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      availability: 'available',
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
      basicForm.reset({
        name: profile.name || '',
        title: profile.title || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });

      preferencesForm.reset({
        availability: profile.availability || 'available',
        experience: profile.experience || 0,
        completedProjects: profile.completedProjects || 0,
        preferredSalary: profile.preferredSalary || {
          min: 0,
          max: 0,
          currency: '만원'
        },
      });
    }
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
          const contactData = await apiClient.get('/api/contact');
          console.log('연락처 데이터:', contactData);
          if (contactData) {
            contactForm.reset(contactData as ContactInfoForm);
          }
        } else if (activeSection === 'account') {
          const accountData = await apiClient.get('/api/account-config');
          console.log('계정 설정 데이터:', accountData);
          if (accountData) {
            accountForm.reset(accountData as AccountSettingsForm);
          }
        }
      } catch (error) {
        console.error('섹션 데이터 로드 실패:', error);
        // API 호출 실패 시 빈 폼 유지 (placeholder만 표시)
        if (activeSection === 'contact') {
          contactForm.reset({
            email: '',
            githubUrl: '',
            linkedinUrl: '',
            portfolioUrl: '',
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
    let formData = {};

    // 현재 섹션의 폼 검증 및 데이터 수집
    switch (activeSection) {
      case 'basic':
        isValid = await basicForm.trigger();
        if (isValid) {
          formData = basicForm.getValues();
        }
        break;
      case 'contact':
        isValid = await contactForm.trigger();
        if (isValid) {
          formData = contactForm.getValues();
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
            formData = { ...formData, password: passwordData };
          }
        }

        if (accountValid) {
          const accountData = accountForm.getValues();
          formData = { ...formData, settings: accountData };
        }

        isValid = passwordValid && accountValid;
        break;
    }

    if (isValid) {
      let imageUrl: string | undefined;

      if (selectedImageFile) {
        // 1. Presigned URL 정보 받기
        const uploadResponse = await apiClient.post<{ minio: { url: string; fields: Record<string, string>; key: string; expires: string; content_type: string; form_data: Record<string, string> } }>(
          '/api/me/profile/image',
          { file_name: selectedImageFile.name, content_type: selectedImageFile.type, max_size: selectedImageFile.size }
        );

        console.log(uploadResponse.minio);
        // 2. 데이터 순서대로 추가

        const uploadData = uploadResponse.minio;
        const uploadFormData = new FormData();

        uploadFormData.append("key", uploadData.key);
        uploadFormData.append("Content-Type", uploadData.content_type);
        uploadFormData.append("x-amz-algorithm", uploadData.form_data["x-amz-algorithm"]);
        uploadFormData.append("x-amz-credential", uploadData.form_data["x-amz-credential"]);
        uploadFormData.append("x-amz-date", uploadData.form_data["x-amz-date"]);
        uploadFormData.append("policy", uploadData.form_data["policy"]);
        uploadFormData.append("x-amz-signature", uploadData.form_data["x-amz-signature"]);
        uploadFormData.append("success_action_status", "201");
        uploadFormData.append("file", selectedImageFile);

        // 3. MinIO로 업로드
        const response = await fetch(uploadResponse.minio.url, {
          method: "POST",
          body: uploadFormData,
        });

        if (!(response.ok || response.status === 201)) {
          console.error("업로드 실패");
          console.error("에러:", response.statusText);
        }

        imageUrl = response.headers.get('Location') ?? undefined;
        formData = { ...formData, profile_image_url: imageUrl };
      }
      updateProfileMutation.mutate(formData);
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
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
          {imagePreview || profile.profileImage ? (
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center border-4 border-primary-100"
              style={{ backgroundImage: `url(${imagePreview || profile.profileImage})` }}
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
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
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
          label="이름 *"
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
          name="title"
          control={basicForm.control}
          label="직책/포지션"
          error={basicForm.formState.errors.title?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              placeholder="예: 프론트엔드 개발자"
              error={!!basicForm.formState.errors.title}
            />
          )}
        />

        <FormField
          name="availability"
          control={preferencesForm.control}
          label="구직 상태 *"
          error={preferencesForm.formState.errors.availability?.message}
          render={(field, fieldId) => (
            <select
              {...field}
              id={fieldId}
              className={cn(
                "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                "border-line-400 focus:ring-primary",
                preferencesForm.formState.errors.availability && "border-status-error focus:ring-status-error"
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
          name="location"
          control={basicForm.control}
          label="위치"
          error={basicForm.formState.errors.location?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              placeholder="예: 서울, 한국"
              error={!!basicForm.formState.errors.location}
            />
          )}
        />

        <FormField
          name="bio"
          control={basicForm.control}
          label="소개"
          error={basicForm.formState.errors.bio?.message}
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
                  basicForm.formState.errors.bio && "border-status-error focus:ring-status-error"
                )}
              />
              <div className="absolute bottom-2 right-2 text-caption-2 text-label-400">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <FormField
        name="email"
        control={contactForm.control}
        label="이메일 *"
        error={contactForm.formState.errors.email?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            type="email"
            placeholder="이메일을 입력하세요"
            error={!!contactForm.formState.errors.email}
          />
        )}
      />

      <FormField
        name="githubUrl"
        control={contactForm.control}
        label="GitHub URL"
        error={contactForm.formState.errors.githubUrl?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://github.com/username"
            error={!!contactForm.formState.errors.githubUrl}
          />
        )}
      />

      <FormField
        name="linkedinUrl"
        control={contactForm.control}
        label="LinkedIn URL"
        error={contactForm.formState.errors.linkedinUrl?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://linkedin.com/in/username"
            error={!!contactForm.formState.errors.linkedinUrl}
          />
        )}
      />

      <FormField
        name="portfolioUrl"
        control={contactForm.control}
        label="포트폴리오 URL"
        error={contactForm.formState.errors.portfolioUrl?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://yourportfolio.com"
            error={!!contactForm.formState.errors.portfolioUrl}
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
            render={(field, fieldId) => (
              <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                <div>
                  <span className="text-body-3 font-medium">SNS 메시지 알림</span>
                  <p className="text-caption-2 text-label-500">중요한 활동을 SNS 메시지로 알림 받습니다</p>
                </div>
                <input
                  {...field}
                  id={fieldId}
                  type="checkbox"
                  checked={field.value}
                  value=""
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
              </label>
            )}
          />

          <FormField
            name="notifications.emailNotifications"
            control={accountForm.control}
            label=""
            render={(field, fieldId) => (
              <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                <div>
                  <span className="text-body-3 font-medium">이메일 알림</span>
                  <p className="text-caption-2 text-label-500">중요한 활동을 이메일로 알림 받습니다</p>
                </div>
                <input
                  {...field}
                  id={fieldId}
                  type="checkbox"
                  checked={field.value}
                  value=""
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
              </label>
            )}
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