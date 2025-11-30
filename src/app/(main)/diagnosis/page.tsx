import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import DiagnosisClient from '@/components/pages/DiagnosisClient';

export const metadata: Metadata = createMetadata({
  title: '자가진단 - WorkInKorea',
  description: '나에게 맞는 직업을 찾기 위한 자가진단을 시작하세요.',
});

export default function DiagnosisPage() {
  return <DiagnosisClient />;
}
