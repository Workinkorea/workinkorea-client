'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobsPaginationClientProps {
  currentPage: number;
  totalPages: number;
}

export default function JobsPaginationClient({ currentPage, totalPages }: JobsPaginationClientProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/jobs?page=${newPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              aria-label={`${pageNum} 페이지`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
