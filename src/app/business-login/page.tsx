'use client';

import { Suspense } from "react";
import BusinessLoginForm from "@/components/business-login/BusinessLoginForm";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";

function BusinessLoginContent() {

  return (
    <>
      <Layout>
        <Header type="business" />
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