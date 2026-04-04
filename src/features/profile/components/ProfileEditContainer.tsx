'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Settings,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/shared/components/layout/Layout';
import { Button } from '@/shared/ui/Button';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactInfoSection from './sections/ContactInfoSection';
import AccountSettingsSection from './sections/AccountSettingsSection';
import {
  basicProfileSchema,
  contactInfoSchema,
  accountSettingsSchema,
  BasicProfileForm,
  ContactInfoForm,
  AccountSettingsForm,
} from '../validations/profile';
import { cn } from '@/shared/lib/utils/utils';
import { profileApi } from '../api/profileApi';
import { fetchClient } from '@/shared/api/fetchClient';
import { uploadFileToMinio } from '@/shared/api/minio';
import type { ContactUpdateRequest, AccountConfigUpdateRequest } from '@/shared/types/api';

/**
 * ProfileEditContainer Component
 *
 * Smart (container) component that manages:
 * - Data fetching (profile, contact, account config)
 * - Form state (3 separate forms for each section)
 * - Mutations (update profile, contact, account)
 * - Section routing (basic, contact, account)
 * - File uploads (profile image, portfolio)
 *
 * @example
 * <ProfileEditContainer />
 *
 * Architecture Decision:
 * - Container/Presentational pattern (this is the Container)
 * - Manages all business logic, delegates UI to section components
 * - Uses react-hook-form for each section independently
 * - Uses React Query for server state management
 *
 * Why this architecture?
 * - Separation of Concerns: Data ≠ UI
 * - Testability: Mock useQuery/useMutation for tests
 * - Reusability: Section components can be reused
 * - Maintainability: Each concern in its own file
 */

type SectionType = 'basic' | 'contact' | 'account';

type CareerKey = 'NEWCOMER' | 'YEAR_1_LESS' | 'YEAR_1' | 'YEAR_2_LESS' | 'YEAR_2' | 'YEAR_3_LESS' | 'YEAR_3' | 'YEAR_5_LESS' | 'YEAR_5' | 'YEAR_7_LESS' | 'YEAR_7' | 'YEAR_10_LESS' | 'YEAR_10' | 'YEAR_10_MORE';

// API response value -> key 변환 (for career field)
const getCareerKeyFromValue = (value: string): CareerKey => {
  const CAREER_OPTIONS: { key: CareerKey; label: string }[] = [
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
  ];
  const option = CAREER_OPTIONS.find(opt => opt.label === value);
  return option?.key || 'NEWCOMER';
};

function ProfileEditContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Section state
  const [activeSection, setActiveSection] = useState<SectionType>('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // File upload state (lifted from BasicInfoSection)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedPortfolioFile, setSelectedPortfolioFile] = useState<File | null>(null);
  const [portfolioFileName, setPortfolioFileName] = useState<string>('');

  /**
   * Data Fetching: Profile
   * Why useQuery? Server state management with caching
   */
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      return await profileApi.getProfile();
    },
  });

  /**
   * Mutation: Update Profile (Basic Info)
   */
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: BasicProfileForm) => {
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
    },
  });

  /**
   * Mutation: Update Contact
   */
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
    },
  });

  /**
   * Mutation: Update Account Config
   */
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
    },
  });

  /**
   * Form Instances (3 separate forms)
   * Why separate? Different validation schemas, different API endpoints
   */
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
    },
  });

  const contactForm = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      user_id: undefined,
      phone_number: '',
      github_url: '',
      linkedin_url: '',
      website_url: '',
    },
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
      },
    },
  });

  /**
   * Effect: Populate basic form when profile data loads
   */
  useEffect(() => {
    if (profile) {
      const careerKey = profile.career
        ? getCareerKeyFromValue(profile.career)
        : undefined;

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
        country_id: profile.country_id ?? 122,
      });

      // Extract portfolio filename from URL
      if (profile.portfolio_url) {
        const fileName = profile.portfolio_url.split('/').pop() || profile.portfolio_url;
        setPortfolioFileName(fileName);
      }
    }
    setHasUnsavedChanges(false);
  }, [profile, basicForm]);

  /**
   * Effect: Track unsaved changes across all forms
   */
  useEffect(() => {
    const subscription1 = basicForm.watch(() => setHasUnsavedChanges(true));
    const subscription2 = contactForm.watch(() => setHasUnsavedChanges(true));
    const subscription3 = accountForm.watch(() => setHasUnsavedChanges(true));

    return () => {
      subscription1.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
    };
  }, [basicForm, contactForm, accountForm]);

  /**
   * Effect: Fetch section-specific data when switching sections
   * Why? Contact and Account data are fetched on-demand (not in initial profile query)
   */
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        if (activeSection === 'contact') {
          const contactData = await fetchClient.get<ContactInfoForm>('/api/contact');
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
              },
            });
          }
        }
      } catch (error) {
        // silently ignore section data load errors
      }
    };

    if (activeSection === 'contact' || activeSection === 'account') {
      fetchSectionData();
    }
  }, [activeSection, contactForm, accountForm]);

  /**
   * Handler: Save current section
   * Handles file uploads before saving form data
   */
  const handleSave = async () => {
    let isValid = false;
    let formData: BasicProfileForm | object = {};

    switch (activeSection) {
      case 'basic':
        isValid = await basicForm.trigger();

        if (isValid || selectedImageFile || selectedPortfolioFile) {
          formData = basicForm.getValues();

          // Upload profile image if selected
          if (selectedImageFile) {
            const imageUrl = await uploadFileToMinio({
              file: selectedImageFile,
              file_type: 'profile_image',
              endpoint: '/api/minio/user/file',
            });
            if (imageUrl) {
              formData = { ...formData, profile_image_url: imageUrl };
            }
          }

          // Upload portfolio file if selected
          if (selectedPortfolioFile) {
            const portfolioUrl = await uploadFileToMinio({
              file: selectedPortfolioFile,
              file_type: 'portfolio',
              endpoint: '/api/minio/user/file',
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
          };
          updateContactMutation.mutate(contactData);
        }
        break;

      case 'account':
        isValid = await accountForm.trigger();
        if (isValid) {
          const accountData = accountForm.getValues();
          const accountConfigData: AccountConfigUpdateRequest = {
            sns_message_notice:
              accountData.notifications.contactRequestNotifications ||
              accountData.notifications.skillEndorsementNotifications,
            email_notice:
              accountData.notifications.emailNotifications ||
              accountData.notifications.weeklyDigest,
          };
          updateAccountConfigMutation.mutate(accountConfigData);
        }
        break;
    }
  };

  /**
   * Handler: Navigate back with unsaved changes warning
   */
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?'
      );
      if (!confirmLeave) return;
    }
    router.push('/user/profile');
  };

  /**
   * Navigation sections configuration
   */
  const sections = [
    { key: 'basic', label: '기본 정보', icon: User },
    { key: 'contact', label: '연락처', icon: Mail },
    { key: 'account', label: '계정 설정', icon: Settings },
  ];

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <Layout>
        <main className="flex-1 bg-label-100 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
        </main>
      </Layout>
    );
  }

  /**
   * Error state
   */
  if (error || !profile) {
    return (
      <Layout>
        <main className="flex-1 bg-label-100 flex items-center justify-center min-h-[60vh]">
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
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
            >
              돌아가기
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  /**
   * Main render
   */
  return (
    <Layout>
      <main className="flex-1 bg-label-100">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-title-3 font-bold text-label-900">프로필 편집</h1>
            <p className="text-body-3 text-label-500 mt-1">개인 정보를 수정하여 프로필을 최신 상태로 유지하세요.</p>
          </motion.div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 mb-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key as SectionType);
                    setIsMobileNavOpen(false);
                  }}
                  className={cn(
                    'shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-body-3 font-medium transition-colors cursor-pointer',
                    activeSection === section.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-line-400 text-label-600 hover:border-line-400'
                  )}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
            {/* ─── 좌측: 폼 ─── */}
            <motion.div
              className="space-y-4"
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
                {activeSection === 'basic' && (
                  <BasicInfoSection
                    form={basicForm}
                    profile={profile}
                    onImageSelect={(file) => {
                      setSelectedImageFile(file);
                      setHasUnsavedChanges(true);
                    }}
                    onPortfolioSelect={(file) => {
                      setSelectedPortfolioFile(file);
                      setPortfolioFileName(file.name);
                      setHasUnsavedChanges(true);
                    }}
                    selectedPortfolioFileName={portfolioFileName}
                    onRemovePortfolio={() => {
                      setSelectedPortfolioFile(null);
                      setPortfolioFileName('');
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                {activeSection === 'contact' && <ContactInfoSection form={contactForm} />}

                {activeSection === 'account' && <AccountSettingsSection form={accountForm} />}
              </motion.div>

              {/* 모바일 저장 버튼 (lg 이하에서만 표시) */}
              <div className="flex gap-3 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleBack}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="flex-1"
                  isLoading={updateProfileMutation.isPending || updateContactMutation.isPending || updateAccountConfigMutation.isPending}
                  disabled={!hasUnsavedChanges}
                  onClick={handleSave}
                >
                  {updateProfileMutation.isPending || updateContactMutation.isPending || updateAccountConfigMutation.isPending ? '저장 중...' : '저장하기'}
                </Button>
              </div>
            </motion.div>

            {/* ─── 우측: 사이드바 ─── */}
            <motion.aside
              className="hidden lg:flex flex-col gap-4 sticky top-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* 저장 버튼 */}
              <Button
                type="button"
                size="lg"
                className="w-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
                isLoading={updateProfileMutation.isPending || updateContactMutation.isPending || updateAccountConfigMutation.isPending}
                disabled={!hasUnsavedChanges}
                onClick={handleSave}
              >
                {updateProfileMutation.isPending || updateContactMutation.isPending || updateAccountConfigMutation.isPending ? '저장 중...' : '저장하기'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleBack}
              >
                취소
              </Button>

              {/* 섹션 네비게이션 */}
              <div className="bg-white border border-line-400 rounded-xl p-6">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key as SectionType)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer text-body-3 font-medium',
                          activeSection === section.key
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'text-label-700 hover:bg-label-100'
                        )}
                      >
                        <Icon size={16} />
                        <span>{section.label}</span>
                        {updateProfileMutation.isSuccess && activeSection === section.key && (
                          <CheckCircle size={16} className="text-status-correct ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {hasUnsavedChanges && (
                  <p className="mt-4 text-caption-3 text-status-caution flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    저장되지 않은 변경사항이 있습니다.
                  </p>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProfileEditContainer;
