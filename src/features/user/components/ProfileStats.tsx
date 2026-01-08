'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  Star, 
  Award,
  BookOpen,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { UserProfile, ProfileStatistics, SkillStats } from '@/features/user/types/user';
import StatCard from '@/shared/ui/StatCard';
import { cn } from '@/shared/lib/utils/utils';

interface ProfileStatsProps {
  profile: UserProfile;
  statistics: ProfileStatistics;
  skillStats: SkillStats;
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  profile,
  statistics,
  skillStats,
  className = ''
}) => {
  // 스킬 카테고리 라벨 변환
  const getSkillCategoryLabel = (category: 'technical' | 'soft' | 'language') => {
    switch (category) {
      case 'technical':
        return '기술 스킬';
      case 'soft':
        return '소프트 스킬';
      case 'language':
        return '언어 스킬';
      default:
        return '기타';
    }
  };

  // 업계 랭킹 퍼센타일 계산
  const getRankingLabel = (ranking: number) => {
    if (ranking >= 90) return '상위 10%';
    if (ranking >= 75) return '상위 25%';
    if (ranking >= 50) return '상위 50%';
    return `상위 ${Math.ceil(ranking)}%`;
  };

  const getRankingColor = (ranking: number) => {
    if (ranking >= 90) return 'success';
    if (ranking >= 75) return 'primary';
    if (ranking >= 50) return 'warning';
    return 'neutral';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 프로필 통계 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-title-4 font-semibold text-label-900 mb-4">
          프로필 통계
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="프로필 조회"
            value={statistics.profileViews}
            subtitle="총 조회수"
            icon={Eye}
            color="primary"
            delay={0.1}
          />
          
          <StatCard
            title="연락 요청"
            value={statistics.contactRequests}
            subtitle="받은 요청"
            icon={MessageCircle}
            color="secondary"
            delay={0.2}
          />
          
          <StatCard
            title="스킬 추천"
            value={statistics.skillEndorsements}
            subtitle="받은 추천"
            icon={ThumbsUp}
            color="success"
            delay={0.3}
          />
          
          <StatCard
            title="평균 평점"
            value={statistics.averageRating.toFixed(1)}
            subtitle="5점 만점"
            icon={Star}
            color="warning"
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* 스킬 통계 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-title-4 font-semibold text-label-900 mb-4">
          스킬 분석
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="보유 스킬"
            value={skillStats.totalSkills}
            subtitle="등록된 스킬"
            icon={BookOpen}
            color="neutral"
            delay={0.1}
          />
          
          <StatCard
            title="평균 이상 스킬"
            value={skillStats.aboveAverageSkills}
            subtitle={`전체 ${skillStats.totalSkills}개 중`}
            icon={TrendingUp}
            color="success"
            delay={0.2}
          />
          
          <StatCard
            title="전체 평점"
            value={skillStats.overallScore}
            subtitle="100점 만점"
            icon={Award}
            color="primary"
            delay={0.3}
          />
          
          <StatCard
            title="업계 순위"
            value={getRankingLabel(skillStats.industryRanking)}
            subtitle="동일 경력 대비"
            icon={TrendingUp}
            color={getRankingColor(skillStats.industryRanking)}
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* 경력 및 성과 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-title-4 font-semibold text-label-900 mb-4">
          경력 및 성과
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="경력 기간"
            value={`${profile.experience}년`}
            subtitle="총 경력"
            icon={Briefcase}
            color="primary"
            delay={0.1}
          />
          
          <StatCard
            title="완료 프로젝트"
            value={profile.completedProjects}
            subtitle="프로젝트 수"
            icon={Award}
            color="success"
            delay={0.2}
          />
          
          <StatCard
            title="자격증"
            value={profile.certifications.length}
            subtitle="보유 자격증"
            icon={Award}
            color="warning"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* 주요 스킬 카테고리 */}
      <motion.div
        className="bg-white rounded-lg p-6 shadow-normal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-title-4 font-semibold text-label-900 mb-4">
          스킬 분포
        </h3>
        
        <div className="space-y-4">
          {/* 최고 스킬 카테고리 강조 */}
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-body-2 font-semibold text-primary-700 mb-1">
                  주요 강점 영역
                </h4>
                <p className="text-body-3 text-primary-600">
                  {getSkillCategoryLabel(skillStats.topSkillCategory)}에서 가장 뛰어난 성과를 보이고 있습니다.
                </p>
              </div>
              <div className="text-title-3 font-bold text-primary-600">
                #{1}
              </div>
            </div>
          </div>

          {/* 스킬 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {(['technical', 'soft', 'language'] as const).map((category) => {
              const categorySkills = profile.skills.filter(skill => skill.category === category);
              const avgScore = categorySkills.length > 0 
                ? Math.round(categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length)
                : 0;
              
              return (
                <div key={category} className="p-3 bg-component-alternative rounded-lg">
                  <div className="text-title-4 font-semibold text-label-700 mb-1">
                    {avgScore}점
                  </div>
                  <div className="text-caption-2 text-label-500">
                    {getSkillCategoryLabel(category)}
                  </div>
                  <div className="text-caption-2 text-label-400">
                    {categorySkills.length}개 스킬
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileStats;