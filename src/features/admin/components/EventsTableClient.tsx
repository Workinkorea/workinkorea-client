'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';
import { adminApi } from '@/features/admin/api/adminApi';
import type { AdminEvent, UpdateAdminEventRequest } from '@/shared/types/api';

const LIMIT = 10;

// ── 뱃지 ────────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: AdminEvent['type'] }) {
  const t = useTranslations('admin.events');
  const styles = {
    notice: 'bg-primary-100 text-primary-700',
    event: 'bg-status-caution-bg text-status-caution',
    promotion: 'bg-status-correct-bg text-status-correct',
  };
  const labels = {
    notice: t('typeBadgeNotice'),
    event: t('typeBadgeEvent'),
    promotion: t('typeBadgePromotion'),
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold', styles[type])}>
      {labels[type]}
    </span>
  );
}

function StatusBadge({ status }: { status: AdminEvent['status'] }) {
  const t = useTranslations('admin.events');
  return status === 'active' ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold bg-status-correct-bg text-status-correct">
      {t('statusActive')}
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold bg-label-100 text-label-500">
      {t('statusInactive')}
    </span>
  );
}

// ── 수정 모달 ────────────────────────────────────────────────────────────────
interface EditModalProps {
  event: AdminEvent;
  onClose: () => void;
  onSave: (data: UpdateAdminEventRequest) => void;
  isSaving: boolean;
}

