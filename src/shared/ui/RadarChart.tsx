'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RadarChartData } from '@/features/user/types/user';

interface RadarChartProps {
  data: RadarChartData;
  averageData?: RadarChartData;
  size?: number;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  averageData, 
  size = 300, 
  className = '' 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 40; // 여백을 위한 패딩
  
  // 5개 영역의 라벨과 각도
  const labels = [
    { key: 'technical', label: '기술력', angle: -90 },
    { key: 'communication', label: '소통력', angle: -18 },
    { key: 'problemSolving', label: '문제해결', angle: 54 },
    { key: 'teamwork', label: '팀워크', angle: 126 },
    { key: 'leadership', label: '리더십', angle: 198 }
  ];

  // 각도를 라디안으로 변환하고 좌표 계산
  const getCoordinates = (value: number, angle: number, maxRadius: number) => {
    const radian = (angle * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    return {
      x: centerX + r * Math.cos(radian),
      y: centerY + r * Math.sin(radian)
    };
  };

  // 배경 격자 생성 (20, 40, 60, 80, 100% 원)
  const gridLevels = [20, 40, 60, 80, 100];
  
  // 사용자 데이터 포인트들
  const userPoints = labels.map(({ key, angle }) => 
    getCoordinates(data[key as keyof RadarChartData], angle, radius)
  );

  // 평균 데이터 포인트들 (있는 경우)
  const averagePoints = averageData ? labels.map(({ key, angle }) => 
    getCoordinates(averageData[key as keyof RadarChartData], angle, radius)
  ) : [];

  // SVG 패스 생성
  const createPath = (points: { x: number; y: number }[]) => {
    return points.reduce((path, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
    }, '') + ' Z';
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 배경 격자 원들 */}
        {gridLevels.map((level, index) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / 100) * radius}
            fill="none"
            stroke="rgb(229 231 235)"
            strokeWidth={index === gridLevels.length - 1 ? 2 : 1}
            opacity={0.5}
          />
        ))}
        
        {/* 축선들 */}
        {labels.map(({ angle }, index) => {
          const endPoint = getCoordinates(100, angle, radius);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgb(229 231 235)"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* 평균 데이터 영역 (있는 경우) */}
        {averageData && averagePoints.length > 0 && (
          <motion.path
            d={createPath(averagePoints)}
            fill="rgb(156 163 175 / 0.2)"
            stroke="rgb(156 163 175)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        )}

        {/* 사용자 데이터 영역 */}
        <motion.path
          d={createPath(userPoints)}
          fill="rgb(16 185 129 / 0.2)"
          stroke="rgb(16 185 129)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />

        {/* 사용자 데이터 포인트들 */}
        {userPoints.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="rgb(16 185 129)"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
          />
        ))}

        {/* 평균 데이터 포인트들 (있는 경우) */}
        {averagePoints.map((point, index) => (
          <motion.circle
            key={`avg-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(156 163 175)"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
          />
        ))}
      </svg>

      {/* 라벨들 */}
      {labels.map(({ key, label, angle }, index) => {
        const labelPoint = getCoordinates(115, angle, radius);
        const value = data[key as keyof RadarChartData];
        const averageValue = averageData?.[key as keyof RadarChartData];
        
        return (
          <motion.div
            key={key}
            className="absolute text-center"
            style={{
              left: labelPoint.x - 30,
              top: labelPoint.y - 12,
              width: '60px'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
          >
            <div className="text-body-3 font-medium text-label-700 mb-1">
              {label}
            </div>
            <div className="text-caption-2">
              <span className="text-primary-600 font-semibold">{value}</span>
              {averageValue && (
                <>
                  <span className="text-label-500 mx-1">/</span>
                  <span className="text-label-500">{averageValue}</span>
                </>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* 범례 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4 text-caption-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-label-700">내 점수</span>
        </div>
        {averageData && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-label-500"></div>
            <span className="text-label-700">평균</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarChart;