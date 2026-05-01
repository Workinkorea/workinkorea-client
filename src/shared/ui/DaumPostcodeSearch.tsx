'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

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

function DaumPostcodeSearch({
  value,
  onChange,
  placeholder = '주소를 검색하세요',
  className = '',
  error,
}: DaumPostcodeSearchProps) {
  const [address, setAddress] = useState(value);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

  const openPostcode = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
        const finalAddress = fullAddress + extraAddress;

        setAddress(finalAddress);
        onChange(finalAddress);
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  const waitForDaum = (script: HTMLScriptElement) =>
    new Promise<void>((resolve, reject) => {
      if (window.daum?.Postcode) return resolve();
      const onLoad = () => {
        if (window.daum?.Postcode) resolve();
        else reject(new Error('Daum Postcode SDK loaded but namespace missing'));
      };
      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', () => reject(new Error('Daum Postcode SDK load failed')), { once: true });
    });

  const handleSearchClick = () => {
    if (window.daum?.Postcode) {
      openPostcode();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    waitForDaum(script)
      .then(() => openPostcode())
      .catch(() => alert('주소 검색 서비스를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.'));
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
          className={cn(
            'flex-1 min-w-0 px-3 py-2 border rounded-lg text-body-3 bg-white',
            'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 cursor-pointer',
            error ? 'border-red-500' : 'border-slate-200',
          )}
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="shrink-0 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Search size={14} />
          <span className="text-caption-2 font-medium">주소검색</span>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-caption-3 text-red-500">{error}</p>
      )}
    </div>
  );
}

export default DaumPostcodeSearch;
