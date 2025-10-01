'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, User, Mail, Settings } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { UserProfile } from '@/types/user';
import { 
  basicProfileSchema, 
  contactInfoSchema, 
  preferencesSchema,
  BasicProfileForm,
  ContactInfoForm,
  PreferencesForm
} from '@/lib/validations/profile';
import { cn } from '@/lib/utils/utils';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

type TabType = 'basic' | 'contact' | 'preferences';

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isSaving, setIsSaving] = useState(false);

  // 기본 정보 폼
  const basicForm = useForm<BasicProfileForm>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title || '',
      location: profile.location || '',
      bio: profile.bio || '',
    }
  });

  // 연락처 폼
  const contactForm = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: profile.email,
      githubUrl: profile.githubUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      portfolioUrl: profile.portfolioUrl || '',
    }
  });

  // 선호도 폼
  const preferencesForm = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      availability: profile.availability,
      experience: profile.experience,
      completedProjects: profile.completedProjects,
      preferredSalary: profile.preferredSalary || {
        min: 0,
        max: 0,
        currency: '만원'
      },
    }
  });

  const tabs = [
    { key: 'basic', label: '기본 정보', icon: User },
    { key: 'contact', label: '연락처', icon: Mail },
    { key: 'preferences', label: '선호도', icon: Settings },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 현재 활성 탭의 폼 검증
      let isValid = false;
      let formData = {};

      switch (activeTab) {
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
        case 'preferences':
          isValid = await preferencesForm.trigger();
          if (isValid) {
            formData = preferencesForm.getValues();
          }
          break;
      }

      if (isValid) {
        await onSave(formData);
        // 성공 메시지나 토스트 표시 가능
      }
    } catch (error) {
      console.error('프로필 저장 중 오류:', error);
      // 오류 메시지 표시
    } finally {
      setIsSaving(false);
    }
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-4">
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
          <textarea
            {...field}
            id={fieldId}
            placeholder="자신에 대해 간단히 소개해주세요"
            rows={4}
            className={cn(
              "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent resize-none",
              "border-line-400 focus:ring-primary",
              basicForm.formState.errors.bio && "border-red-500 focus:ring-red-500"
            )}
          />
        )}
      />
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-4">
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

  const renderPreferencesTab = () => (
    <div className="space-y-4">
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
              preferencesForm.formState.errors.availability && "border-red-500 focus:ring-red-500"
            )}
          >
            <option value="">상태를 선택하세요</option>
            <option value="available">구직중</option>
            <option value="busy">바쁨</option>
            <option value="not-looking">구직안함</option>
          </select>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="experience"
          control={preferencesForm.control}
          label="경력 (년) *"
          error={preferencesForm.formState.errors.experience?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              type="number"
              min="0"
              max="50"
              placeholder="0"
              error={!!preferencesForm.formState.errors.experience}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />

        <FormField
          name="completedProjects"
          control={preferencesForm.control}
          label="완료 프로젝트 수 *"
          error={preferencesForm.formState.errors.completedProjects?.message}
          render={(field, fieldId) => (
            <Input
              {...field}
              id={fieldId}
              type="number"
              min="0"
              max="1000"
              placeholder="0"
              error={!!preferencesForm.formState.errors.completedProjects}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-body-3 font-medium text-label-700">희망 연봉</label>
        <div className="text-caption-2 text-label-500 mb-2">
          최소/최대 희망 연봉을 입력하고 통화를 선택하세요
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="preferredSalary.min"
            control={preferencesForm.control}
            label="최소 희망 연봉"
            error={preferencesForm.formState.errors.preferredSalary?.min?.message}
            render={(field, fieldId) => (
              <Input
                {...field}
                id={fieldId}
                type="number"
                min="0"
                max="1000000"
                step="100"
                placeholder="3000"
                error={!!preferencesForm.formState.errors.preferredSalary?.min}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />

          <FormField
            name="preferredSalary.max"
            control={preferencesForm.control}
            label="최대 희망 연봉"
            error={preferencesForm.formState.errors.preferredSalary?.max?.message}
            render={(field, fieldId) => (
              <Input
                {...field}
                id={fieldId}
                type="number"
                min="0"
                max="1000000"
                step="100"
                placeholder="5000"
                error={!!preferencesForm.formState.errors.preferredSalary?.max}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </div>

        <FormField
          name="preferredSalary.currency"
          control={preferencesForm.control}
          label="통화"
          error={preferencesForm.formState.errors.preferredSalary?.currency?.message}
          render={(field, fieldId) => (
            <select
              {...field}
              id={fieldId}
              className={cn(
                "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent",
                "border-line-400 focus:ring-primary",
                preferencesForm.formState.errors.preferredSalary?.currency && "border-red-500 focus:ring-red-500"
              )}
            >
              <option value="">통화를 선택하세요</option>
              <option value="만원">만원 (KRW)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          )}
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 편집"
      size="lg"
      className="max-h-[90vh] flex flex-col"
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-line-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-body-3 font-medium border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-label-600 hover:text-label-800'
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'basic' && renderBasicInfoTab()}
            {activeTab === 'contact' && renderContactTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
          </motion.div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex justify-end gap-3 pt-6 border-t border-line-200">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;