import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignInFooter } from "@/components/auth/SignInFooter";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInHeader } from "@/components/auth/SignInHeader";

export function SignInCard() {
  return (
    <GlassPanel className="flex flex-col gap-8 p-8">
      <SignInHeader />
      <SignInForm />
      <SignInFooter />
    </GlassPanel>
  );
}
