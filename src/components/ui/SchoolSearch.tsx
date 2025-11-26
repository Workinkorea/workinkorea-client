'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SchoolSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({
  value,
  onChange,
  placeholder = '학교명을 입력하세요',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [schools, setSchools] = useState<string[]>([]);
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
      setSchools([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    // 한국 대학교 목록 (샘플 - 실제로는 API를 사용하거나 더 많은 학교 목록이 필요)
    const sampleSchools = [
      '서울대학교', '연세대학교', '고려대학교', '한양대학교', '성균관대학교',
      '경희대학교', '중앙대학교', '이화여자대학교', '서강대학교', '건국대학교',
      '동국대학교', '홍익대학교', '숙명여자대학교', '서울시립대학교', '국민대학교',
      '광운대학교', '명지대학교', '상명대학교', '세종대학교', '단국대학교',
      '한국외국어대학교', '숭실대학교', '아주대학교', '인하대학교', '가천대학교',
      '경기대학교', '한국항공대학교', '가톨릭대학교', '한국산업기술대학교', '서울과학기술대학교',
      '부산대학교', '경북대학교', '전남대학교', '전북대학교', '충남대학교',
      '충북대학교', '강원대학교', '제주대학교', '인천대학교', '울산대학교',
      '영남대학교', '계명대학교', '동아대학교', '부경대학교', '경상국립대학교'
    ];

    // 검색어로 필터링
    const filtered = sampleSchools.filter(school =>
      school.toLowerCase().includes(term.toLowerCase())
    );

    setTimeout(() => {
      setSchools(filtered);
      setLoading(false);
    }, 300);
  };

  const handleSelect = (school: string) => {
    setSearchTerm(school);
    onChange(school);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setSchools([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-20 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
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
          <Search size={16} className="text-label-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-line-300 rounded-lg shadow-strong max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-label-500 text-caption-1">
              검색 중...
            </div>
          ) : schools.length > 0 ? (
            <ul>
              {schools.map((school, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(school)}
                  className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-body-3 text-label-900 border-b border-line-200 last:border-b-0"
                >
                  {school}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-label-500 text-caption-1">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;
