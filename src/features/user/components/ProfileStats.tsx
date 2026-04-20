'use client';

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
import { useTranslations } from 'next-intl';
import { UserProfile, ProfileStatistics, SkillStats } from '@/features/user/types/user';
import { StatCard } from '@/shared/ui/StatCard';
import { cn } from '@/shared/lib/utils/utils';

interface ProfileStatsProps {
  profile: UserProfile;
  statistics: ProfileStatistics;
  skillStats: SkillStats;
  className?: string;
}

export function ProfileStats({
  profile,
  statistics,
  skillStats,
  className = ''
}: ProfileStatsProps) {
  const t = useTranslations('user.profile.stats');

  // 스킬 카테고리 라벨 변환
  const getSkillCategoryLabel = (category: 'technical' | 'soft' | 'language') => {
    switch (category) {
      case 'technical':
        return t('skillCategoryTechnical');
      case 'soft':
        return t('skillCategorySoft');
      case 'language':
        return t('skillCategoryLanguage');
      default:
        return t('skillCategoryOther');
    }
  };

  // 업계 랭킹 퍼센타일 계산
  const getRankingLabel = (ranking: number) => {
    if (ranking >= 90) return t('rankingTop10');
    if (ranking >= 75) return t('rankingTop25');
    if (ranking >= 50) return t('rankingTop50');
    return t('rankingTopN', { n: Math.ceil(ranking) });
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
        <h3 className="text-title-5 font-semibold text-slate-900 mb-4">
          {t('statsTitle')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title={t('profileViews')}
            value={statistics.profileViews}
            subtitle={t('profileViewsSub')}
            icon={Eye}
            color="primary"
            delay={0.1}
          />

          <StatCard
            title={t('contactRequests')}
            value={statistics.contactRequests}
            subtitle={t('contactRequestsSub')}
            icon={MessageCircle}
            color="secondary"
            delay={0.2}
          />

          <StatCard
            title={t('skillEndorsements')}
            value={statistics.skillEndorsements}
            subtitle={t('skillEndorsementsSub')}
            icon={ThumbsUp}
            color="success"
            delay={0.3}
          />

          <StatCard
            title={t('avgRating')}
            value={statistics.averageRating.toFixed(1)}
            subtitle={t('avgRatingSub')}
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
        <h3 className="text-title-5 font-semibold text-slate-900 mb-4">
          {t('skillAnalysisTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('totalSkills')}
            value={skillStats.totalSkills}
            subtitle={t('totalSkillsSub')}
            icon={BookOpen}
            color="neutral"
            delay={0.1}
          />

          <StatCard
            title={t('aboveAverageSkills')}
            value={skillStats.aboveAverageSkills}
            subtitle={t('aboveAverageSkillsSub', { total: skillStats.totalSkills })}
            icon={TrendingUp}
            color="success"
            delay={0.2}
          />

          <StatCard
            title={t('overallScore')}
            value={skillStats.overallScore}
            subtitle={t('overallScoreSub')}
            icon={Award}
            color="primary"
            delay={0.3}
          />

          <StatCard
            title={t('industryRanking')}
            value={getRankingLabel(skillStats.industryRanking)}
            subtitle={t('industryRankingSub')}
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
        <h3 className="text-title-5 font-semibold text-slate-900 mb-4">
          {t('careerTitle')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title={t('careerPeriod')}
            value={t('careerYears', { years: profile.experience })}
            subtitle={t('careerPeriodSub')}
            icon={Briefcase}
            color="primary"
            delay={0.1}
          />

          <StatCard
            title={t('completedProjects')}
            value={profile.completedProjects}
            subtitle={t('completedProjectsSub')}
            icon={Award}
            color="success"
            delay={0.2}
          />

          <StatCard
            title={t('certifications')}
            value={profile.certifications.length}
            subtitle={t('certificationsSub')}
            icon={Award}
            color="warning"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* 주요 스킬 카테고리 */}
      <motion.div
        className="bg-white rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-title-5 font-semibold text-slate-900 mb-4">
          {t('skillDistributionTitle')}
        </h3>

        <div className="space-y-4">
          {/* 최고 스킬 카테고리 강조 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-caption-1 font-semibold text-blue-700 mb-1">
                  {t('topStrengthTitle')}
                </h4>
                <p className="text-body-3 text-blue-600">
                  {t('topStrengthDesc', { category: getSkillCategoryLabel(skillStats.topSkillCategory) })}
                </p>
              </div>
              <div className="text-title-4 font-bold text-blue-600">
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
                <div key={category} className="p-3 bg-slate-100 rounded-lg">
                  <div className="text-title-5 font-semibold text-slate-700 mb-1">
                    {avgScore}점
                  </div>
                  <div className="text-caption-3 text-slate-500">
                    {getSkillCategoryLabel(category)}
                  </div>
                  <div className="text-caption-3 text-slate-400">
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
}