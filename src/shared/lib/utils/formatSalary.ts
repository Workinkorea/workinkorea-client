/**
 * 급여 포맷터 — DB 값(만원 단위)을 읽기 좋은 형태로 변환
 *
 * @example
 * formatSalary(3800) → "3,800만원"
 * formatSalary(0) → "급여 협의"
 * formatSalary(null) → "급여 협의"
 * formatSalary(3800, 'Negotiable') → "3,800만원"
 * formatSalary(0, 'Negotiable') → "Negotiable"
 */
export function formatSalary(
  salary: number | null | undefined,
  negotiableLabel = '급여 협의'
): string {
  if (!salary) return negotiableLabel;
  return `${salary.toLocaleString('ko-KR')}만원`;
}
