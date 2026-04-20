'use client';

import { motion } from 'framer-motion';
import { UserSkill } from '@/features/user/types/user';
import SkillProgressBar from '@/shared/ui/SkillProgressBar';
import { cn } from '@/shared/lib/utils/utils';

interface SkillBarChartProps {
  skills: UserSkill[];
  title?: string;
  className?: string;
  maxItems?: number;
  showCategory?: boolean;
}

function SkillBarChart({
  skills,
  title = "기술 역량 비교",
  className = '',
  maxItems = 8,
  showCategory = true
}: SkillBarChartProps) {
  // 스킬을 레벨 순으로 정렬하고 최대 개수만큼 제한
  const sortedSkills = [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, maxItems);

  // 카테고리별 색상 매핑
  const getCategoryColor = (category: UserSkill['category']) => {
    switch (category) {
      case 'technical':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'soft':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'language':
        return 'text-amber-500 bg-amber-500-bg border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getCategoryLabel = (category: UserSkill['category']) => {
    switch (category) {
      case 'technical':
        return '기술';
      case 'soft':
        return '소프트';
      case 'language':
        return '언어';
      default:
        return '기타';
    }
  };

  if (sortedSkills.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg p-6 shadow-sm', className)}>
        <h3 className="text-title-5 font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-slate-500">
          등록된 스킬이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn('bg-white rounded-lg p-6 shadow-sm', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-title-5 font-semibold text-slate-900">{title}</h3>
        <div className="flex items-center gap-4 text-caption-3 text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-blue-500 rounded"></div>
            <span>내 점수</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-3 bg-slate-700"></div>
            <span>업계 평균</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-caption-1 font-medium text-slate-900">
                  {skill.name}
                </span>
                {showCategory && (
                  <span className={cn(
                    'text-caption-3 px-2 py-0.5 rounded border text-center',
                    getCategoryColor(skill.category)
                  )}>
                    {getCategoryLabel(skill.category)}
                  </span>
                )}
              </div>

              {/* 점수 차이 표시 */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'text-caption-3 px-2 py-0.5 rounded font-medium',
                  skill.level > skill.average
                    ? 'text-emerald-500 bg-emerald-500-bg'
                    : skill.level < skill.average
                    ? 'text-amber-500 bg-amber-500-bg'
                    : 'text-slate-500 bg-slate-100'
                )}>
                  {skill.level > skill.average ? '+' : ''}
                  {skill.level - skill.average}점
                </div>
              </div>
            </div>

            <SkillProgressBar
              value={skill.level}
              average={skill.average}
              showValues={true}
              barHeight="md"
            />

            {/* 스킬 설명 (있는 경우) */}
            {skill.description && (
              <p className="mt-1 text-caption-3 text-slate-500">
                {skill.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 통계 요약 */}
      <motion.div
        className="mt-6 pt-4 border-t border-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-title-5 font-semibold text-blue-600">
              {sortedSkills.length}
            </div>
            <div className="text-caption-3 text-slate-500">총 스킬</div>
          </div>
          <div>
            <div className="text-title-5 font-semibold text-emerald-500">
              {sortedSkills.filter(skill => skill.level > skill.average).length}
            </div>
            <div className="text-caption-3 text-slate-500">평균 이상</div>
          </div>
          <div>
            <div className="text-title-5 font-semibold text-blue-600">
              {Math.round(sortedSkills.reduce((sum, skill) => sum + skill.level, 0) / sortedSkills.length)}
            </div>
            <div className="text-caption-3 text-slate-500">평균 점수</div>
          </div>
          <div>
            <div className="text-title-5 font-semibold text-slate-700">
              {Math.round(sortedSkills.reduce((sum, skill) => sum + skill.average, 0) / sortedSkills.length)}
            </div>
            <div className="text-caption-3 text-slate-500">업계 평균</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SkillBarChart;