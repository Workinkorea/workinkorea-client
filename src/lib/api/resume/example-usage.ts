// Resume API 사용 예시
import { resumeApi } from '../resume';
import { ApiError } from '../client';
import type { CreateResumeRequest, UpdateResumeRequest } from '../types';

// 예시 1-1: 이력서 목록 조회 - try-catch를 사용한 에러 핸들링
async function fetchMyResumes() {
  try {
    const response = await resumeApi.getMyResumes();
    console.log('Resume List:', response.resume_list);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
          // 이력서가 없는 경우
          if (error.data.error === 'Resume list not found') {
            console.error('이력서 목록을 찾을 수 없습니다');
            // 빈 배열 반환하거나 새 이력서 작성 유도
          } else {
            console.error('잘못된 요청:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 500:
          // 서버 에러
          console.error('서버 에러:', error.data.error);
          break;
        default:
          console.error('알 수 없는 에러:', error.message);
      }
    } else {
      console.error('예상치 못한 에러:', error);
    }
    throw error;
  }
}

// 예시 1-2: 이력서 상세 조회 - try-catch를 사용한 에러 핸들링
async function fetchResumeById(resumeId: number) {
  try {
    const response = await resumeApi.getResumeById(resumeId);
    console.log('Resume Detail:', response.resume);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
          // 이력서를 찾을 수 없는 경우
          if (error.data.error === 'Resume not found') {
            console.error('이력서를 찾을 수 없습니다');
            // 목록 페이지로 리다이렉트
          } else {
            console.error('잘못된 요청:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 500:
          // 서버 에러
          console.error('서버 에러:', error.data.error);
          break;
        default:
          console.error('알 수 없는 에러:', error.message);
      }
    } else {
      console.error('예상치 못한 에러:', error);
    }
    throw error;
  }
}

// 예시 2-1: React 컴포넌트에서 이력서 목록 조회
/*
import { useState, useEffect } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { ApiError } from '@/lib/api/client';
import { ResumeListResponse } from '@/lib/api/types';

export function ResumeListComponent() {
  const [resumes, setResumes] = useState<ResumeListResponse['resume_list']>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResumes() {
      try {
        const response = await resumeApi.getMyResumes();
        setResumes(response.resume_list);
      } catch (err) {
        if (err instanceof ApiError) {
          // 에러 메시지 설정
          if (err.status === 400 && err.data.error === 'Resume list not found') {
            // 이력서가 없는 경우 빈 배열로 처리
            setResumes([]);
            setError(null);
          } else if (err.status === 401) {
            // 401 에러일 경우 로그인 페이지로 리다이렉트
            setError('인증이 필요합니다');
            window.location.href = '/login';
          } else {
            setError(err.data.error || '이력서 목록을 불러올 수 없습니다');
          }
        } else {
          setError('알 수 없는 에러가 발생했습니다');
        }
      } finally {
        setLoading(false);
      }
    }

    loadResumes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>내 이력서 목록</h1>
      {resumes.length === 0 ? (
        <p>작성한 이력서가 없습니다.</p>
      ) : (
        <ul>
          {resumes.map((resume) => (
            <li key={resume.id}>
              <h3>{resume.title}</h3>
              <p>생성일: {new Date(resume.created_at).toLocaleDateString()}</p>
              <p>수정일: {new Date(resume.updated_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
*/

