import { describe, it, expect, vi, beforeEach } from 'vitest';
import { focusFirstError } from '../focusFirstError';

describe('focusFirstError', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('첫 에러 필드에 focus + scrollIntoView 호출', () => {
    // DOM 에 input 배치
    const input = document.createElement('input');
    input.setAttribute('name', 'title');
    document.body.appendChild(input);

    const focusSpy = vi.spyOn(input, 'focus');
    const scrollSpy = vi.spyOn(input, 'scrollIntoView');

    focusFirstError({
      title: { message: '제목 필수', type: 'required' },
      description: { message: '설명 필수', type: 'required' },
    });

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(scrollSpy).toHaveBeenCalledWith({
      block: 'center',
      behavior: 'smooth',
    });
  });

  it('중첩 에러에서 첫 번째 에러의 dot-path 를 name 으로 탐색', () => {
    const input = document.createElement('input');
    input.setAttribute('name', 'schools.0.school_name');
    document.body.appendChild(input);

    const focusSpy = vi.spyOn(input, 'focus');

    focusFirstError({
      schools: {
        0: {
          school_name: { message: '학교명 필수', type: 'required' },
        },
      },
    });

    expect(focusSpy).toHaveBeenCalled();
  });

  it('에러가 비어있으면 아무 일도 하지 않음', () => {
    const input = document.createElement('input');
    input.setAttribute('name', 'title');
    document.body.appendChild(input);

    const focusSpy = vi.spyOn(input, 'focus');

    focusFirstError({});

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('DOM 에 해당 필드가 없으면 에러 없이 무시', () => {
    // body 가 비어있음
    expect(() => {
      focusFirstError({
        missingField: { message: 'err', type: 'required' },
      });
    }).not.toThrow();
  });

  it('id 로도 요소를 찾을 수 있다', () => {
    const input = document.createElement('input');
    input.id = 'email';
    document.body.appendChild(input);

    const focusSpy = vi.spyOn(input, 'focus');

    focusFirstError({
      email: { message: '이메일 필수', type: 'required' },
    });

    expect(focusSpy).toHaveBeenCalled();
  });
});
