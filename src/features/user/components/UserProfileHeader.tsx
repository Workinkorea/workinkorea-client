'use client';

import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, ExternalLink, Calendar, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserProfile } from '@/features/user/types/user';
import { cn } from '@/shared/lib/utils/utils';

interface UserProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  className?: string;
}

function UserProfileHeader({
  profile,
  isOwnProfile = false,
  onEditClick,
  className = ''
}: UserProfileHeaderProps) {
  const t = useTranslations('user.profile.header');

  // 가용성 상태에 따른 스타일
  const getAvailabilityStyle = (jobStatus: UserProfile['job_status']) => {
      switch (jobStatus) {
        case 'available':
          return {
            bg: 'bg-status-correct-bg0',
            text: 'text-white',
            label: t('statusAvailable')
          };
        case 'busy':
          return {
            bg: 'bg-status-caution-bg0',
            text: 'text-white',
            label: t('statusBusy')
          };
        case 'not-looking':
          return {
            bg: 'bg-label-400',
            text: 'text-white',
            label: t('statusNotLooking')
          };
        default:
          return {
            bg: 'bg-label-100',
            text: 'text-label-700',
            label: t('statusUndecided')
          };
      }
    };

  const availabilityStyle = getAvailabilityStyle(profile.job_status);

  // 언어 숙련도 라벨
  const getProficiencyLabel = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return t('proficiencyBeginner');
      case 'intermediate': return t('proficiencyIntermediate');
      case 'advanced': return t('proficiencyAdvanced');
      case 'native': return t('proficiencyNative');
      default: return proficiency;
    }
  };

  return (
    <motion.div
      className={cn('bg-white rounded-lg shadow-sm p-6', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 프로필 이미지 */}
        <motion.div 
          className="shrink-0"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative">
            {profile.profileImage ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-100 bg-cover bg-center" style={{backgroundImage: `url(${profile.profileImage})`}} aria-label={`${profile.name}의 프로필`} />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-label-100 border-4 border-blue-100 flex items-center justify-center">
                <span className="text-title-3 md:text-title-2 font-semibold text-label-400">
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
                <h1 className="text-title-2 font-extrabold text-label-900">
                  {profile.name}
                </h1>
                <span className={cn(
                  'text-caption-3 px-3 py-1 rounded-full font-medium',
                  availabilityStyle.bg,
                  availabilityStyle.text
                )}>
                  {availabilityStyle.label}
                </span>
              </div>

              {profile.position && (
                <p className="text-body-2 text-primary-600 font-medium mb-3">
                  {profile.position}
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

                {profile.experience > 0 && (
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    <span>{t('experienceYears', { years: profile.experience })}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{t('joinDate', { date: new Date(profile.createdAt).toLocaleDateString('ko-KR') })}</span>
                </div>
              </div>

              {/* 소개 */}
              {profile.introduction && (
                <p className="text-body-3 text-label-700 mb-4 leading-relaxed">
                  {profile.introduction}
                </p>
              )}

              {/* 언어 */}
              {profile.languages.length > 0 && (
                <div className="mb-4">
                  <span className="text-caption-1 text-label-600 font-medium mr-2">{t('languagesLabel')}</span>
                  <div className="inline-flex flex-wrap gap-2">
                    {profile.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="text-caption-3 bg-label-100 text-label-700 px-2 py-1 rounded"
                      >
                        {lang.name} ({getProficiencyLabel(lang.proficiency)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 행동 버튼 */}
            <div className="flex flex-row md:flex-col gap-2">
              {isOwnProfile && (
                <>
                  {onEditClick && (
                    <button
                      onClick={onEditClick}
                      className="flex-1 md:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg text-caption-1 font-medium hover:bg-primary-700 transition-colors cursor-pointer"
                    >
                      {t('editProfile')}
                    </button>
                  )}
                </>
              )}

              {!isOwnProfile && (
                <>
                  <button className="flex-1 md:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg text-caption-1 font-medium hover:bg-primary-700 transition-colors cursor-pointer">
                    {t('contact')}
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 border border-blue-600 text-primary-600 rounded-lg text-caption-1 font-medium hover:bg-primary-50 transition-colors cursor-pointer">
                    {t('favorite')}
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
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-600 transition-colors"
            >
              <Mail size={16} />
              <span>{profile.email}</span>
            </a>
          )}

          {/* GitHub */}
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-600 transition-colors"
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
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-600 transition-colors"
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
              className="flex items-center gap-2 text-body-3 text-label-600 hover:text-primary-600 transition-colors"
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
          className="mt-4 p-4 bg-label-100 rounded-lg"
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
}

export default UserProfileHeader;