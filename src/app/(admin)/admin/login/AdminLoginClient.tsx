'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { fetchClient, FetchError } from '@/shared/api/fetchClient';
import { tokenStore } from '@/shared/api/tokenStore';
import { toast } from 'sonner';

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await fetchClient.post<{ access_token?: string }>(
        '/api/auth/admin/login',
        { email, password }
      );

      if (data.access_token) tokenStore.set(data.access_token);
      login('admin');

      const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
      router.replace(callbackUrl);
    } catch (err) {
      if (err instanceof FetchError) {
        const detail = (err.data as { detail?: string } | undefined)?.detail;
        toast.error(detail ?? '로그인에 실패했습니다.');
      } else {
        toast.error('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-title-2 font-bold text-slate-900">관리자 로그인</h1>
          <p className="text-caption-1 text-slate-500 mt-1">WorkInKorea 관리자 전용</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-label-1 font-medium text-slate-700 block mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-body-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-label-1 font-medium text-slate-700 block mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-body-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-label-1"
            style={{ color: '#ffffff' }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