function EditModal({ event, onClose, onSave, isSaving }: EditModalProps) {
  const t = useTranslations('admin.events');
  const [form, setForm] = useState<UpdateAdminEventRequest>({
    title: event.title,
    type: event.type,
    target: event.target,
    status: event.status,
    start_date: event.start_date,
    end_date: event.end_date,
    content: event.content,
    banner_url: event.banner_url ?? '',
  });

  const set = <K extends keyof UpdateAdminEventRequest>(key: K, val: UpdateAdminEventRequest[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const inputCls = cn(
    'w-full px-3.5 py-2.5 border border-line-400 rounded-lg text-body-3 text-label-800 bg-white',
    'focus:outline-none focus:border-primary-500 focus:ring-[3px] focus:ring-blue-100 transition-colors',
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-200">
          <h3 className="text-body-1 font-bold text-label-900">{t('editModal.title')}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-label-400 hover:text-label-700 hover:bg-label-50 transition-colors focus:outline-none cursor-pointer"
            aria-label={t('editModal.close')}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">
              {t('editModal.fieldTitle')} <span className="text-status-error">{t('editModal.fieldTitleRequired')}</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className={inputCls}
            />
          </div>

          {/* 유형 + 대상 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldType')}</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as AdminEvent['type'])}
                className={cn(inputCls, 'cursor-pointer')}
              >
                <option value="notice">{t('typeBadgeNotice')}</option>
                <option value="event">{t('typeBadgeEvent')}</option>
                <option value="promotion">{t('typeBadgePromotion')}</option>
              </select>
            </div>
            <div>
              <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldTarget')}</label>
              <select
                value={form.target}
                onChange={(e) => set('target', e.target.value as AdminEvent['target'])}
                className={cn(inputCls, 'cursor-pointer')}
              >
                <option value="all">{t('targetAll')}</option>
                <option value="user">{t('targetUser')}</option>
                <option value="company">{t('targetCompany')}</option>
              </select>
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldStartDate')}</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set('start_date', e.target.value)}
                className={cn(inputCls, 'cursor-pointer')}
              />
            </div>
            <div>
              <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldEndDate')}</label>
              <input
                type="date"
                value={form.end_date}
                min={form.start_date}
                onChange={(e) => set('end_date', e.target.value)}
                className={cn(inputCls, 'cursor-pointer')}
              />
            </div>
          </div>

          {/* 게시 상태 */}
          <div>
            <label className="block text-caption-1 font-semibold text-label-700 mb-2">{t('editModal.fieldStatus')}</label>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map((s) => (
                <label
                  key={s}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer text-body-3 font-medium transition-colors',
                    form.status === s
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-line-400 text-label-600 hover:border-primary-200',
                  )}
                >
                  <input
                    type="radio"
                    name="edit-status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => set('status', s)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      form.status === s ? 'border-primary-500' : 'border-line-400',
                    )}
                  >
                    {form.status === s && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                  </span>
                  {s === 'active' ? t('editModal.statusActive') : t('editModal.statusInactive')}
                </label>
              ))}
            </div>
          </div>

          {/* 본문 */}
          <div>
            <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldContent')}</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={5}
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          {/* 배너 URL */}
          <div>
            <label className="block text-caption-1 font-semibold text-label-700 mb-1.5">{t('editModal.fieldBannerUrl')}</label>
            <input
              type="url"
              value={form.banner_url ?? ''}
              onChange={(e) => set('banner_url', e.target.value || undefined)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line-200">
          <button
            onClick={onClose}
            className={cn(
              'px-5 py-2.5 rounded-lg text-body-3 font-semibold transition-colors cursor-pointer',
              'border border-line-400 text-label-700 hover:bg-label-50',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            )}
          >
            {t('editModal.cancel')}
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className={cn(
              'px-5 py-2.5 rounded-lg text-body-3 font-semibold transition-colors cursor-pointer',
              'bg-primary-600 text-white hover:bg-primary-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSaving ? t('editModal.saving') : t('editModal.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────
interface EventsTableClientProps {
  initialData: AdminEvent[];
}

export function EventsTableClient({ initialData }: EventsTableClientProps) {
  const t = useTranslations('admin.events');
  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const queryClient = useQueryClient();

  const { data: events = initialData, isLoading } = useQuery({
    queryKey: ['admin', 'events', page],
    queryFn: () => adminApi.getEvents(page * LIMIT, LIMIT),
    initialData: page === 0 ? initialData : undefined,
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdminEventRequest }) =>
      adminApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success(t('editModal.updateSuccess'));
      setSelectedEvent(null);
    },
    onError: () => toast.error(t('editModal.updateError')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success(t('editModal.deleteSuccess'));
    },
    onError: () => toast.error(t('editModal.deleteError')),
  });

  const handleDelete = (event: AdminEvent) => {
    if (!window.confirm(t('editModal.deleteConfirm', { title: event.title }))) return;
    deleteMutation.mutate(event.id);
  };

  const handleSave = (data: UpdateAdminEventRequest) => {
    if (!selectedEvent) return;
    updateMutation.mutate({ id: selectedEvent.id, data });
  };

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-caption-2 font-semibold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
          <h2 className="text-title-3 font-extrabold text-label-900">{t('pageTitle')}</h2>
        </div>
        <Link
          href="/admin/events/create"
          className={cn(
            'px-5 py-2.5 rounded-lg text-body-3 font-semibold transition-colors cursor-pointer',
            'bg-primary-600 text-white hover:bg-primary-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          )}
        >
          {t('createButton')}
        </Link>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-line-400">
        <table className="w-full text-body-3">
          <thead>
            <tr className="bg-label-50 border-b border-line-400">
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-12">
                {t('tableIdCol')}
              </th>
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider">
                {t('tableTitleCol')}
              </th>
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-24">
                {t('tableTypeCol')}
              </th>
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-24">
                {t('tableTargetCol')}
              </th>
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-20">
                {t('tableStatusCol')}
              </th>
              <th className="px-4 py-3 text-left text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-48">
                {t('tablePeriodCol')}
              </th>
              <th className="px-4 py-3 text-right text-caption-2 font-semibold text-label-500 uppercase tracking-wider w-28">
                {t('tableActionCol')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-4 bg-label-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-label-400 text-body-3">
                  {t('noEvents')}{' '}
                  <Link href="/admin/events/create" className="text-primary-600 hover:underline font-semibold">
                    {t('noEventsCreate')}
                  </Link>
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="hover:bg-label-50 transition-colors">
                  <td className="px-4 py-3.5 text-label-500 font-mono text-caption-2">{ev.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-label-800 line-clamp-1">{ev.title}</p>
                    {ev.banner_url && (
                      <p className="text-caption-3 text-label-400 mt-0.5 truncate max-w-xs">{t('bannerAttached')}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <TypeBadge type={ev.type} />
                  </td>
                  <td className="px-4 py-3.5 text-label-600 text-caption-1">
                    {ev.target === 'all' ? t('targetAll') : ev.target === 'user' ? t('targetUser') : t('targetCompany')}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ev.status} />
                  </td>
                  <td className="px-4 py-3.5 text-caption-1 text-label-600 whitespace-nowrap">
                    {ev.start_date} ~ {ev.end_date}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className={cn(
                          'px-3 py-1.5 text-caption-2 font-semibold rounded-lg transition-colors cursor-pointer',
                          'border border-line-400 text-label-600 hover:bg-label-50',
                          'focus:outline-none',
                        )}
                      >
                        {t('editButton')}
                      </button>
                      <button
                        onClick={() => handleDelete(ev)}
                        disabled={deleteMutation.isPending}
                        className={cn(
                          'px-3 py-1.5 text-caption-2 font-semibold rounded-lg transition-colors cursor-pointer',
                          'bg-status-error-bg text-status-error hover:bg-red-100',
                          'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        {t('deleteButton')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-body-3 text-label-500">
          {t('paginationInfo', { start: page * LIMIT + 1, end: page * LIMIT + events.length })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={cn(
              'px-4 py-2 text-body-3 font-semibold rounded-lg transition-colors cursor-pointer',
              'border border-line-400 text-label-600 hover:bg-label-50',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            {t('prevPage')}
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={events.length < LIMIT}
            className={cn(
              'px-4 py-2 text-body-3 font-semibold rounded-lg transition-colors cursor-pointer',
              'border border-line-400 text-label-600 hover:bg-label-50',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            {t('nextPage')}
          </button>
        </div>
      </div>

      {/* 수정 모달 */}
      {selectedEvent && (
        <EditModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSave}
          isSaving={updateMutation.isPending}
        />
      )}
    </>
  );
}
