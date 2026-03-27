import { EventCreateClient } from '@/features/admin/pages/EventCreateClient';

export const metadata = {
  title: '이벤트 생성 | 관리자',
};

export default function AdminEventCreatePage() {
  return <EventCreateClient />;
}
