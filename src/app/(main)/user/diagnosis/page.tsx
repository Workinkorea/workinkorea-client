import { redirect } from 'next/navigation';

/**
 * ISSUE-110: /user/diagnosis 는 공개 자가진단 페이지로 리다이렉트.
 */
export default function UserDiagnosisPage() {
  redirect('/diagnosis');
}
