'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { Resume, ResumeTemplate } from '@/types/user';
import { resumeApi } from '@/lib/api/resume';
import { FormField } from '@/components/ui/FormField';
import DatePicker from '@/components/ui/DatePicker';
import SchoolSearch from '@/components/ui/SchoolSearch';
import type {
  CreateResumeRequest,
  UpdateResumeRequest
} from '@/lib/api/types';

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
    end_date: string;
    is_graduated: boolean;
  }>;
  career_history: Array<{
    company_name: string;
    start_date: string;
    end_date: string;
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

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  templateType,
  initialData,
  isEditMode = false,
  resumeId
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
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
      })) || [],
      schools: initialData?.content?.education?.map(edu => ({
        school_name: edu.institution,
        major_name: edu.field,
        start_date: edu.startDate,
        end_date: edu.endDate || '',
        is_graduated: edu.degree === '졸업'
      })) || [],
      career_history: initialData?.content?.workExperience?.map(work => ({
        company_name: work.company,
        start_date: work.startDate,
        end_date: work.endDate || '',
        is_working: work.current || false,
        department: '',
        position_title: work.position,
        main_role: work.description || ''
      })) || [],
      introduction: initialData?.content?.objective ? [{
        title: '자기소개',
        content: initialData.content.objective
      }] : [],
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
          })) || []
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

  const { fields: introFields, append: appendIntro } = useFieldArray({
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
      toast.success('이력서가 생성되었습니다.');
      router.push('/user');
    },
    onError: () => {
      toast.error('이력서 생성에 실패했습니다.');
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
      toast.success('이력서가 수정되었습니다.');
      router.push('/user');
    },
    onError: () => {
      toast.error('이력서 수정에 실패했습니다.');
    }
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      const requestData: CreateResumeRequest | UpdateResumeRequest = {
        title: data.title,
        profile_url: data.profile_url || undefined,
        language_skills: data.language_skills.length > 0 ? data.language_skills : undefined,
        schools: data.schools.length > 0 ? data.schools : undefined,
        career_history: data.career_history.length > 0 ? data.career_history : undefined,
        introduction: data.introduction.length > 0 ? data.introduction : undefined,
        licenses: data.licenses.length > 0 ? data.licenses : undefined,
      };

      if (isEditMode && resumeId) {
        await updateResumeMutation.mutateAsync(requestData as UpdateResumeRequest);
      } else {
        await createResumeMutation.mutateAsync(requestData as CreateResumeRequest);
      }
    } catch (error) {
      console.error('이력서 저장 실패:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다.');
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
      toast.success('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했습니다.');
      setPreviewImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue('profile_url', '');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 text-label-600 hover:text-label-900 hover:bg-component-alternative rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-title-2 font-bold text-label-900">
              {isEditMode ? '이력서 편집' : '새 이력서 작성'}
            </h1>
            <p className="text-body-3 text-label-600">
              {templateType} 템플릿으로 이력서를 작성하고 있습니다
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 기본 정보 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-body-2 font-semibold text-label-900 mb-4">
            기본 정보
          </h3>

          <div className="space-y-4">
            <FormField
              name="title"
              control={control}
              label="이력서 제목"
              rules={{ required: '이력서 제목을 입력해주세요' }}
              render={(field, fieldId) => (
                <input
                  {...field}
                  id={fieldId}
                  type="text"
                  placeholder="예: 프론트엔드 개발자 이력서"
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            />

            <div>
              <label className="block text-caption-1 font-medium text-label-700 mb-2">
                프로필 이미지
              </label>
              <div className="flex items-start gap-4">
                {/* 이미지 미리보기 */}
                {previewImage && (
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt="프로필 미리보기"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-lg object-cover border border-line-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* 업로드 버튼 */}
                <div className="flex-1">
                  <label
                    htmlFor="profile-image-upload"
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-line-300 rounded-lg text-body-3 text-label-600 hover:border-primary-500 hover:text-primary-600 transition-colors cursor-pointer ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload size={16} />
                    {uploadingImage ? '업로드 중...' : '이미지 업로드'}
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <p className="text-caption-2 text-label-500 mt-2">
                    JPG, PNG, GIF 파일 (최대 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 자기소개 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-2 font-semibold text-label-900">
              자기소개
            </h3>
            {introFields.length === 0 && (
              <button
                type="button"
                onClick={() => appendIntro({ title: '자기소개', content: '' })}
                className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-1 font-medium cursor-pointer"
              >
                <Plus size={14} />
                추가
              </button>
            )}
          </div>

          {introFields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <FormField
                name={`introduction.${index}.title`}
                control={control}
                label="제목"
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                  />
                )}
              />
              <FormField
                name={`introduction.${index}.content`}
                control={control}
                label="내용"
                render={(field, fieldId) => (
                  <textarea
                    {...field}
                    id={fieldId}
                    rows={4}
                    className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 resize-none"
                  />
                )}
              />
            </div>
          ))}
        </motion.div>

        {/* 경력 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-2 font-semibold text-label-900">
              경력사항
            </h3>
            <button
              type="button"
              onClick={() => appendCareer({
                company_name: '',
                start_date: '',
                end_date: '',
                is_working: false,
                department: '',
                position_title: '',
                main_role: ''
              })}
              className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-1 font-medium cursor-pointer"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {careerFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border border-line-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-body-3 font-semibold">경력 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCareer(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`career_history.${index}.company_name`}
                  control={control}
                  label="회사명"
                  rules={{ required: '회사명을 입력해주세요' }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.position_title`}
                  control={control}
                  label="직책"
                  rules={{ required: '직책을 입력해주세요' }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.department`}
                  control={control}
                  label="부서"
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.start_date`}
                  control={control}
                  label="시작일"
                  rules={{ required: '시작일을 입력해주세요' }}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="시작일을 선택하세요"
                    />
                  )}
                />
                <FormField
                  name={`career_history.${index}.end_date`}
                  control={control}
                  label="종료일"
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="종료일을 선택하세요"
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
                        <span className="text-caption-1 text-label-700">재직중</span>
                      </label>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    name={`career_history.${index}.main_role`}
                    control={control}
                    label="주요 업무"
                    render={(field, fieldId) => (
                      <textarea
                        {...field}
                        id={fieldId}
                        rows={3}
                        className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 resize-none"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 학력 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-2 font-semibold text-label-900">
              학력사항
            </h3>
            <button
              type="button"
              onClick={() => appendSchool({
                school_name: '',
                major_name: '',
                start_date: '',
                end_date: '',
                is_graduated: false
              })}
              className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-1 font-medium cursor-pointer"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {schoolFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-4 border border-line-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-body-3 font-semibold">학력 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSchool(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`schools.${index}.school_name`}
                  control={control}
                  label="학교명"
                  rules={{ required: '학교명을 입력해주세요' }}
                  render={(field) => (
                    <SchoolSearch
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="학교명을 검색하세요"
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.major_name`}
                  control={control}
                  label="전공"
                  rules={{ required: '전공을 입력해주세요' }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.start_date`}
                  control={control}
                  label="입학일"
                  rules={{ required: '입학일을 입력해주세요' }}
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="입학일을 선택하세요"
                    />
                  )}
                />
                <FormField
                  name={`schools.${index}.end_date`}
                  control={control}
                  label="졸업일"
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="졸업일을 선택하세요"
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
                        <span className="text-caption-1 text-label-700">졸업</span>
                      </label>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 언어 능력 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-2 font-semibold text-label-900">
              언어 능력
            </h3>
            <button
              type="button"
              onClick={() => appendLanguage({ language_type: '', level: '' })}
              className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-1 font-medium cursor-pointer"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {languageFields.map((field, index) => (
            <div key={field.id} className="mb-4 p-4 border border-line-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-body-3 font-semibold">언어 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`language_skills.${index}.language_type`}
                  control={control}
                  label="언어"
                  rules={{ required: '언어를 입력해주세요' }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      placeholder="예: 영어, 한국어"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`language_skills.${index}.level`}
                  control={control}
                  label="수준"
                  rules={{ required: '수준을 선택해주세요' }}
                  render={(field, fieldId) => (
                    <select
                      {...field}
                      id={fieldId}
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    >
                      <option value="">선택하세요</option>
                      <option value="beginner">초급</option>
                      <option value="intermediate">중급</option>
                      <option value="advanced">고급</option>
                      <option value="native">모국어</option>
                    </select>
                  )}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* 자격증 */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-2 font-semibold text-label-900">
              자격증
            </h3>
            <button
              type="button"
              onClick={() => appendLicense({ license_name: '', license_agency: '', license_date: '' })}
              className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg text-caption-1 font-medium cursor-pointer"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {licenseFields.map((field, index) => (
            <div key={field.id} className="mb-4 p-4 border border-line-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-body-3 font-semibold">자격증 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeLicense(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name={`licenses.${index}.license_name`}
                  control={control}
                  label="자격증명"
                  rules={{ required: '자격증명을 입력해주세요' }}
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`licenses.${index}.license_agency`}
                  control={control}
                  label="발급기관"
                  render={(field, fieldId) => (
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3"
                    />
                  )}
                />
                <FormField
                  name={`licenses.${index}.license_date`}
                  control={control}
                  label="취득일"
                  render={(field) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="취득일을 선택하세요"
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 하단 저장 버튼 */}
      <div className="flex justify-end pt-6 border-t border-line-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-lg text-body-2 font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          <Save size={20} />
          {isSubmitting ? '저장중...' : isEditMode ? '수정하기' : '생성하기'}
        </button>
      </div>
    </form>
  );
};

export default ResumeEditor;