// 예시 2-2: React 컴포넌트에서 이력서 상세 조회
/*
import { useState, useEffect } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { ApiError } from '@/lib/api/client';
import { ResumeDetail } from '@/lib/api/types';

interface ResumeDetailComponentProps {
  resumeId: number;
}

export function ResumeDetailComponent({ resumeId }: ResumeDetailComponentProps) {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResume() {
      try {
        const response = await resumeApi.getResumeById(resumeId);
        setResume(response.resume);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 400 && err.data.error === 'Resume not found') {
            setError('이력서를 찾을 수 없습니다');
          } else if (err.status === 401) {
            setError('인증이 필요합니다');
            window.location.href = '/login';
          } else {
            setError(err.data.error || '이력서를 불러올 수 없습니다');
          }
        } else {
          setError('알 수 없는 에러가 발생했습니다');
        }
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [resumeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!resume) return null;

  return (
    <div>
      <h1>{resume.title}</h1>
      <img src={resume.profile_url} alt="Profile" />

      <section>
        <h2>자기소개</h2>
        {resume.introduction.map((intro, index) => (
          <div key={index}>
            <h3>{intro.title}</h3>
            <p>{intro.content}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>학력</h2>
        {resume.schools.map((school, index) => (
          <div key={index}>
            <h3>{school.school_name}</h3>
            <p>{school.major_name}</p>
            <p>{school.start_date} ~ {school.end_date}</p>
            <p>{school.is_graduated ? '졸업' : '재학중'}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>경력</h2>
        {resume.career_history.map((career, index) => (
          <div key={index}>
            <h3>{career.company_name}</h3>
            <p>{career.position_title} - {career.department}</p>
            <p>{career.main_role}</p>
            <p>{career.start_date} ~ {career.end_date}</p>
            <p>{career.is_working ? '재직중' : '퇴사'}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>어학</h2>
        {resume.language_skills.map((lang, index) => (
          <div key={index}>
            <p>{lang.language_type}: {lang.level}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>자격증</h2>
        {resume.licenses.map((license, index) => (
          <div key={index}>
            <h3>{license.license_name}</h3>
            <p>{license.license_agency}</p>
            <p>{license.license_date}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
*/

// 예시 3-1: React Query를 사용한 이력서 목록 조회
/*
import { useQuery } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';

export function useMyResumes() {
  return useQuery({
    queryKey: ['myResumes'],
    queryFn: async () => {
      const response = await resumeApi.getMyResumes();
      return response.resume_list;
    },
    retry: (failureCount, error) => {
      // 401 에러는 재시도하지 않음
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// 컴포넌트에서 사용
export function ResumeListWithQuery() {
  const { data: resumes, isLoading, error } = useMyResumes();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {resumes?.map((resume) => (
        <div key={resume.id}>
          <h3>{resume.title}</h3>
          <p>{resume.created_at}</p>
        </div>
      ))}
    </div>
  );
}
*/

// 예시 3-2: React Query를 사용한 이력서 상세 조회
/*
import { useQuery } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';

export function useResumeDetail(resumeId: number) {
  return useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      const response = await resumeApi.getResumeById(resumeId);
      return response.resume;
    },
    retry: (failureCount, error) => {
      // 401, 400 에러는 재시도하지 않음
      if (error instanceof ApiError && (error.status === 401 || error.status === 400)) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!resumeId, // resumeId가 있을 때만 쿼리 실행
  });
}

// 컴포넌트에서 사용
interface ResumeDetailWithQueryProps {
  resumeId: number;
}

export function ResumeDetailWithQuery({ resumeId }: ResumeDetailWithQueryProps) {
  const { data: resume, isLoading, error } = useResumeDetail(resumeId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!resume) return null;

  return (
    <div>
      <h1>{resume.title}</h1>
      <img src={resume.profile_url} alt="Profile" />

      <h2>학력</h2>
      {resume.schools.map((school, index) => (
        <div key={index}>
          <p>{school.school_name} - {school.major_name}</p>
        </div>
      ))}

      <h2>경력</h2>
      {resume.career_history.map((career, index) => (
        <div key={index}>
          <p>{career.company_name} - {career.position_title}</p>
        </div>
      ))}
    </div>
  );
}
*/

// 예시 4: 이력서 생성 - try-catch를 사용한 에러 핸들링
async function createNewResume() {
  const resumeData: CreateResumeRequest = {
    title: 'Software Engineer Resume',
    profile_url: 'https://example.com/profile.jpg',
    language_skills: [
      {
        language_type: 'English',
        level: 'Advanced',
      },
      {
        language_type: 'Korean',
        level: 'Native',
      },
    ],
    schools: [
      {
        school_name: 'Seoul National University',
        major_name: 'Computer Science',
        start_date: '2018-03-01T00:00:00.000Z',
        end_date: '2022-02-28T00:00:00.000Z',
        is_graduated: true,
      },
    ],
    career_history: [
      {
        company_name: 'Tech Company',
        start_date: '2022-03-01T00:00:00.000Z',
        end_date: '2024-11-17T00:00:00.000Z',
        is_working: true,
        department: 'Engineering',
        position_title: 'Software Engineer',
        main_role: 'Full-stack development',
      },
    ],
    introduction: [
      {
        title: 'About Me',
        content: 'I am a passionate software engineer with 2+ years of experience.',
      },
    ],
    licenses: [
      {
        license_name: 'Engineer Information Processing',
        license_agency: 'Korea Institute of Information Technology',
        license_date: '2021-05-15T00:00:00.000Z',
      },
    ],
  };

  try {
    const response = await resumeApi.createResume(resumeData);
    console.log('Resume created successfully! Resume ID:', response.resume_id);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
          // 이력서 생성 실패
          if (error.data.error === 'Failed to create resume') {
            console.error('이력서 생성에 실패했습니다');
          } else {
            console.error('잘못된 요청:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 500:
          // 서버 에러
          console.error('서버 에러:', error.data.error);
          break;
        default:
          console.error('알 수 없는 에러:', error.message);
      }
    } else {
      console.error('예상치 못한 에러:', error);
    }
    throw error;
  }
}

// 예시 5: React 컴포넌트에서 이력서 생성
/*
import { useState } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { ApiError } from '@/lib/api/client';
import type { CreateResumeRequest } from '@/lib/api/types';

export function CreateResumeForm() {
  const [title, setTitle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const resumeData: CreateResumeRequest = {
      title,
      profile_url: profileUrl,
      language_skills: [],
      schools: [],
      career_history: [],
      introduction: [],
      licenses: [],
    };

    try {
      const response = await resumeApi.createResume(resumeData);
      setSuccessMessage(`이력서가 생성되었습니다! (ID: ${response.resume_id})`);
      // 성공 후 이력서 상세 페이지로 이동
      window.location.href = `/resume/${response.resume_id}`;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('인증이 필요합니다');
          window.location.href = '/login';
        } else if (err.status === 400) {
          setError(err.data.error || '이력서 생성에 실패했습니다');
        } else {
          setError(err.data.error || '알 수 없는 에러가 발생했습니다');
        }
      } else {
        setError('알 수 없는 에러가 발생했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>새 이력서 작성</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <div>
        <label htmlFor="title">이력서 제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="profileUrl">프로필 이미지 URL (선택)</label>
        <input
          id="profileUrl"
          type="url"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '생성 중...' : '이력서 생성'}
      </button>
    </form>
  );
}
*/

// 예시 6: React Query를 사용한 이력서 생성
/*
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';
import type { CreateResumeRequest } from '@/lib/api/types';

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeRequest) => resumeApi.createResume(data),
    onSuccess: (response) => {
      // 이력서 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['myResumes'] });
      console.log('Resume created:', response.resume_id);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    },
  });
}

// 컴포넌트에서 사용
export function CreateResumeWithMutation() {
  const createResumeMutation = useCreateResume();

  const handleCreate = () => {
    const newResume: CreateResumeRequest = {
      title: 'My New Resume',
      profile_url: 'https://example.com/profile.jpg',
      language_skills: [],
      schools: [],
      career_history: [],
      introduction: [],
      licenses: [],
    };

    createResumeMutation.mutate(newResume, {
      onSuccess: (data) => {
        alert(`이력서가 생성되었습니다! ID: ${data.resume_id}`);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          alert(`에러: ${error.data.error}`);
        }
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleCreate}
        disabled={createResumeMutation.isPending}
      >
        {createResumeMutation.isPending ? '생성 중...' : '이력서 생성'}
      </button>

      {createResumeMutation.isError && (
        <div>에러: {createResumeMutation.error.message}</div>
      )}

      {createResumeMutation.isSuccess && (
        <div>생성된 이력서 ID: {createResumeMutation.data.resume_id}</div>
      )}
    </div>
  );
}
*/

