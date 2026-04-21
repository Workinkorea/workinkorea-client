/**
 * 서버가 내려주는 ISO 8601 문자열 또는 YYYY-MM-DD 를 사용자 친화적인 날짜로 포맷팅한다.
 *
 * 서버 응답이 `2025-12-06T01:26:26.719000Z` 처럼 raw ISO 문자열로 UI에 노출되는
 * 이슈(ISSUE-118) 방지용.
 */

const DEFAULT_LOCALE = 'ko-KR';

export function formatDate(value: string | null | undefined, locale: string = DEFAULT_LOCALE): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(value: string | null | undefined, locale: string = DEFAULT_LOCALE): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replace(/\s/g, '');
}

/**
 * 공고 기간 표시용. start == end 인 시드 데이터는 "상시"로 표기 (ISSUE-114).
 */
export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  locale: string = DEFAULT_LOCALE,
  alwaysOpenLabel: string = '상시',
): string {
  const s = formatDateShort(start, locale);
  const e = formatDateShort(end, locale);
  if (!s && !e) return '';
  if (s && e && s === e) return alwaysOpenLabel;
  if (s && e) return `${s} ~ ${e}`;
  return s || `~ ${e}`;
}

/**
 * 공고가 실제 마감되었는지 판정.
 * - end_date 가 없으면 활성으로 간주
 * - start_date == end_date (시드 데이터) 는 마감으로 보지 않음 (ISSUE-114)
 * - end_date 가 현재 시각 이전이면 마감
 */
export function isPostExpired(start: string | null | undefined, end: string | null | undefined): boolean {
  if (!end) return false;
  if (start && end && start === end) return false;
  const endDate = new Date(end);
  if (isNaN(endDate.getTime())) return false;
  return endDate.getTime() < Date.now();
}

/**
 * 남은 일수 계산. 음수면 마감, null 이면 end_date 가 없거나 유효하지 않음.
 */
export function getDaysLeft(end: string | null | undefined): number | null {
  if (!end) return null;
  const endDate = new Date(end);
  if (isNaN(endDate.getTime())) return null;
  return Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
