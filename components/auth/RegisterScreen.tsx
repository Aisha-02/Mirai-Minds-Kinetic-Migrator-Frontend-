import { AuthBackground } from "@/components/auth/AuthBackground";
import { RegisterCard } from "@/components/auth/RegisterCard";

export function RegisterScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-on-background">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md p-section-padding">
        <RegisterCard />
      </div>
    </div>
  );
}
