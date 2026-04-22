import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';
import { UserSettingsClient } from '@/features/profile/pages/UserSettingsClient';

export async function generateMetadata() {
  return getPageMetadata('settings');
}

export default function UserSettingsPage() {
  return <UserSettingsClient />;
}