// 예시 7: 이력서 수정 - try-catch를 사용한 에러 핸들링
async function updateExistingResume(resumeId: number) {
  const updateData: UpdateResumeRequest = {
    title: 'Updated Software Engineer Resume',
    language_skills: [
      {
        language_type: 'English',
        level: 'Advanced',
      },
      {
        language_type: 'Korean',
        level: 'Native',
      },
      {
        language_type: 'Japanese',
        level: 'Intermediate',
      },
    ],
  };

  try {
    const response = await resumeApi.updateResume(resumeId, updateData);
    console.log('Resume updated successfully! Resume ID:', response.resume_id);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
          // 이력서 조회 실패 또는 변경 내용 없음
          if (error.data.error === 'Resume not found') {
            console.error('이력서를 찾을 수 없습니다');
          } else if (error.data.error === 'Resume is the same') {
            console.error('변경된 내용이 없습니다');
          } else if (error.data.error === 'Failed to update resume') {
            console.error('이력서 업데이트에 실패했습니다');
          } else {
            console.error('잘못된 요청:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 500:
          // 서버 에러
          console.error('서버 에러:', error.data.error);
          break;
        default:
          console.error('알 수 없는 에러:', error.message);
      }
    } else {
      console.error('예상치 못한 에러:', error);
    }
    throw error;
  }
}

// 예시 8: React 컴포넌트에서 이력서 수정
/*
import { useState, useEffect } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { ApiError } from '@/lib/api/client';
import type { UpdateResumeRequest, ResumeDetail } from '@/lib/api/types';

interface UpdateResumeFormProps {
  resumeId: number;
}

export function UpdateResumeForm({ resumeId }: UpdateResumeFormProps) {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [title, setTitle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 기존 이력서 데이터 불러오기
  useEffect(() => {
    async function loadResume() {
      try {
        const response = await resumeApi.getResumeById(resumeId);
        setResume(response.resume);
        setTitle(response.resume.title);
        setProfileUrl(response.resume.profile_url || '');
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.data.error || '이력서를 불러올 수 없습니다');
        } else {
          setError('알 수 없는 에러가 발생했습니다');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadResume();
  }, [resumeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const updateData: UpdateResumeRequest = {
      title,
      profile_url: profileUrl,
    };

    try {
      const response = await resumeApi.updateResume(resumeId, updateData);
      setSuccessMessage(`이력서가 수정되었습니다! (ID: ${response.resume_id})`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('인증이 필요합니다');
          window.location.href = '/login';
        } else if (err.status === 400) {
          if (err.data.error === 'Resume not found') {
            setError('이력서를 찾을 수 없습니다');
          } else if (err.data.error === 'Resume is the same') {
            setError('변경된 내용이 없습니다');
          } else if (err.data.error === 'Failed to update resume') {
            setError('이력서 업데이트에 실패했습니다');
          } else {
            setError(err.data.error || '이력서 수정에 실패했습니다');
          }
        } else {
          setError(err.data.error || '알 수 없는 에러가 발생했습니다');
        }
      } else {
        setError('알 수 없는 에러가 발생했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!resume) return <div>이력서를 찾을 수 없습니다</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>이력서 수정</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <div>
        <label htmlFor="title">이력서 제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="profileUrl">프로필 이미지 URL (선택)</label>
        <input
          id="profileUrl"
          type="url"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '수정 중...' : '이력서 수정'}
      </button>
    </form>
  );
}
*/

// 예시 9: React Query를 사용한 이력서 수정
/*
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';
import type { UpdateResumeRequest } from '@/lib/api/types';

export function useUpdateResume(resumeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateResumeRequest) =>
      resumeApi.updateResume(resumeId, data),
    onSuccess: (response) => {
      // 이력서 목록과 상세 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['myResumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      console.log('Resume updated:', response.resume_id);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        } else if (error.status === 400) {
          if (error.data.error === 'Resume is the same') {
            console.log('변경된 내용이 없습니다');
          }
        }
      }
    },
  });
}

// 컴포넌트에서 사용
interface UpdateResumeWithMutationProps {
  resumeId: number;
}

export function UpdateResumeWithMutation({ resumeId }: UpdateResumeWithMutationProps) {
  const updateResumeMutation = useUpdateResume(resumeId);

  const handleUpdate = () => {
    const updatedResume: UpdateResumeRequest = {
      title: 'Updated Resume Title',
      language_skills: [
        {
          language_type: 'English',
          level: 'Advanced',
        },
      ],
    };

    updateResumeMutation.mutate(updatedResume, {
      onSuccess: (data) => {
        alert(`이력서가 수정되었습니다! ID: ${data.resume_id}`);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.data.error === 'Resume is the same') {
            alert('변경된 내용이 없습니다');
          } else {
            alert(`에러: ${error.data.error}`);
          }
        }
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleUpdate}
        disabled={updateResumeMutation.isPending}
      >
        {updateResumeMutation.isPending ? '수정 중...' : '이력서 수정'}
      </button>

      {updateResumeMutation.isError && (
        <div>에러: {updateResumeMutation.error.message}</div>
      )}

      {updateResumeMutation.isSuccess && (
        <div>수정된 이력서 ID: {updateResumeMutation.data.resume_id}</div>
      )}
    </div>
  );
}
*/

