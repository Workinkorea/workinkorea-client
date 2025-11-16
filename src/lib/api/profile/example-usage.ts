// 사용 예시
import { profileApi } from './getProfileCompany';
import { ApiError } from '../client';

// 예시 1: try-catch를 사용한 에러 핸들링
async function fetchCompanyProfile() {
  try {
    const profile = await profileApi.getProfileCompany();
    console.log('Company Profile:', profile);
    return profile;
  } catch (error) {
    if (error instanceof ApiError) {
      // status code별 처리
      switch (error.status) {
        case 400:
        case 500:
          // 에러 메시지 확인
          if (error.data.error === 'company not found') {
            console.error('회사를 찾을 수 없습니다');
          } else if (error.data.error === 'Company ID not found') {
            console.error('회사 ID를 찾을 수 없습니다');
          } else {
            console.error('에러:', error.data.error);
          }
          break;
        case 401:
          // access token 조회 실패
          if (error.data.error === 'Not authenticated') {
            console.error('인증되지 않았습니다');
            // 로그인 페이지로 리다이렉트
          }
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

// 예시 2: React 컴포넌트에서 사용
/*
import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api/profile/getProfileCompany';
import { ApiError } from '@/lib/api/client';
import { CompanyProfileResponse } from '@/lib/api/types';

export function CompanyProfileComponent() {
  const [profile, setProfile] = useState<CompanyProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileApi.getProfileCompany();
        setProfile(data);
      } catch (err) {
        if (err instanceof ApiError) {
          // 에러 메시지 설정
          setError(err.data.error);

          // 401 에러일 경우 로그인 페이지로 리다이렉트
          if (err.status === 401) {
            window.location.href = '/login';
          }
        } else {
          setError('알 수 없는 에러가 발생했습니다');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <div>
      <h1>{profile.company_id}</h1>
      <p>Industry: {profile.industry_type}</p>
      <p>Employees: {profile.employee_count}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
}
*/
