'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Upload,
  X,
  FileText,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Resume, ResumeTemplate } from '@/features/user/types/user';
import { resumeApi } from '@/features/resume/api/resumeApi';
import { FormField } from '@/shared/ui/FormField';
import DatePicker from '@/shared/ui/DatePicker';
import type {
  CreateResumeRequest,
  UpdateResumeRequest
} from '@/shared/types/api';

interface ResumeEditorProps {
  templateType: ResumeTemplate;
  initialData?: Resume;
  isEditMode?: boolean;
  resumeId?: number | null;
}

type ResumeFormData = {
  title: string;
  profile_url?: string;
  language_skills: Array<{
    language_type: string;
    level: string;
  }>;
  schools: Array<{
    school_name: string;
    major_name: string;
    start_date: string;
    end_date?: string;
    is_graduated: boolean;
  }>;
  career_history: Array<{
    company_name: string;
    start_date: string;
    end_date?: string;
    is_working: boolean;
    department: string;
    position_title: string;
    main_role: string;
  }>;
  introduction: Array<{
    title: string;
    content: string;
  }>;
  licenses: Array<{
    license_name: string;
    license_agency: string;
    license_date: string;
  }>;
};

function ResumeEditor({
  templateType,
  initialData,
  isEditMode = false,
  resumeId
}: ResumeEditorProps) {
  const t = useTranslations('resume.editor');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    introduction: true,
    career: false,
    education: false,
    language: false,
    license: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.content?.personalInfo?.profileImage || null
  );

  const { control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ResumeFormData>({
    defaultValues: {
      title: initialData?.title || '',
      profile_url: initialData?.content?.personalInfo?.profileImage || '',
      language_skills: initialData?.content?.languages?.map(lang => ({
        language_type: lang.name,
        level: lang.proficiency
      })) || [{ language_type: '', level: '' }],
      schools: initialData?.content?.education?.map(edu => ({
        school_name: edu.institution,
        major_name: edu.field,
        start_date: edu.startDate,
        end_date: edu.endDate,
        is_graduated: edu.degree === '졸업'
      })) || [{
        school_name: '',
        major_name: '',
        start_date: '',
        end_date: undefined,
        is_graduated: false
      }],
      career_history: initialData?.content?.workExperience?.map(work => ({
        company_name: work.company,
        start_date: work.startDate,
        end_date: work.endDate,
        is_working: work.current || false,
        department: '',
        position_title: work.position,
        main_role: work.description || ''
      })) || [{
        company_name: '',
        start_date: '',
        end_date: undefined,
        is_working: false,
        department: '',
        position_title: '',
        main_role: ''
      }],
      introduction: initialData?.content?.objective ? [{
        title: '',
        content: initialData.content.objective
      }] : [{ title: '', content: '' }],
      licenses: initialData?.licenses && initialData.licenses.length > 0
        ? initialData.licenses.map(license => ({
            license_name: license.license_name,
            license_agency: license.license_agency,
            license_date: license.license_date
          }))
        : initialData?.content?.certifications?.map(cert => ({
            license_name: cert,
            license_agency: '',
            license_date: ''
          })) || [{ license_name: '', license_agency: '', license_date: '' }]
    }
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'language_skills'
  });

  const { fields: schoolFields, append: appendSchool, remove: removeSchool } = useFieldArray({
    control,
    name: 'schools'
  });

  const { fields: careerFields, append: appendCareer, remove: removeCareer } = useFieldArray({
    control,
    name: 'career_history'
  });

  const { fields: introFields, append: appendIntro, remove: removeIntro } = useFieldArray({
    control,
    name: 'introduction'
  });

  const { fields: licenseFields, append: appendLicense, remove: removeLicense } = useFieldArray({
    control,
    name: 'licenses'
  });

  // 이력서 생성 뮤테이션
  const createResumeMutation = useMutation({
    mutationFn: async (data: CreateResumeRequest) => {
      return resumeApi.createResume(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success(t('createSuccess'));
      router.push('/user');
    },
    onError: () => {
      toast.error(t('createError'));
    }
  });

  // 이력서 업데이트 뮤테이션
  const updateResumeMutation = useMutation({
    mutationFn: async (data: UpdateResumeRequest) => {
      if (!resumeId) throw new Error('Resume ID is required');
      return resumeApi.updateResume(resumeId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success(t('updateSuccess'));
      router.push('/user');
    },
    onError: () => {
      toast.error(t('updateError'));
    }
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      // 재직중일 때 또는 선택 안 했을 때 end_date를 제거
      const processedCareerHistory = data.career_history.length > 0
        ? data.career_history.map(career => {
            const { end_date, ...rest } = career;
            // end_date가 있고 재직중이 아닐 때만 포함
            if (end_date && !career.is_working) {
              return { ...rest, end_date };
            }
            return rest;
          })
        : undefined;

      // 학력사항의 end_date도 선택 안 했을 때 제거
      const processedSchools = data.schools.length > 0
        ? data.schools.map(school => {
            const { end_date, ...rest } = school;
            // end_date가 있을 때만 포함
            if (end_date) {
              return { ...rest, end_date };
            }
            return rest;
          })
        : undefined;

      const requestData: CreateResumeRequest | UpdateResumeRequest = {
        title: data.title,
        profile_url: data.profile_url || undefined,
        language_skills: data.language_skills.length > 0 ? data.language_skills : undefined,
        schools: processedSchools,
        career_history: processedCareerHistory,
        introduction: data.introduction.length > 0 ? data.introduction : undefined,
        licenses: data.licenses.length > 0 ? data.licenses : undefined,
      };

      if (isEditMode && resumeId) {
        await updateResumeMutation.mutateAsync(requestData as UpdateResumeRequest);
      } else {
        await createResumeMutation.mutateAsync(requestData as CreateResumeRequest);
      }
    } catch (error) {
      // mutation onError handles user-facing error
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      toast.error(t('imageTypeError'));
      return;
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('imageSizeError'));
      return;
    }

    try {
      setUploadingImage(true);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // API 업로드
      const response = await resumeApi.uploadResumeImage(file);
      setValue('profile_url', response.file_name);
      toast.success(t('imageSuccess'));
    } catch (error) {
      toast.error(t('imageError'));
      setPreviewImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue('profile_url', '');
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} id="resume-form" className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-title-3 font-extrabold text-label-900">
              {isEditMode ? t('titleEdit') : t('titleCreate')}
            </h1>
            <p className="text-caption-1 text-label-500 mt-0.5">
              {t('templateHint', { template: templateType })}
            </p>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
          {/* Left column: form sections */}
          <div className="space-y-4">
          {/* 기본 정보 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-body-2 font-bold text-label-900">
                  {t('basicInfoTitle')}
                </h3>
                <p className="text-caption-2 text-label-500 mt-0.5">
                  {t('basicInfoSubtitle')}
                </p>
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 sm:px-7 py-5 space-y-4">
            <FormField
              name="title"
              control={control}
              label={t('resumeTitleLabel')}
              rules={{ required: t('resumeTitleRequired') }}
              render={(field, fieldId) => (
                <input
                  {...field}
                  id={fieldId}
                  type="text"
                  placeholder={t('resumeTitlePlaceholder')}
                  className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            />

            <div>
              <label className="block text-caption-2 font-medium text-label-700 mb-2">
                {t('profileImageLabel')}
              </label>
              <div className="flex items-start gap-4">
                {/* 이미지 미리보기 */}
                {previewImage && (
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt={t('profilePreviewAlt')}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-lg object-cover border border-line-400"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-status-error-bg0 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* 업로드 버튼 */}
                <div className="flex-1">
                  <label
                    htmlFor="profile-image-upload"
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-line-400 rounded-lg text-body-3 text-label-600 hover:border-primary-500 hover:text-primary-600 transition-colors cursor-pointer ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload size={16} />
                    {uploadingImage ? t('uploadingText') : t('uploadText')}
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <p className="text-caption-3 text-label-500 mt-2">
                    {t('imageHint')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

          {/* 자기소개 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div
              className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('introduction')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-body-2 font-bold text-label-900">
                    {t('introTitle')}
                  </h3>
                  <p className="text-caption-2 text-label-500 mt-0.5">
                    {t('introSectionSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {openSections.introduction && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); appendIntro({ title: '', content: '' }); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-2 font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={14} />
                    {t('addBtn')}
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`text-label-500 transition-transform duration-200 ${openSections.introduction ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Card body */}
            {openSections.introduction && (
            <AnimatePresence>
            {introFields.map((field, index) => (
              <motion.div
                key={field.id}
                className="px-5 sm:px-7 py-4 border-b border-line-200 last:border-0"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-body-3 font-semibold">{t('introItem', { n: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => removeIntro(index)}
                    className="text-status-error hover:bg-status-error-bg p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-4">
                <FormField
                  name={`introduction.${index}.title`}
                  control={control}
                  label={t('introFieldTitle')}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`introduction.${index}.content`}
                  control={control}
                  label={t('introFieldContent')}
                  render={(field, fieldId) => (
                    <textarea
                      {...field}
                      id={fieldId}
                      rows={4}
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3 resize-none"
                    />
                  )}
                />
              </div>
            </motion.div>
            ))}
            </AnimatePresence>
            )}
          </motion.div>

          {/* 경력사항 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div
              className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('career')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-body-2 font-bold text-label-900">
                    {t('careerTitle')}
                  </h3>
                  <p className="text-caption-2 text-label-500 mt-0.5">
                    {t('careerSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {openSections.career && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); appendCareer({ company_name: '', start_date: '', end_date: undefined, is_working: false, department: '', position_title: '', main_role: '' }); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-2 font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={14} />
                    {t('addBtn')}
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`text-label-500 transition-transform duration-200 ${openSections.career ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Card body */}
            {openSections.career && (
            <AnimatePresence>
            {careerFields.map((field, index) => (
              <motion.div
                key={field.id}
                className="px-5 sm:px-7 py-5 border-b border-line-200 last:border-0"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-body-3 font-semibold">{t('careerItem', { n: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => removeCareer(index)}
                    className="text-status-error hover:bg-status-error-bg p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`career_history.${index}.company_name`}
                  control={control}
                  label={t('companyNameLabel')}
                  rules={{ required: t('companyNameRequired') }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.position_title`}
                  control={control}
                  label={t('positionLabel')}
                  rules={{ required: t('positionRequired') }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.department`}
                  control={control}
                  label={t('departmentLabel')}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.start_date`}
                  control={control}
                  label={t('startDateLabel')}
                  rules={{ required: t('startDateRequired') }}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('startDatePlaceholder')}
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.end_date`}
                  control={control}
                  label={t('endDateLabel')}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('endDatePlaceholder')}
                      disabled={watch(`career_history.${index}.is_working`)}
                    />
                  )}
                />
                <div className="flex items-center pt-6">
                  <FormField
                    name={`career_history.${index}.is_working`}
                    control={control}
                    render={(field) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-caption-2 text-label-700">{t('currentlyWorking')}</span>
                      </label>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    name={`career_history.${index}.main_role`}
                    control={control}
                    label={t('mainRoleLabel')}
                    render={(field, fieldId) => (
                      <textarea
                        {...field}
                        id={fieldId}
                        rows={3}
                        className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3 resize-none"
                      />
                    )}
                  />
                </div>
              </div>
            </motion.div>
            ))}
            </AnimatePresence>
            )}
          </motion.div>

          {/* 학력사항 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div
              className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('education')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-body-2 font-bold text-label-900">
                    {t('educationTitle')}
                  </h3>
                  <p className="text-caption-2 text-label-500 mt-0.5">
                    {t('educationSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {openSections.education && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); appendSchool({ school_name: '', major_name: '', start_date: '', end_date: undefined, is_graduated: false }); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-2 font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={14} />
                    {t('addBtn')}
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`text-label-500 transition-transform duration-200 ${openSections.education ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Card body */}
            {openSections.education && (
            <AnimatePresence>
            {schoolFields.map((field, index) => (
              <motion.div
                key={field.id}
                className="px-5 sm:px-7 py-5 border-b border-line-200 last:border-0"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-body-3 font-semibold">{t('educationItem', { n: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => removeSchool(index)}
                    className="text-status-error hover:bg-status-error-bg p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`schools.${index}.school_name`}
                  control={control}
                  label={t('schoolNameLabel')}
                  rules={{ required: t('schoolNameRequired') }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      placeholder={t('schoolNamePlaceholder')}
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.major_name`}
                  control={control}
                  label={t('majorLabel')}
                  rules={{ required: t('majorRequired') }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.start_date`}
                  control={control}
                  label={t('admissionDateLabel')}
                  rules={{ required: t('admissionDateRequired') }}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('admissionDatePlaceholder')}
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.end_date`}
                  control={control}
                  label={t('graduationDateLabel')}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('graduationDatePlaceholder')}
                    />
                  )}
                />
                <div className="flex items-center pt-6">
                  <FormField
                    name={`schools.${index}.is_graduated`}
                    control={control}
                    render={(field) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-caption-2 text-label-700">{t('graduated')}</span>
                      </label>
                    )}
                  />
                </div>
              </div>
            </motion.div>
            ))}
            </AnimatePresence>
            )}
          </motion.div>

          {/* 언어 능력 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div
              className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('language')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Globe size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-body-2 font-bold text-label-900">
                    {t('languageSectionTitle')}
                  </h3>
                  <p className="text-caption-2 text-label-500 mt-0.5">
                    {t('languageSectionSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {openSections.language && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); appendLanguage({ language_type: '', level: '' }); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-2 font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={14} />
                    {t('addBtn')}
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`text-label-500 transition-transform duration-200 ${openSections.language ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Card body */}
            {openSections.language && (
            <AnimatePresence>
            {languageFields.map((field, index) => (
              <motion.div
                key={field.id}
                className="px-5 sm:px-7 py-4 border-b border-line-200 last:border-0"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-body-3 font-semibold">{t('languageItem', { n: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="text-status-error hover:bg-status-error-bg p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`language_skills.${index}.language_type`}
                  control={control}
                  label={t('languageLabel')}
                  rules={{ required: t('languageRequired') }}
                  render={(field, fieldId) => (
                    <select
                      {...field}
                      id={fieldId}
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    >
                      <option value="">{t('langSelectPlaceholder')}</option>
                      <option value="한국어">{t('langKorean')}</option>
                      <option value="영어">{t('langEnglish')}</option>
                      <option value="중국어">{t('langChinese')}</option>
                      <option value="일본어">{t('langJapanese')}</option>
                      <option value="스페인어">{t('langSpanish')}</option>
                      <option value="프랑스어">{t('langFrench')}</option>
                      <option value="독일어">{t('langGerman')}</option>
                      <option value="러시아어">{t('langRussian')}</option>
                      <option value="아랍어">{t('langArabic')}</option>
                      <option value="베트남어">{t('langVietnamese')}</option>
                      <option value="태국어">{t('langThai')}</option>
                      <option value="포르투갈어">{t('langPortuguese')}</option>
                      <option value="이탈리아어">{t('langItalian')}</option>
                      <option value="기타">{t('langOther')}</option>
                    </select>
                  )}
                />
                <FormField
                  name={`language_skills.${index}.level`}
                  control={control}
                  label={t('levelLabel')}
                  rules={{ required: t('levelRequired') }}
                  render={(field, fieldId) => (
                    <select
                      {...field}
                      id={fieldId}
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    >
                      <option value="">{t('levelSelectPlaceholder')}</option>
                      <option value="beginner">{t('levelBeginner')}</option>
                      <option value="intermediate">{t('levelIntermediate')}</option>
                      <option value="advanced">{t('levelAdvanced')}</option>
                      <option value="native">{t('levelNative')}</option>
                    </select>
                  )}
                />
              </div>
            </motion.div>
            ))}
            </AnimatePresence>
            )}
          </motion.div>

          {/* 자격증 */}
          <motion.div
            className="bg-white border border-line-400 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div
              className="px-5 sm:px-7 py-5 border-b border-line-200 flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('license')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Award size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-body-2 font-bold text-label-900">
                    {t('licenseTitle')}
                  </h3>
                  <p className="text-caption-2 text-label-500 mt-0.5">
                    {t('licenseSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {openSections.license && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); appendLicense({ license_name: '', license_agency: '', license_date: '' }); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-2 font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={14} />
                    {t('addBtn')}
                  </button>
                )}
                <ChevronDown
                  size={18}
                  className={`text-label-500 transition-transform duration-200 ${openSections.license ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Card body */}
            {openSections.license && (
            <AnimatePresence>
            {licenseFields.map((field, index) => (
              <motion.div
                key={field.id}
                className="px-5 sm:px-7 py-4 border-b border-line-200 last:border-0"
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-body-3 font-semibold">{t('licenseItem', { n: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => removeLicense(index)}
                    className="text-status-error hover:bg-status-error-bg p-1 rounded cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`licenses.${index}.license_name`}
                  control={control}
                  label={t('licenseNameLabel')}
                  rules={{ required: t('licenseNameRequired') }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`licenses.${index}.license_agency`}
                  control={control}
                  label={t('licenseAgencyLabel')}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-400 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`licenses.${index}.license_date`}
                  control={control}
                  label={t('licenseDateLabel')}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('licenseDatePlaceholder')}
                    />
                  )}
                />
              </div>
            </motion.div>
            ))}
            </AnimatePresence>
            )}
          </motion.div>
          </div>

          {/* Right sidebar: Save buttons and tips */}
          <div className="hidden lg:block sticky top-6 space-y-4">
            {/* Save card */}
            <div className="bg-white border border-line-400 rounded-xl p-5 space-y-3">
              <Button
                type="submit"
                form="resume-form"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t('savingText') : isEditMode ? t('updateBtn') : t('saveBtn')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.back()}
              >
                {t('cancelBtn')}
              </Button>
            </div>

            {/* Tips card */}
            <div className="bg-primary-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-primary-600 shrink-0" />
                <h4 className="text-body-3 font-semibold text-label-900">
                  {t('tipsTitle')}
                </h4>
              </div>
              <ul className="space-y-1.5 text-caption-2 text-label-600">
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>{t('tip1')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>{t('tip2')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>{t('tip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 모바일 하단 정적 저장 버튼 */}
        <div className="lg:hidden flex gap-3 pt-2 pb-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.back()}
          >
            {t('cancelBtn')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? t('savingText') : isEditMode ? t('updateBtn') : t('saveBtn')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResumeEditor;
