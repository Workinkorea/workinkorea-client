import { CompanyPost } from '../api/types';

export const mockCompanyPosts: CompanyPost[] = [
  {
    id: 1,
    company_id: 1,
    title: '프론트엔드 개발자 (React/TypeScript) 모집',
    content: `저희 회사는 혁신적인 웹 서비스를 개발하는 IT 기업입니다.

[주요 업무]
- React 기반 웹 애플리케이션 개발
- TypeScript를 활용한 타입 안전한 코드 작성
- 반응형 UI/UX 구현
- REST API 연동 및 상태 관리
- 코드 리뷰 및 팀 협업

[우대 사항]
- Next.js 사용 경험
- 디자인 시스템 구축 경험
- 성능 최적화 경험
- Git을 활용한 협업 경험

[복지]
- 점심 식사 제공
- 최신 장비 지원
- 자기계발비 지원
- 유연 근무제`,
    work_experience: '3년 이상',
    position_id: 1,
    education: '대졸 이상',
    language: '한국어 능통',
    employment_type: '정규직',
    work_location: '서울특별시 강남구 테헤란로 427',
    working_hours: 40,
    salary: 5000,
    start_date: '2025-01-01',
    end_date: '2025-02-28',
  },
  {
    id: 2,
    company_id: 1,
    title: '백엔드 개발자 (Node.js/Python) 채용',
    content: `빠르게 성장하는 스타트업에서 백엔드 개발자를 찾습니다.

[주요 업무]
- RESTful API 설계 및 개발
- 데이터베이스 스키마 설계 및 최적화
- 서버 인프라 구축 및 관리
- 대용량 트래픽 처리
- 마이크로서비스 아키텍처 구현

[필수 역량]
- Node.js 또는 Python 실무 경험 3년 이상
- PostgreSQL/MySQL 사용 경험
- AWS 또는 GCP 경험
- Docker/Kubernetes 사용 경험

[우대 사항]
- GraphQL 경험
- CI/CD 파이프라인 구축 경험
- 대규모 시스템 설계 경험`,
    work_experience: '3년 이상',
    position_id: 2,
    education: '대졸 이상',
    language: '영어 가능',
    employment_type: '정규직',
    work_location: '서울특별시 성동구 성수이로 51',
    working_hours: 40,
    salary: 6000,
    start_date: '2025-01-15',
    end_date: '2025-03-15',
  },
  {
    id: 3,
    company_id: 1,
    title: 'DevOps 엔지니어 신입/경력 채용',
    content: `클라우드 네이티브 환경에서 함께 성장할 DevOps 엔지니어를 모집합니다.

[주요 업무]
- CI/CD 파이프라인 구축 및 운영
- Kubernetes 클러스터 관리
- 모니터링 및 로깅 시스템 구축
- 인프라 자동화
- 보안 정책 수립 및 적용

[필수 역량]
- Linux 시스템 관리 경험
- Docker 사용 경험
- Git 사용 능숙

[우대 사항]
- AWS/GCP/Azure 자격증 보유
- Terraform, Ansible 등 IaC 도구 사용 경험
- Prometheus, Grafana 사용 경험

[복지]
- 연봉 협상 가능
- 재택근무 주 2회
- 교육비 전액 지원`,
    work_experience: '경력무관',
    position_id: 5,
    education: '학력무관',
    language: '한국어 능통',
    employment_type: '정규직',
    work_location: '서울특별시 구로구 디지털로 288',
    working_hours: 40,
    salary: 4500,
    start_date: '2025-01-20',
    end_date: '2025-04-20',
  },
  {
    id: 4,
    company_id: 1,
    title: '풀스택 개발자 (React + Node.js) 모집',
    content: `프론트엔드와 백엔드를 모두 다룰 수 있는 풀스택 개발자를 찾습니다.

[주요 업무]
- 웹 애플리케이션 전체 개발
- 프론트엔드 및 백엔드 아키텍처 설계
- 데이터베이스 설계 및 API 개발
- 성능 최적화 및 테스트 코드 작성

[필수 역량]
- React 및 Node.js 실무 경험
- RESTful API 설계 및 개발 경험
- 데이터베이스 설계 경험
- Git을 활용한 협업 경험

[우대 사항]
- TypeScript 사용 경험
- AWS 또는 클라우드 서비스 경험
- 스타트업 경험`,
    work_experience: '1년 이상',
    position_id: 3,
    education: '전문대졸 이상',
    language: '한국어, 영어 모두 가능',
    employment_type: '정규직',
    work_location: '서울특별시 마포구 월드컵북로 396',
    working_hours: 40,
    salary: 4800,
    start_date: '2025-02-01',
    end_date: '2025-03-31',
  },
  {
    id: 5,
    company_id: 1,
    title: '데이터 엔지니어 채용 (신입 가능)',
    content: `데이터 파이프라인을 구축하고 관리할 데이터 엔지니어를 모집합니다.

[주요 업무]
- 데이터 파이프라인 설계 및 구축
- ETL 프로세스 개발 및 운영
- 데이터 웨어하우스 관리
- 데이터 품질 관리
- 빅데이터 처리 시스템 구축

[필수 역량]
- Python 또는 Scala 사용 가능
- SQL 활용 능력
- 데이터베이스 기본 지식

[우대 사항]
- Apache Spark, Hadoop 경험
- Airflow, Kafka 사용 경험
- AWS Redshift, BigQuery 사용 경험
- 데이터 분석 또는 머신러닝 경험

[복지]
- 신입도 지원 가능
- 멘토링 프로그램 제공
- 교육 기회 제공`,
    work_experience: '경력무관',
    position_id: 4,
    education: '대졸 이상',
    language: '한국어 능통',
    employment_type: '정규직',
    work_location: '경기도 성남시 분당구 판교역로 235',
    working_hours: 40,
    salary: 4200,
    start_date: '2025-01-10',
    end_date: '2025-02-28',
  },
];

// 특정 ID로 mock 포스트 찾기
export const getMockPostById = (id: number): CompanyPost | undefined => {
  return mockCompanyPosts.find(post => post.id === id);
};

// 새 포스트 추가 (mock)
export const addMockPost = (post: Omit<CompanyPost, 'id' | 'company_id'>): CompanyPost => {
  const newPost: CompanyPost = {
    ...post,
    id: Math.max(...mockCompanyPosts.map(p => p.id)) + 1,
    company_id: 1,
  };
  mockCompanyPosts.push(newPost);
  return newPost;
};

// 포스트 수정 (mock)
export const updateMockPost = (id: number, updates: Partial<CompanyPost>): CompanyPost | undefined => {
  const index = mockCompanyPosts.findIndex(post => post.id === id);
  if (index !== -1) {
    mockCompanyPosts[index] = { ...mockCompanyPosts[index], ...updates };
    return mockCompanyPosts[index];
  }
  return undefined;
};

// 포스트 삭제 (mock)
export const deleteMockPost = (id: number): boolean => {
  const index = mockCompanyPosts.findIndex(post => post.id === id);
  if (index !== -1) {
    mockCompanyPosts.splice(index, 1);
    return true;
  }
  return false;
};
