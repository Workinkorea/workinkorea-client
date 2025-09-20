'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupStep1() {
  const router = useRouter();

  const onClickSignup = () => {
    router.push('/signup/step2')
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[400px] w-full space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-title-2 text-label-900 mb-8">
            개인 회원가입
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={onClickSignup}
            className="cursor-pointer"
          >
            <Image
              src="/images/google_ctn.png"
              alt="google-login"
              width={240}
              height={40}
              className="h-8 w-auto"
            />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
