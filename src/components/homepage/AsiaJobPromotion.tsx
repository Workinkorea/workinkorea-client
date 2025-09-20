import React from 'react';

interface AsiaJobPromotionProps {
  className?: string;
}

export const AsiaJobPromotion = ({
  className = ''
}: AsiaJobPromotionProps) => {
  return (
    <div className={`bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-1">메타버스 해외취업사관</h3>
        <p className="text-sm text-orange-100 mb-3">성남국민 전월령까지</p>
        <button className="text-sm text-orange-100 hover:text-white transition-colors flex items-center gap-1">
          예약하기 →
        </button>
      </div>

      <div className="absolute right-4 top-4 opacity-20">
        <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="absolute right-8 bottom-4 opacity-30">
        <div className="w-16 h-8 bg-white rounded-lg"></div>
      </div>
    </div>
  );
};

export default AsiaJobPromotion;