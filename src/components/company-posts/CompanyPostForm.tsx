'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Briefcase, MapPin, Calendar, DollarSign, Clock, GraduationCap, Languages, FileText } from 'lucide-react';
import { CreateCompanyPostRequest, UpdateCompanyPostRequest } from '@/lib/api/types';
import DaumPostcodeSearch from '@/components/ui/DaumPostcodeSearch';
import { POSITION_OPTIONS, WORK_EXPERIENCE_OPTIONS, EDUCATION_OPTIONS, LANGUAGE_OPTIONS } from '@/constants/jobOptions';

interface CompanyPostFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateCompanyPostRequest | UpdateCompanyPostRequest>;
  onSubmit: (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export const CompanyPostForm: React.FC<CompanyPostFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onDelete,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<CreateCompanyPostRequest>({
    title: '',
    content: '',
    work_experience: '경력무관',
    position_id: 1,
    education: '학력무관',
    language: '한국어 능통',
    employment_type: '정규직',
    work_location: '',
    working_hours: 40,
    salary: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isNegotiableSalary, setIsNegotiableSalary] = useState(false);
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    if (initialData?.work_location) {
      const parts = initialData.work_location.split('|');
      if (parts.length === 2) {
        setBaseAddress(parts[0].trim());
        setDetailAddress(parts[1].trim());
      } else {
        setBaseAddress(initialData.work_location);
      }
    }
    if (initialData?.salary === 0) {
      setIsNegotiableSalary(true);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'working_hours' || name === 'salary' || name === 'position_id' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '공고 제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '상세 설명을 입력해주세요.';
    }
    if (!baseAddress) {
      newErrors.work_location = '근무 위치를 입력해주세요.';
    }
    if (!isNegotiableSalary && formData.salary <= 0) {
      newErrors.salary = '연봉을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const fullAddress = detailAddress ? `${baseAddress} | ${detailAddress}` : baseAddress;
    const submitData = {
      ...formData,
      work_location: fullAddress,
      salary: isNegotiableSalary ? 0 : formData.salary,
    };

    onSubmit(submitData);
  };

  const handleAddressChange = (address: string) => {
    setBaseAddress(address);
    setFormData((prev) => ({ ...prev, work_location: address }));
    if (errors.work_location) {
      setErrors((prev) => ({ ...prev, work_location: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white rounded-lg p-6 shadow-normal">
        <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
          <Briefcase size={20} />
          기본 정보
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-body-3 font-medium text-label-700 mb-2">
              공고 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.title ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="예: 외국인 환영! 프론트엔드 개발자 모집"
            />
            {errors.title && (
              <p className="mt-1 text-caption-2 text-status-error">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="position_id" className="block text-body-3 font-medium text-label-700 mb-2">
              포지션 *
            </label>
            <select
              id="position_id"
              name="position_id"
              value={formData.position_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-body-3 font-medium text-label-700 mb-2">
              상세 설명 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className={`w-full px-4 py-2 border ${errors.content ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="채용 공고 상세 내용을 입력하세요..."
            />
            {errors.content && (
              <p className="mt-1 text-caption-2 text-status-error">{errors.content}</p>
            )}
          </div>
        </div>
      </div>

      {/* 자격 요건 */}
      <div className="bg-white rounded-lg p-6 shadow-normal">
        <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
          <GraduationCap size={20} />
          자격 요건
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="work_experience" className="block text-body-3 font-medium text-label-700 mb-2">
              경력 요건
            </label>
            <select
              id="work_experience"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {WORK_EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="education" className="block text-body-3 font-medium text-label-700 mb-2">
              학력 요건
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {EDUCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
              <Languages size={16} />
              언어 요건
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 근무 조건 */}
      <div className="bg-white rounded-lg p-6 shadow-normal">
        <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
          <Clock size={20} />
          근무 조건
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="employment_type" className="block text-body-3 font-medium text-label-700 mb-2">
              고용 형태
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="정규직">정규직</option>
              <option value="계약직">계약직</option>
              <option value="인턴">인턴</option>
              <option value="프리랜서">프리랜서</option>
            </select>
          </div>

          <div>
            <label htmlFor="work_location" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
              <MapPin size={16} />
              근무 위치 *
            </label>
            <div className="space-y-2">
              <DaumPostcodeSearch
                value={baseAddress}
                onChange={handleAddressChange}
                placeholder="주소 검색 버튼을 클릭하세요"
                error={errors.work_location}
              />
              <input
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="상세 주소 (선택)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="working_hours" className="block text-body-3 font-medium text-label-700 mb-2">
              주당 근무 시간
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="working_hours"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                min="1"
                max="80"
                className="w-32 px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-body-3 text-label-600">시간</span>
            </div>
          </div>

          <div>
            <label htmlFor="salary" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              연봉
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  disabled={isNegotiableSalary}
                  min="0"
                  step="1000000"
                  className={`flex-1 px-4 py-2 border ${errors.salary ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-bg-100 disabled:text-label-400`}
                  placeholder="예: 40000000"
                />
                <span className="text-body-3 text-label-600">원</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNegotiableSalary}
                  onChange={(e) => {
                    setIsNegotiableSalary(e.target.checked);
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, salary: 0 }));
                      setErrors((prev) => ({ ...prev, salary: '' }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-caption-1 text-label-600">급여 협의 가능</span>
              </label>
            </div>
            {errors.salary && (
              <p className="mt-1 text-caption-2 text-status-error">{errors.salary}</p>
            )}
          </div>
        </div>
      </div>

      {/* 모집 기간 */}
      <div className="bg-white rounded-lg p-6 shadow-normal">
        <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
          <Calendar size={20} />
          모집 기간
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-body-3 font-medium text-label-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-body-3 font-medium text-label-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 justify-end">
        {mode === 'edit' && onDelete && (
          <motion.button
            type="button"
            onClick={onDelete}
            className="px-6 py-3 border-2 border-status-error text-status-error rounded-lg font-medium hover:bg-status-error hover:text-white transition-all flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={18} />
            삭제
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          {mode === 'create' ? '등록하기' : '수정하기'}
        </motion.button>
      </div>
    </form>
  );
};
