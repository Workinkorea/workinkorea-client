import { fetchClient } from '@/shared/api/fetchClient';
import type { Event } from '../types/event';

/**
 * 활성 이벤트 목록을 조회합니다. (공개)
 * 랜딩 페이지 등에서 사용합니다.
 */
export async function getActiveEvents(): Promise<Event[]> {
  return fetchClient.get<Event[]>('/api/events/?status=active', {
    next: { revalidate: 300, tags: ['events'] },
  });
}

/**
 * 특정 이벤트 상세 정보를 조회합니다. (공개)
 */
export async function getEventById(eventId: number): Promise<Event> {
  return fetchClient.get<Event>(`/api/events/${eventId}`, {
    next: { revalidate: 300, tags: [`event-${eventId}`] },
  });
}
