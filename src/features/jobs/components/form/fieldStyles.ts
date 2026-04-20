/**
 * 공통 Input/Select/Textarea 스타일 상수
 * Blue Design System 토큰 기반 — @theme CSS 변수에서 자동 생성된 Tailwind 클래스 사용
 *
 * border-slate-200 = var(--color-line-400) = #E2E8F0 (slate-200)
 * text-slate-800  = var(--color-label-800) = #1E293B (slate-800)
 * text-slate-400  = var(--color-label-400) = #94A3B8 (slate-400)
 * bg-background-default = var(--color-background-default) = #FFFFFF
 * focus ring: blue-100 = indigo-100 (#E0E7FF, @theme blue-100 오버라이드)
 */

/** 기본 Input/Select/Textarea 클래스 */
export const FIELD_BASE = [
  'w-full px-3.5 py-2.5 border rounded-lg text-body-3 transition-colors',
  'text-slate-800 bg-background-default',              // 본문 텍스트 + 흰 배경
  'placeholder:text-slate-400',                        // placeholder: slate-400
  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
  'disabled:bg-background-alternative disabled:text-slate-400 disabled:cursor-not-allowed',
].join(' ');

/** 기본(정상) 상태 보더 */
export const FIELD_DEFAULT = 'border-slate-200';        // #E2E8F0

/** 에러 상태 보더 */
export const FIELD_ERROR   = 'border-red-500 focus:border-red-500 focus:ring-red-100';

/** select 추가 클래스 */
export const FIELD_SELECT  = 'cursor-pointer appearance-none';
