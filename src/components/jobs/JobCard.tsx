import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import type { CompanyPost } from '@/lib/api/types';

interface JobCardProps {
  post: CompanyPost;
}

export default function JobCard({ post }: JobCardProps) {
  const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const language = post.language ? post.language.split(',').map(l => l.trim()) : [];

  return (
    <Link
      href={`/jobs/${post.id}`}
      className="bg-white border border-line-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* 회사명과 시간 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {post.company_id}
          </div>
          <div>
            <h3 className="font-semibold text-title-4 text-gray-900 group-hover:text-primary-500 transition-colors">
              회사 #{post.company_id}
            </h3>
            {isRecent && (
              <span className="inline-flex items-center gap-1 text-body-3 text-primary-500">
                <Clock className="w-4 h-4" />
                신규
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 포지션 */}
      <h4 className="text-title-4 font-medium text-gray-900 mb-3 line-clamp-2">
        {post.title}
      </h4>

      {/* 위치와 급여 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-body-3">{post.work_location}</span>
          <span className="text-body-3">• {post.employment_type}</span>
        </div>
        <p className="text-primary-500 font-semibold text-body-2">
          {post.salary ? `${post.salary.toLocaleString()}원` : '연봉 협의'}
        </p>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2">
        {language.slice(0, 3).map((lang, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-caption-1 rounded-md"
          >
            {lang}
          </span>
        ))}
      </div>
    </Link>
  );
}
