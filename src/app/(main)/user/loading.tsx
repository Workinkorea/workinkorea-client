import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export default function UserLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" color="blue" />
    </div>
  );
}
