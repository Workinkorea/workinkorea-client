export type EventType = 'notice' | 'event' | 'promotion';
export type EventTarget = 'all' | 'user' | 'company';
export type EventStatus = 'active' | 'inactive';

export interface Event {
  id: number;
  title: string;
  type: EventType;
  target: EventTarget;
  status: EventStatus;
  start_date: string;
  end_date: string;
  content: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  notice: '공지사항',
  event: '이벤트',
  promotion: '프로모션',
};

export const EVENT_TARGET_LABEL: Record<EventTarget, string> = {
  all: '전체',
  user: '일반 회원',
  company: '기업 회원',
};
