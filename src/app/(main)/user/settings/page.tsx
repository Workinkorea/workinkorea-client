import { redirect } from 'next/navigation';

/**
 * ISSUE-110: /user/settings 는 프로필 편집 페이지(설정 섹션 포함)로 리다이렉트.
 */
export default function UserSettingsPage() {
  redirect('/user/profile/edit');
}
