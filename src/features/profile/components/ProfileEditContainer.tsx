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
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
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
import { apiClient } from '@/shared/api/client';
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

const ProfileEditContainer: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Section state
  const [activeSection, setActiveSection] = useState<SectionType>('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        console.error('섹션 데이터 로드 실패:', error);
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
              endpoint: '/minio/user/file',
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

  /**
   * Error state
   */
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

  /**
   * Main render
   */
  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
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
                <p className="text-body-3 text-label-500">
                  개인 정보를 수정하여 프로필을 최신 상태로 유지하세요
                </p>
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
            {/* Sidebar Navigation */}
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

            {/* Main Content */}
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
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileEditContainer;
