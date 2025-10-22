import SignupComponent from "@/components/signup/SignupComponent";

interface SignupPageProps {
  searchParams: {
    user_email?: string;
  };
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { user_email: userEmail } = await searchParams;

  return (
    <SignupComponent userEmail={userEmail} />
  )
};