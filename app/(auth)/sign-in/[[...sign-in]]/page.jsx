import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // Redirect to onboarding which exists in the app
  return <SignIn fallbackRedirectUrl="/onboarding" />;
}
