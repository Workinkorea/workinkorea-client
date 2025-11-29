'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { KOREAN_SCHOOLS } from '@/constants/schools';

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
    // 검색어로 필터링
    const filtered = KOREAN_SCHOOLS.filter(school =>
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