// 예시 10: 이력서 삭제 - try-catch를 사용한 에러 핸들링
async function deleteExistingResume(resumeId: number) {
  try {
    const response = await resumeApi.deleteResume(resumeId);
    console.log('Resume deleted successfully!', response.message);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
          // 이력서 조회 실패 또는 삭제 실패
          if (error.data.error === 'Resume not found') {
            console.error('이력서를 찾을 수 없습니다');
          } else if (error.data.error === 'Failed to delete resume') {
            console.error('이력서 삭제에 실패했습니다');
          } else {
            console.error('잘못된 요청:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 500:
          // 서버 에러
          console.error('서버 에러:', error.data.error);
          break;
        default:
          console.error('알 수 없는 에러:', error.message);
      }
    } else {
      console.error('예상치 못한 에러:', error);
    }
    throw error;
  }
}

// 예시 11: React 컴포넌트에서 이력서 삭제
/*
import { useState } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { ApiError } from '@/lib/api/client';

interface DeleteResumeButtonProps {
  resumeId: number;
  onDeleted?: () => void;
}

export function DeleteResumeButton({ resumeId, onDeleted }: DeleteResumeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await resumeApi.deleteResume(resumeId);
      alert(response.message);
      // 삭제 성공 후 콜백 실행 (예: 목록 페이지로 리다이렉트)
      if (onDeleted) {
        onDeleted();
      } else {
        // 기본 동작: 목록 페이지로 이동
        window.location.href = '/resumes';
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('인증이 필요합니다');
          window.location.href = '/login';
        } else if (err.status === 400) {
          if (err.data.error === 'Resume not found') {
            setError('이력서를 찾을 수 없습니다');
          } else if (err.data.error === 'Failed to delete resume') {
            setError('이력서 삭제에 실패했습니다');
          } else {
            setError(err.data.error || '이력서 삭제에 실패했습니다');
          }
        } else {
          setError(err.data.error || '알 수 없는 에러가 발생했습니다');
        }
      } else {
        setError('알 수 없는 에러가 발생했습니다');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        {isDeleting ? '삭제 중...' : '이력서 삭제'}
      </button>
    </div>
  );
}
*/

// 예시 12: React Query를 사용한 이력서 삭제
/*
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: number) => resumeApi.deleteResume(resumeId),
    onSuccess: (response, resumeId) => {
      // 이력서 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['myResumes'] });
      // 삭제된 이력서의 상세 쿼리 제거
      queryClient.removeQueries({ queryKey: ['resume', resumeId] });
      console.log('Resume deleted:', response.message);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    },
  });
}

// 컴포넌트에서 사용
interface DeleteResumeWithMutationProps {
  resumeId: number;
  onSuccess?: () => void;
}

export function DeleteResumeWithMutation({
  resumeId,
  onSuccess
}: DeleteResumeWithMutationProps) {
  const deleteResumeMutation = useDeleteResume();

  const handleDelete = () => {
    if (!confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      return;
    }

    deleteResumeMutation.mutate(resumeId, {
      onSuccess: (data) => {
        alert(data.message);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.data.error === 'Resume not found') {
            alert('이력서를 찾을 수 없습니다');
          } else if (error.data.error === 'Failed to delete resume') {
            alert('이력서 삭제에 실패했습니다');
          } else {
            alert(`에러: ${error.data.error}`);
          }
        }
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleteResumeMutation.isPending}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        {deleteResumeMutation.isPending ? '삭제 중...' : '이력서 삭제'}
      </button>

      {deleteResumeMutation.isError && (
        <div style={{ color: 'red' }}>
          에러: {deleteResumeMutation.error.message}
        </div>
      )}
    </div>
  );
}
*/
