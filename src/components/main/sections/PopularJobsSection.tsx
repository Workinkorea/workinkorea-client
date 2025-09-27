import { MapPin, Clock, ChevronRight } from 'lucide-react';

const popularJobs = [
  {
    id: 1,
    company: '네이버',
    position: '글로벌 비즈니스 개발팀',
    location: '서울 • 프리미어',
    salary: '5,000만원 - 8,000만원',
    type: '정규직',
    tags: ['JavaScript', 'TypeScript', 'React'],
    isRecent: true,
  },
  {
    id: 2,
    company: '카카오',
    position: 'Back-End 개발자',
    location: '서울 • 전자',
    salary: '4,500만원 - 6,000만원',
    type: '정규직',
    tags: ['Java', 'Spring', 'Kubernetes'],
    isRecent: false,
  },
  {
    id: 3,
    company: 'LG대부',
    position: '해외영업 담당자',
    location: '서울 • 영등포',
    salary: '4,000만원 - 7,500만원',
    type: '정규직',
    tags: ['영업', '해외영업', '비즈니스'],
    isRecent: true,
  },
  {
    id: 4,
    company: '삼성전자',
    position: '마케팅 전문가',
    location: '서울 • 강남',
    salary: '4,200만원 - 6,500만원',
    type: '정규직',
    tags: ['마케팅', '브랜딩', '디지털'],
    isRecent: false,
  },
  {
    id: 5,
    company: '현대자동차',
    position: 'UX/UI 디자이너',
    location: '서울 • 압구정',
    salary: '3,800만원 - 5,500만원',
    type: '정규직',
    tags: ['UI/UX', 'Figma', 'Design'],
    isRecent: true,
  },
  {
    id: 6,
    company: '토스',
    position: 'QA 엔지니어',
    location: '서울 • 강남',
    salary: '4,000만원 - 6,000만원',
    type: '정규직',
    tags: ['QA', 'Testing', 'Automation'],
    isRecent: false,
  },
];

export default function PopularJobsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-title-1 font-bold text-gray-900 mb-4">
            인기 공고
          </h2>
          <p className="text-body-1 text-gray-600">
            지금 가장 주목받는 기업들의 채용공고입니다
          </p>
        </div>

        {/* 공고 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {popularJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* 회사명과 시간 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-title-4 text-gray-900 group-hover:text-green-600 transition-colors">
                      {job.company}
                    </h3>
                    {job.isRecent && (
                      <span className="inline-flex items-center gap-1 text-body-3 text-green-600">
                        <Clock className="w-4 h-4" />
                        신규
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 포지션 */}
              <h4 className="text-title-4 font-medium text-gray-900 mb-3 line-clamp-2">
                {job.position}
              </h4>

              {/* 위치와 급여 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-body-3">{job.location}</span>
                  <span className="text-body-3">• {job.type}</span>
                </div>
                <p className="text-green-600 font-semibold text-body-2">{job.salary}</p>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-caption-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 더 보기 버튼 */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-body-1">
            더 많은 공고 보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}