'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';

interface JusoResult {
  roadAddr: string;
  jibunAddr: string;
  zipNo: string;
  bdNm: string;
}

interface AddressSearchProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  value,
  onChange,
  placeholder = '주소를 검색하세요',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [addresses, setAddresses] = useState<JusoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (term.length < 2) {
      setAddresses([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    try {
      // 행정안전부 주소 검색 API 호출
      const confmKey = process.env.NEXT_PUBLIC_JUSO_API_KEY || '';

      if (!confmKey) {
        console.error('주소 검색 API 키가 설정되지 않았습니다.');
        setAddresses([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${confmKey}&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(term)}&resultType=json`
      );

      const data = await response.json();

      if (data.results?.common?.errorCode === '0' && data.results?.juso) {
        setAddresses(data.results.juso);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (address: JusoResult) => {
    const fullAddress = `${address.roadAddr}${address.bdNm ? ` (${address.bdNm})` : ''}`;
    setSearchTerm(fullAddress);
    onChange(fullAddress);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setAddresses([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-24 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-label-400 hover:text-label-600 rounded cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSearch(searchTerm)}
            className="px-2 py-1 text-primary-600 hover:bg-primary-50 rounded cursor-pointer"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-line-300 rounded-lg shadow-strong max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-label-500 text-caption-1">
              주소 검색 중...
            </div>
          ) : addresses.length > 0 ? (
            <ul>
              {addresses.map((address, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(address)}
                  className="px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-line-200 last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-body-3 text-label-900 font-medium">
                        {address.roadAddr}
                      </div>
                      <div className="text-caption-1 text-label-500 mt-1">
                        지번: {address.jibunAddr}
                      </div>
                      {address.zipNo && (
                        <div className="text-caption-2 text-label-400 mt-0.5">
                          우편번호: {address.zipNo}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 && !loading ? (
            <div className="p-4 text-center">
              <div className="text-label-500 text-caption-1">
                검색 결과가 없습니다
              </div>
              <div className="text-label-400 text-caption-2 mt-1">
                다른 검색어를 입력해주세요
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-label-500 text-caption-1">
              2자 이상 입력 후 검색해주세요
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
