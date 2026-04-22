import { describe, it, expect } from 'vitest';
import { FetchError } from '@/shared/api/fetchClient';
import { normalizeFetchError } from '../normalizeFetchError';

describe('normalizeFetchError', () => {
  it('422 FastAPI validation 에러 → 필드별 에러 맵 반환', () => {
    const error = new FetchError('Validation Error', 422, {
      detail: [
        { loc: ['body', 'title'], msg: '제목을 입력해주세요', type: 'value_error' },
        { loc: ['body', 'schools', 0, 'school_name'], msg: '학교명 필수', type: 'value_error' },
      ],
    });

    const result = normalizeFetchError(error);

    expect(result.fieldErrors).toEqual({
      title: '제목을 입력해주세요',
      school_name: '학교명 필수',
    });
    expect(result.formMessage).toBe('');
  });

  it('422 detail 이 문자열이면 formMessage 로 반환', () => {
    const error = new FetchError('Bad Request', 422, {
      detail: '잘못된 요청입니다.',
    });

    const result = normalizeFetchError(error);

    expect(result.fieldErrors).toEqual({});
    expect(result.formMessage).toBe('잘못된 요청입니다.');
  });

  it('500 서버 에러 → 서버 오류 메시지 반환', () => {
    const error = new FetchError('Internal Server Error', 500, null);

    const result = normalizeFetchError(error);

    expect(result.fieldErrors).toEqual({});
    expect(result.formMessage).toBe(
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    );
  });

  it('네트워크 에러 (FetchError 아닌 Error) → 일반 메시지', () => {
    const error = new Error('Failed to fetch');

    const result = normalizeFetchError(error);

    expect(result.fieldErrors).toEqual({});
    expect(result.formMessage).toBe('Failed to fetch');
  });

  it('알 수 없는 에러 타입 → 기본 메시지', () => {
    const result = normalizeFetchError('string error');

    expect(result.fieldErrors).toEqual({});
    expect(result.formMessage).toBe('알 수 없는 오류가 발생했습니다.');
  });

  it('422 detail 배열에 loc 이 없으면 msg 합산으로 formMessage', () => {
    const error = new FetchError('Validation Error', 422, {
      detail: [
        { msg: '에러 1' },
        { msg: '에러 2' },
      ],
    });

    const result = normalizeFetchError(error);

    expect(result.fieldErrors).toEqual({});
    expect(result.formMessage).toBe('에러 1, 에러 2');
  });
});
