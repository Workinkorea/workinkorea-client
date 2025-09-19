'use client';

import { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import BusinessLoginForm from "@/components/features/business-login/BusinessLoginForm";

function BusinessLoginContent() {

  return (
    <>
      <Layout>
        <Layout.Main>
          <BusinessLoginForm />
        </Layout.Main>
      </Layout>
    </>
  );
}

export default function BusinessLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessLoginContent />
    </Suspense>
  );
}