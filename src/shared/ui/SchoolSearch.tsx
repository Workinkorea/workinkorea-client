'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { KOREAN_SCHOOLS } from '@/shared/constants/schools';

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
      <div className={`flex items-center border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white ${className}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2 bg-transparent outline-none text-body-3 placeholder:text-slate-400"
        />
        <div className="flex items-center gap-1 pr-2 shrink-0">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <Search size={16} className="text-slate-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-slate-500 text-caption-2">
              검색 중...
            </div>
          ) : schools.length > 0 ? (
            <ul>
              {schools.map((school, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(school)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-body-3 text-slate-900 border-b border-slate-100 last:border-b-0"
                >
                  {school}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-slate-500 text-caption-2">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;
