import type { Metadata } from 'next';
import { adminApi } from '@/features/admin/api/adminApi';
import { EventsTableClient } from '@/features/admin/components/EventsTableClient';
import type { AdminEvent } from '@/shared/types/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '이벤트 관리 | 관리자',
};

export default async function AdminEventsPage() {
  let initialEvents: AdminEvent[] = [];

  try {
    initialEvents = await adminApi.getEvents(0, 10);
  } catch {
    // 데이터 패칭 실패 시 빈 배열로 렌더링
    initialEvents = [];
  }

  return <EventsTableClient initialData={initialEvents} />;
}
