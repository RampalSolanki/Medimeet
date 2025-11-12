import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // Redirect to onboarding which exists in the app
  return <SignUp fallbackRedirectUrl="/onboarding" />;
}
