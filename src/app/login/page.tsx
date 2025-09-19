'use client';

import { useEffect, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/features/login/LoginForm";
import { useModal } from "@/hooks/useModal";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const signupSuccessModal = useModal('signup-success');

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      signupSuccessModal.open();

      const url = new URL(window.location.href);
      url.searchParams.delete('signup');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, signupSuccessModal]);

  return (
    <>
      <Layout>
        <Layout.Main>
          <LoginForm />
        </Layout.Main>
      </Layout>
    </>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}