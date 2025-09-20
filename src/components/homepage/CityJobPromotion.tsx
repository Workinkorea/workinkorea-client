import React from 'react';

interface CityJobPromotionProps {
  className?: string;
}

export const CityJobPromotion = ({
  className = ''
}: CityJobPromotionProps) => {
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-2">상시 채용관 예약하기</h3>
        <button className="text-sm text-blue-100 hover:text-white transition-colors flex items-center gap-1">
          바로가기 →
        </button>
      </div>

      <div className="absolute right-4 top-4 opacity-20">
        <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-sm"></div>
        </div>
      </div>

      <div className="absolute right-8 bottom-4 opacity-30">
        <div className="flex gap-1">
          <div className="w-3 h-8 bg-white rounded-sm"></div>
          <div className="w-3 h-12 bg-white rounded-sm"></div>
          <div className="w-3 h-6 bg-white rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default CityJobPromotion;