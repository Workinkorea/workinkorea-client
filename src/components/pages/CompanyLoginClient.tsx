'use client';

import { Suspense } from "react";
import BusinessLoginForm from "@/components/company-login/BusinessLoginForm";

function BusinessLoginContent() {
  return (
    <>
      <BusinessLoginForm />
    </>
  );
}

export default function CompanyLoginClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessLoginContent />
    </Suspense>
  );
}