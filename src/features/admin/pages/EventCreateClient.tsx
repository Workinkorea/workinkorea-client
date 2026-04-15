'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
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
    <section className="bg-white border border-line-400 rounded-xl p-6 space-y-5">
      <h3 className="text-body-2 font-bold text-label-900 pb-3 border-b border-line-200">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function EventCreateClient() {
  const t = useTranslations('admin.events.create');
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error(t('validationTitle'));
      return;
    }
    if (!form.start_date || !form.end_date) {
      toast.error(t('validationDates'));
      return;
    }
    if (form.start_date > form.end_date) {
      toast.error(t('validationDateOrder'));
      return;
    }
    if (!form.content.trim()) {
      toast.error(t('validationContent'));
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
      toast.success(t('createSuccess'));
      router.push('/admin/events');
    } catch {
      toast.error(t('createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-caption-2 font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Admin
          </p>
          <h2 className="text-title-3 font-extrabold text-label-900">{t('pageTitle')}</h2>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-caption-1 text-label-500 hover:text-label-900 transition-colors cursor-pointer"
        >
          {t('backToList')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 기본 정보 */}
        <FormSection title={t('sectionBasic')}>
          {/* 제목 */}
          <div>
            <FormLabel required>{t('fieldEventTitle')}</FormLabel>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={t('fieldEventTitlePlaceholder')}
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-body-3 text-label-800 placeholder:text-label-400 bg-white',
                'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                'transition-colors',
              )}
            />
          </div>

          {/* 유형 + 대상 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel required>{t('fieldEventType')}</FormLabel>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as EventType)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-body-3 text-label-800 bg-white',
                  'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                  'transition-colors cursor-pointer',
                )}
              >
                <option value="notice">{t('typeNotice')}</option>
                <option value="event">{t('typeEvent')}</option>
                <option value="promotion">{t('typePromotion')}</option>
              </select>
            </div>

            <div>
              <FormLabel required>{t('fieldTarget')}</FormLabel>
              <select
                value={form.target}
                onChange={(e) => set('target', e.target.value as EventTarget)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-body-3 text-label-800 bg-white',
                  'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                  'transition-colors cursor-pointer',
                )}
              >
                <option value="all">{t('targetAll')}</option>
                <option value="user">{t('targetUser')}</option>
                <option value="company">{t('targetCompany')}</option>
              </select>
            </div>
          </div>

          {/* 시작일 + 종료일 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel required>{t('fieldStartDate')}</FormLabel>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set('start_date', e.target.value)}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-body-3 text-label-800 bg-white',
                  'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                  'transition-colors cursor-pointer',
                )}
              />
            </div>
            <div>
              <FormLabel required>{t('fieldEndDate')}</FormLabel>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => set('end_date', e.target.value)}
                min={form.start_date}
                className={cn(
                  'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                  'text-body-3 text-label-800 bg-white',
                  'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                  'transition-colors cursor-pointer',
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* 컨텐츠 */}
        <FormSection title={t('sectionContent')}>
          <div>
            <FormLabel required>{t('fieldContent')}</FormLabel>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={8}
              placeholder={t('fieldContentPlaceholder')}
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-body-3 text-label-800 placeholder:text-label-400 bg-white',
                'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                'transition-colors resize-none',
              )}
            />
          </div>

          <div>
            <FormLabel>{t('fieldBannerUrl')}</FormLabel>
            <input
              type="url"
              value={form.banner_url}
              onChange={(e) => set('banner_url', e.target.value)}
              placeholder="https://..."
              className={cn(
                'w-full px-3.5 py-2.5 border border-line-400 rounded-lg',
                'text-body-3 text-label-800 placeholder:text-label-400 bg-white',
                'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
                'transition-colors',
              )}
            />
            <p className="text-caption-2 text-label-400 mt-1">{t('fieldBannerUrlHint')}</p>
          </div>
        </FormSection>

        {/* 게시 설정 */}
        <FormSection title={t('sectionPublish')}>
          <div>
            <FormLabel required>{t('fieldPublishStatus')}</FormLabel>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map((val) => (
                <label
                  key={val}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer',
                    'text-body-3 font-medium transition-colors',
                    form.status === val
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-line-400 bg-white text-label-600 hover:border-primary-200',
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    value={val}
                    checked={form.status === val}
                    onChange={() => set('status', val)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      form.status === val ? 'border-primary-500' : 'border-line-400',
                    )}
                  >
                    {form.status === val && (
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </span>
                  {val === 'active' ? t('statusActive') : t('statusInactive')}
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
              'px-5 py-2.5 rounded-lg text-body-3 font-semibold transition-colors cursor-pointer',
              'border border-line-400 bg-white text-label-700',
              'hover:bg-label-100',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            )}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-5 py-2.5 rounded-lg text-body-3 font-semibold transition-colors cursor-pointer',
              'bg-primary-600 text-white hover:bg-primary-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </button>
        </div>
      </form>
    </Container>
  );
}
