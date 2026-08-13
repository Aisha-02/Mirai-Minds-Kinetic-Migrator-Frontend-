import type { Metadata } from "next";
import { SignInScreen } from "@/components/auth/SignInScreen";

export const metadata: Metadata = {
  title: "Sign In | Kinetic Migrator",
  description: "Sign in to access Data Migration Console.",
};

export default function SignInPage() {
  return <SignInScreen />;
}
