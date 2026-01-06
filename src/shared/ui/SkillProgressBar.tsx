'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/utils';

/**
 * SkillProgressBar Component
 *
 * Displays user skill scores compared to average scores.
 * Includes animated progress bar with average marker and dynamic coloring.
 *
 * @example
 * <SkillProgressBar
 *   value={85}
 *   average={70}
 *   label="Communication"
 * />
 */

interface SkillProgressBarProps {
  value: number; // 사용자 값 (0-100)
  average?: number; // 평균 값 (0-100)
  label?: string;
  showValues?: boolean;
  className?: string;
  barHeight?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({
  value,
  average,
  label,
  showValues = true,
  className = '',
  barHeight = 'md',
  color = 'primary'
}) => {
  // 값이 평균보다 높은지 확인
  const isAboveAverage = average ? value > average : false;
  
  // 바 높이 클래스
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  // 색상 클래스
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500', 
    success: 'bg-status-correct',
    warning: 'bg-status-caution',
    danger: 'bg-status-error'
  };

  // 평균보다 높으면 성공 색상, 낮으면 경고 색상
  const dynamicColor = average ? (isAboveAverage ? 'success' : 'warning') : color;

  return (
    <div className={cn('w-full', className)}>
      {/* 라벨과 값 표시 */}
      {(label || showValues) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-body-3 font-medium text-label-700">
              {label}
            </span>
          )}
          {showValues && (
            <div className="flex items-center gap-2 text-caption-2">
              <span className={cn(
                'font-semibold',
                isAboveAverage ? 'text-status-correct' : 'text-status-caution'
              )}>
                {value}점
              </span>
              {average && (
                <>
                  <span className="text-label-500">/</span>
                  <span className="text-label-500">평균 {average}점</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 프로그레스 바 컨테이너 */}
      <div className="relative">
        {/* 배경 바 */}
        <div className={cn(
          'w-full bg-component-alternative rounded-full overflow-hidden',
          heightClasses[barHeight]
        )}>
          {/* 사용자 점수 바 */}
          <motion.div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              colorClasses[dynamicColor]
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value, 100)}%` }}
            transition={{ 
              duration: 1,
              ease: "easeOut",
              delay: 0.2
            }}
          />
        </div>

        {/* 평균 마커 */}
        {average && (
          <motion.div
            className="absolute top-0 w-0.5 h-full bg-label-700 rounded"
            style={{ left: `${Math.min(average, 100)}%` }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ 
              duration: 0.3,
              delay: 1.2
            }}
          >
            {/* 평균 라벨 */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-label-700 text-white text-caption-2 px-1 py-0.5 rounded text-center whitespace-nowrap">
                평균
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 비교 상태 표시 */}
      {average && (
        <motion.div 
          className="mt-1 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className={cn(
            'w-2 h-2 rounded-full',
            isAboveAverage ? 'bg-status-correct' : 'bg-status-caution'
          )} />
          <span className="text-caption-2 text-label-500">
            평균보다 {isAboveAverage ? '+' : ''}{value - average}점
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default SkillProgressBar;