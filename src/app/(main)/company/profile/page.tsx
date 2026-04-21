import { redirect } from 'next/navigation';

/**
 * ISSUE-129: /company/profile 접근 시 편집 페이지로 리다이렉트.
 * 별도 뷰 페이지가 없어 404 가 발생하던 문제를 해결한다.
 * 추후 뷰 페이지가 생기면 이 파일을 대체한다.
 */
export default function CompanyProfilePage() {
  redirect('/company/profile/edit');
}
