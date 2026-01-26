import SignupComponent from "@/features/auth/components/SignupComponent";

interface SignupPageProps {
  searchParams: Promise<{
    user_email?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { user_email: userEmail } = await searchParams;

  return (
    <SignupComponent userEmail={userEmail} />
  )
};