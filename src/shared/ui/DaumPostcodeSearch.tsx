'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface DaumPostcodeData {
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
  [key: string]: string | undefined;
}

interface DaumPostcode {
  new (options: { oncomplete: (data: DaumPostcodeData) => void; width: string; height: string }): {
    open: () => void;
  };
}

declare global {
  interface Window {
    daum?: {
      Postcode: DaumPostcode;
    };
  }
}

interface DaumPostcodeSearchProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const DaumPostcodeSearch: React.FC<DaumPostcodeSearchProps> = ({
  value,
  onChange,
  placeholder = '주소를 검색하세요',
  className = '',
  error,
}) => {
  const [address, setAddress] = useState(value);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const handleSearchClick = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        // 도로명 주소 우선, 없으면 지번 주소 사용
        const fullAddress = data.roadAddress || data.jibunAddress;

        // 건물명이 있는 경우 추가
        const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
        const finalAddress = fullAddress + extraAddress;

        setAddress(finalAddress);
        onChange(finalAddress);
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          readOnly
          placeholder={placeholder}
          onClick={handleSearchClick}
          className={`flex-1 min-w-0 px-3 py-2 border ${
            error ? 'border-red-500' : 'border-slate-200'
          } rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="shrink-0 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Search size={14} />
          <span className="text-xs font-medium">주소검색</span>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DaumPostcodeSearch;
