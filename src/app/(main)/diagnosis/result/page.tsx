import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import DiagnosisResultClient from '@/features/diagnosis/pages/DiagnosisResultClient';

export const metadata: Metadata = createMetadata({
  title: '진단 결과 - WorkInKorea',
  description: '자가진단 결과를 확인하고 맞춤 정보를 받아보세요.',
});

export default function DiagnosisResultPage() {
  return <DiagnosisResultClient />;
}
