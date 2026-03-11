'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils/utils';
import { adminApi } from '@/features/admin/api/adminApi';
import type { AdminEvent, UpdateAdminEventRequest } from '@/shared/types/api';

const LIMIT = 10;

const EVENT_TYPE_LABEL = { notice: '공지사항', event: '이벤트', promotion: '프로모션' } as const;
const EVENT_TARGET_LABEL = { all: '전체', user: '일반 회원', company: '기업 회원' } as const;

// ── 뱃지 ────────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: AdminEvent['type'] }) {
  const styles = {
    notice: 'bg-blue-100 text-blue-700',
    event: 'bg-amber-50 text-amber-600',
    promotion: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold', styles[type])}>
      {EVENT_TYPE_LABEL[type]}
    </span>
  );
}

function StatusBadge({ status }: { status: AdminEvent['status'] }) {
  return status === 'active' ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
      활성
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
      비활성
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
    'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white',
    'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors',
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-900">이벤트 수정</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              제목 <span className="text-red-500">*</span>
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
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">유형</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as AdminEvent['type'])}
                className={cn(inputCls, 'cursor-pointer')}
              >
                <option value="notice">공지사항</option>
                <option value="event">이벤트</option>
                <option value="promotion">프로모션</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">대상</label>
              <select
                value={form.target}
                onChange={(e) => set('target', e.target.value as AdminEvent['target'])}
                className={cn(inputCls, 'cursor-pointer')}
              >
                <option value="all">전체</option>
                <option value="user">일반 회원</option>
                <option value="company">기업 회원</option>
              </select>
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">시작일</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set('start_date', e.target.value)}
                className={cn(inputCls, 'cursor-pointer')}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">종료일</label>
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
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">게시 상태</label>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map((s) => (
                <label
                  key={s}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-colors',
                    form.status === s
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-blue-200',
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
                      form.status === s ? 'border-blue-500' : 'border-slate-300',
                    )}
                  >
                    {form.status === s && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </span>
                  {s === 'active' ? '활성' : '비활성'}
                </label>
              ))}
            </div>
          </div>

          {/* 본문 */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">본문</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={5}
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          {/* 배너 URL */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">배너 이미지 URL</label>
            <input
              type="url"
              value={form.banner_url ?? ''}
              onChange={(e) => set('banner_url', e.target.value || undefined)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
              'border border-slate-200 text-slate-700 hover:bg-slate-50',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            )}
          >
            취소
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
              'bg-blue-600 text-white hover:bg-blue-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSaving ? '저장 중...' : '저장'}
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
      toast.success('이벤트가 수정되었습니다.');
      setSelectedEvent(null);
    },
    onError: () => toast.error('이벤트 수정에 실패했습니다.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success('이벤트가 삭제되었습니다.');
    },
    onError: () => toast.error('이벤트 삭제에 실패했습니다.'),
  });

  const handleDelete = (event: AdminEvent) => {
    if (!window.confirm(`"${event.title}" 이벤트를 삭제하시겠습니까?`)) return;
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
          <p className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest mb-1">Admin</p>
          <h2 className="text-[24px] font-extrabold text-slate-900">이벤트 관리</h2>
        </div>
        <Link
          href="/admin/events/create"
          className={cn(
            'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
            'bg-blue-600 text-white hover:bg-blue-700',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          )}
        >
          + 이벤트 생성
        </Link>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-12">
                ID
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-24">
                유형
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-24">
                대상
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-20">
                상태
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-48">
                기간
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-28">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                  등록된 이벤트가 없습니다.{' '}
                  <Link href="/admin/events/create" className="text-blue-600 hover:underline font-semibold">
                    이벤트를 생성해 주세요.
                  </Link>
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{ev.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-800 line-clamp-1">{ev.title}</p>
                    {ev.banner_url && (
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">배너 첨부됨</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <TypeBadge type={ev.type} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-[13px]">
                    {EVENT_TARGET_LABEL[ev.target]}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ev.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">
                    {ev.start_date} ~ {ev.end_date}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className={cn(
                          'px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer',
                          'border border-slate-200 text-slate-600 hover:bg-slate-50',
                          'focus:outline-none',
                        )}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(ev)}
                        disabled={deleteMutation.isPending}
                        className={cn(
                          'px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer',
                          'bg-red-50 text-red-500 hover:bg-red-100',
                          'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        삭제
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
        <p className="text-sm text-slate-500">
          {page * LIMIT + 1}~{page * LIMIT + events.length}번째 이벤트
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer',
              'border border-slate-200 text-slate-600 hover:bg-slate-50',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            이전
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={events.length < LIMIT}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer',
              'border border-slate-200 text-slate-600 hover:bg-slate-50',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            다음
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
