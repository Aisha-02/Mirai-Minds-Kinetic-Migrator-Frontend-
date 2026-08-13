import { GlassPanel } from "@/components/ui/GlassPanel";
import { RegisterFooter } from "@/components/auth/RegisterFooter";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterHeader } from "@/components/auth/RegisterHeader";

export function RegisterCard() {
  return (
    <GlassPanel className="flex flex-col gap-8 p-8">
      <RegisterHeader />
      <RegisterForm />
      <RegisterFooter />
    </GlassPanel>
  );
}
