'use client';

import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

// 한국어 로케일 등록
registerLocale('ko', ko);

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  className
}) => {
  const handleChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="relative">
      <ReactDatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy년 MM월 dd일"
        locale="ko"
        placeholderText={placeholder || '날짜를 선택하세요'}
        disabled={disabled}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        className={`w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${className || ''}`}
      />
      <Calendar
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
};

export default DatePicker;
