'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, ExternalLink, Calendar, Briefcase } from 'lucide-react';
import { UserProfile } from '@/types/user';
import { cn } from '@/lib/utils/utils';

interface UserProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  onResumeClick?: () => void;
  className?: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profile,
  isOwnProfile = false,
  onEditClick,
  onResumeClick,
  className = ''
}) => {
  // 가용성 상태에 따른 스타일
  const getAvailabilityStyle = (availability: UserProfile['availability']) => {
    switch (availability) {
      case 'available':
        return {
          bg: 'bg-status-correct',
          text: 'text-white',
          label: '구직중'
        };
      case 'busy':
        return {
          bg: 'bg-status-caution',
          text: 'text-white', 
          label: '바쁨'
        };
      case 'not-looking':
        return {
          bg: 'bg-label-500',
          text: 'text-white',
          label: '구직안함'
        };
      default:
        return {
          bg: 'bg-component-alternative',
          text: 'text-label-700',
          label: '미정'
        };
    }
  };

  const availabilityStyle = getAvailabilityStyle(profile.availability);

  // 언어 숙련도 라벨
  const getProficiencyLabel = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      case 'native': return '모국어';
      default: return proficiency;
    }
  };

  return (
    <motion.div 
      className={cn('bg-white rounded-lg shadow-normal p-6', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 프로필 이미지 */}
        <motion.div 
          className="flex-shrink-0"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative">
            {profile.profileImage ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-100 bg-cover bg-center" style={{backgroundImage: `url(${profile.profileImage})`}} aria-label={`${profile.name}의 프로필`} />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-component-alternative border-4 border-primary-100 flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-semibold text-label-500">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* 상태 표시 */}
            <div className={cn(
              'absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white',
              availabilityStyle.bg
            )} />
          </div>
        </motion.div>

        {/* 기본 정보 */}
        <div className="flex-1 min-w-0">
          <motion.div 
            className="flex flex-col md:flex-row md:items-start justify-between gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex-1">
              {/* 이름과 직책 */}
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-title-2 font-bold text-label-900">
                  {profile.name}
                </h1>
                <span className={cn(
                  'text-caption-2 px-3 py-1 rounded-full font-medium',
                  availabilityStyle.bg,
                  availabilityStyle.text
                )}>
                  {availabilityStyle.label}
                </span>
              </div>

              {profile.title && (
                <p className="text-body-2 text-primary-600 font-medium mb-3">
                  {profile.title}
                </p>
              )}

              {/* 기본 정보 */}
              <div className="flex flex-wrap items-center gap-4 text-body-3 text-label-600 mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>{profile.experience}년 경력</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>가입일 {new Date(profile.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>

              {/* 소개 */}
              {profile.bio && (
                <p className="text-body-3 text-label-700 mb-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* 언어 */}
              {profile.languages.length > 0 && (
                <div className="mb-4">
                  <span className="text-body-3 text-label-600 font-medium mr-2">언어:</span>
                  <div className="inline-flex flex-wrap gap-2">
                    {profile.languages.map((lang, index) => (
                      <span 
                        key={index}
                        className="text-caption-2 bg-component-alternative text-label-700 px-2 py-1 rounded"
                      >
                        {lang.name} ({getProficiencyLabel(lang.proficiency)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 행동 버튼 */}
            <div className="flex flex-col gap-2">
              {isOwnProfile && (
                <>
                  {onEditClick && (
                    <button
                      onClick={onEditClick}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                    >
                      프로필 편집
                    </button>
                  )}
                  {onResumeClick && (
                    <button
                      onClick={onResumeClick}
                      className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg text-body-3 font-medium hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      이력서 보기
                    </button>
                  )}
                </>
              )}

              {!isOwnProfile && (
                <>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer">
                    연락하기
                  </button>
                  <button className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg text-body-3 font-medium hover:bg-primary-50 transition-colors cursor-pointer">
                    즐겨찾기
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 연락처 및 링크 */}
      <motion.div 
        className="mt-6 pt-6 border-t border-line-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* 이메일 */}
          <a 
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-500 transition-colors"
          >
            <Mail size={16} />
            <span>{profile.email}</span>
          </a>

          {/* GitHub */}
          {profile.githubUrl && (
            <a 
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-500 transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
              <ExternalLink size={12} />
            </a>
          )}

          {/* LinkedIn */}
          {profile.linkedinUrl && (
            <a 
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-500 transition-colors"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
              <ExternalLink size={12} />
            </a>
          )}

          {/* Portfolio */}
          {profile.portfolioUrl && (
            <a 
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-500 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Portfolio</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </motion.div>

      {/* 희망 연봉 (있는 경우) */}
      {/* {profile.preferredSalary && (
        <motion.div 
          className="mt-4 p-4 bg-component-alternative rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="text-body-3 text-label-600">
            <span className="font-medium">희망 연봉:</span>
            <span className="ml-2">
              {profile.preferredSalary.min.toLocaleString()} - {profile.preferredSalary.max.toLocaleString()} {profile.preferredSalary.currency}
            </span>
          </div>
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default UserProfileHeader;