'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Container } from '@/shared/components/layout/Container';
import { cn } from '@/shared/lib/utils/utils';
import { adminApi } from '@/features/admin/api/adminApi';

type EventType = 'notice' | 'event' | 'promotion';
type EventTarget = 'all' | 'user' | 'company';
type EventStatus = 'active' | 'inactive';

interface EventFormData {
  title: string;
  type: EventType;
  target: EventTarget;
  status: EventStatus;
  start_date: string;
  end_date: string;
  content: string;
  banner_url: string;
}

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: '이벤트' },
  { value: 'promotion', label: '프로모션' },
];

const EVENT_TARGET_OPTIONS: { value: EventTarget; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'user', label: '일반 회원' },
  { value: 'company', label: '기업 회원' },
];

const INITIAL_FORM: EventFormData = {
  title: '',
  type: 'notice',
  target: 'all',
  status: 'active',
  start_date: '',
  end_date: '',
  content: '',
  banner_url: '',
};

function FormLabel({ required, children }: { required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">
      {children}
      {required && <span className="text-status-error ml-0.5">*</span>}
    </label>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-background-default border border-line-400 rounded-xl p-6 space-y-5">
      <h3 className="text-body-2 font-bold text-label-900 pb-3 border-b border-line-200">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function EventCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('이벤트 제목을 입력해주세요.');
      return;
    }
    if (!form.start_date || !form.end_date) {
      toast.error('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    if (form.start_date > form.end_date) {
      toast.error('종료일은 시작일 이후여야 합니다.');
      return;
    }
    if (!form.content.trim()) {
      toast.error('이벤트 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.createEvent({
        title: form.title,
        type: form.type,
        target: form.target,
        status: form.status,
        start_date: form.start_date,
        end_date: form.end_date,
        content: form.content,
        banner_url: form.banner_url || undefined,
      });
      toast.success('이벤트가 생성되었습니다.');
      router.push('/admin/events');
    } catch {
      toast.error('이벤트 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-caption-2 font-semibold text-blue-600 uppercase tracking-widest mb-1">
            Admin
          </p>
          <h2 className="text-title-3 font-extrabold text-label-900">이벤트 생성</h2>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-caption-1 text-label-500 hover:text-label-900 transition-colors cursor-pointer"
        >
          ← 목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 기본 정보 */}
        <FormSection title="기본 정보">
          {/* 제목 */}
          <div>
            <FormLabel required>이벤트 제목</FormLabel>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="이벤트 제목을 입력하세요"
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-sm text-label-800 placeholder:text-label-400 bg-background-default',
                'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                'transition-colors',
              )}
            />
          </div>

          {/* 유형 + 대상 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel required>이벤트 유형</FormLabel>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as EventType)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-sm text-label-800 bg-background-default',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'transition-colors cursor-pointer',
                )}
              >
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel required>노출 대상</FormLabel>
              <select
                value={form.target}
                onChange={(e) => set('target', e.target.value as EventTarget)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-sm text-label-800 bg-background-default',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'transition-colors cursor-pointer',
                )}
              >
                {EVENT_TARGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 시작일 + 종료일 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel required>시작일</FormLabel>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set('start_date', e.target.value)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-sm text-label-800 bg-background-default',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'transition-colors cursor-pointer',
                )}
              />
            </div>
            <div>
              <FormLabel required>종료일</FormLabel>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => set('end_date', e.target.value)}
                min={form.start_date}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-sm text-label-800 bg-background-default',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'transition-colors cursor-pointer',
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* 컨텐츠 */}
        <FormSection title="이벤트 내용">
          <div>
            <FormLabel required>본문</FormLabel>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={8}
              placeholder="이벤트 내용을 입력하세요"
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-sm text-label-800 placeholder:text-label-400 bg-background-default',
                'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                'transition-colors resize-none',
              )}
            />
          </div>

          <div>
            <FormLabel>배너 이미지 URL</FormLabel>
            <input
              type="url"
              value={form.banner_url}
              onChange={(e) => set('banner_url', e.target.value)}
              placeholder="https://..."
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-sm text-label-800 placeholder:text-label-400 bg-background-default',
                'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                'transition-colors',
              )}
            />
            <p className="text-xs text-label-400 mt-1">선택 사항입니다. 비워두면 배너 없이 표시됩니다.</p>
          </div>
        </FormSection>

        {/* 게시 설정 */}
        <FormSection title="게시 설정">
          <div>
            <FormLabel required>게시 상태</FormLabel>
            <div className="flex gap-3">
              {([
                { value: 'active', label: '활성 (즉시 게시)' },
                { value: 'inactive', label: '비활성 (임시 저장)' },
              ] as const).map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer',
                    'text-sm font-medium transition-colors',
                    form.status === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-line-400 bg-background-default text-label-600 hover:border-blue-200',
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={form.status === opt.value}
                    onChange={() => set('status', opt.value)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      form.status === opt.value ? 'border-blue-500' : 'border-line-300',
                    )}
                  >
                    {form.status === opt.value && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </span>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
              'border border-line-400 bg-background-default text-label-700',
              'hover:bg-background-alternative',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            )}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
              'bg-blue-600 text-white hover:bg-blue-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? '생성 중...' : '이벤트 생성'}
          </button>
        </div>
      </form>
    </Container>
  );
}
