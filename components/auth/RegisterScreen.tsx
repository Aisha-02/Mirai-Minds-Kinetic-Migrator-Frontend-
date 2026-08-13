import { AuthBackground } from "@/components/auth/AuthBackground";
import { RegisterCard } from "@/components/auth/RegisterCard";

export function RegisterScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto bg-background text-on-background">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md p-section-padding sm:py-container-margin">
        <RegisterCard />
      </div>
    </div>
  );
}
