'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';
import { GoogleIcon } from '@/shared/ui/AccessibleIcon';
import { API_BASE_URL } from '@/shared/api/fetchClient';

export default function LoginContent() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/api/auth/login/google`;
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[400px] w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[28px] text-slate-900 mb-4">
            개인 로그인
          </h1>
          <p className="text-sm text-slate-600">
            Google 계정으로 간편하게 로그인하세요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 border-2 border-slate-200 rounded-lg font-medium text-sm hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
            aria-label="Google 계정으로 로그인"
          >
            <GoogleIcon label="Google 로고" size="md" />
            <span className="text-slate-700 font-medium ml-3">
              {isGoogleLoading ? '로그인 중...' : 'Google로 시작하기'}
            </span>
          </motion.button>

          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  기업 회원이신가요?
                </span>
              </div>
            </div>
          </div>

          <motion.a
            href="/company-login"
            className="block w-full py-3 px-4 text-center border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer"
            whileTap={{ scale: 0.98 }}
          >
            기업 로그인 페이지로 이동
          </motion.a>
        </motion.div>

        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-slate-600">
            아직 회원이 아니신가요?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
