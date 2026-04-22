import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUnsavedChangesWarning } from '../useUnsavedChangesWarning';

// next/navigation mock
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/current'),
}));

describe('useUnsavedChangesWarning', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('isDirty=true 이면 beforeunload 리스너 등록', () => {
    renderHook(() =>
      useUnsavedChangesWarning({ isDirty: true }),
    );

    expect(addSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function),
    );
  });

  it('isDirty=false 이면 beforeunload 리스너 미등록', () => {
    renderHook(() =>
      useUnsavedChangesWarning({ isDirty: false }),
    );

    const beforeUnloadCalls = addSpy.mock.calls.filter(
      ([event]) => event === 'beforeunload',
    );
    expect(beforeUnloadCalls).toHaveLength(0);
  });

  it('isSubmitSuccessful=true 이면 beforeunload 비활성화', () => {
    renderHook(() =>
      useUnsavedChangesWarning({
        isDirty: true,
        isSubmitSuccessful: true,
      }),
    );

    const beforeUnloadCalls = addSpy.mock.calls.filter(
      ([event]) => event === 'beforeunload',
    );
    expect(beforeUnloadCalls).toHaveLength(0);
  });

  it('unmount 시 리스너 해제', () => {
    const { unmount } = renderHook(() =>
      useUnsavedChangesWarning({ isDirty: true }),
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function),
    );
  });
});
