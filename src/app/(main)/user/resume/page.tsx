import { redirect } from 'next/navigation';

/**
 * ISSUE-110: /user/resume 는 별도 목록 페이지가 없어 프로필 이력서 탭으로 리다이렉트.
 */
export default function UserResumePage() {
  redirect('/user/profile?tab=resume');
}
