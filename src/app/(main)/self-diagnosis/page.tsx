import SelfDiagnosisClient from '@/features/diagnosis/pages/SelfDiagnosisClient';
import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('diagnosis');
}

export default function SelfDiagnosisPage() {
  return <SelfDiagnosisClient />;
}
