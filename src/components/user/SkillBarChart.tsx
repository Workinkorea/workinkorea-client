'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserSkill } from '@/types/user';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils/utils';

interface SkillBarChartProps {
  skills: UserSkill[];
  title?: string;
  className?: string;
  maxItems?: number;
  showCategory?: boolean;
}

const SkillBarChart: React.FC<SkillBarChartProps> = ({
  skills,
  title = "기술 역량 비교",
  className = '',
  maxItems = 8,
  showCategory = true
}) => {
  // 스킬을 레벨 순으로 정렬하고 최대 개수만큼 제한
  const sortedSkills = [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, maxItems);

  // 카테고리별 색상 매핑
  const getCategoryColor = (category: UserSkill['category']) => {
    switch (category) {
      case 'technical':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'soft':
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'language':
        return 'text-status-caution bg-yellow-50 border-yellow-200';
      default:
        return 'text-label-600 bg-component-alternative border-line-200';
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
      <div className={cn('bg-white rounded-lg p-6 shadow-normal', className)}>
        <h3 className="text-title-4 font-semibold text-label-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-label-500">
          등록된 스킬이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn('bg-white rounded-lg p-6 shadow-normal', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-title-4 font-semibold text-label-900">{title}</h3>
        <div className="flex items-center gap-4 text-caption-2 text-label-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-primary-500 rounded"></div>
            <span>내 점수</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-3 bg-label-700"></div>
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
                <span className="text-body-3 font-medium text-label-900">
                  {skill.name}
                </span>
                {showCategory && (
                  <span className={cn(
                    'text-caption-2 px-2 py-0.5 rounded border text-center',
                    getCategoryColor(skill.category)
                  )}>
                    {getCategoryLabel(skill.category)}
                  </span>
                )}
              </div>
              
              {/* 점수 차이 표시 */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'text-caption-2 px-2 py-0.5 rounded font-medium',
                  skill.level > skill.average 
                    ? 'text-status-correct bg-green-50' 
                    : skill.level < skill.average 
                    ? 'text-status-caution bg-yellow-50'
                    : 'text-label-500 bg-component-alternative'
                )}>
                  {skill.level > skill.average ? '+' : ''}
                  {skill.level - skill.average}점
                </div>
              </div>
            </div>

            <ProgressBar
              value={skill.level}
              average={skill.average}
              showValues={true}
              barHeight="md"
            />

            {/* 스킬 설명 (있는 경우) */}
            {skill.description && (
              <p className="mt-1 text-caption-2 text-label-500">
                {skill.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 통계 요약 */}
      <motion.div 
        className="mt-6 pt-4 border-t border-line-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-title-4 font-semibold text-primary-600">
              {sortedSkills.length}
            </div>
            <div className="text-caption-2 text-label-500">총 스킬</div>
          </div>
          <div>
            <div className="text-title-4 font-semibold text-status-correct">
              {sortedSkills.filter(skill => skill.level > skill.average).length}
            </div>
            <div className="text-caption-2 text-label-500">평균 이상</div>
          </div>
          <div>
            <div className="text-title-4 font-semibold text-primary-600">
              {Math.round(sortedSkills.reduce((sum, skill) => sum + skill.level, 0) / sortedSkills.length)}
            </div>
            <div className="text-caption-2 text-label-500">평균 점수</div>
          </div>
          <div>
            <div className="text-title-4 font-semibold text-label-700">
              {Math.round(sortedSkills.reduce((sum, skill) => sum + skill.average, 0) / sortedSkills.length)}
            </div>
            <div className="text-caption-2 text-label-500">업계 평균</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillBarChart;