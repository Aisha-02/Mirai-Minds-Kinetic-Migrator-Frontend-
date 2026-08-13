import { AuthBackground } from "@/components/auth/AuthBackground";
import { SignInCard } from "@/components/auth/SignInCard";

export function SignInScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-on-background">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md p-section-padding">
        <SignInCard />
      </div>
    </div>
  );
}
