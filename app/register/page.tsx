import type { Metadata } from "next";
import { RegisterScreen } from "@/components/auth/RegisterScreen";

export const metadata: Metadata = {
  title: "Create Account | Kinetic Migrator",
  description: "Register to start your SAP migration journey with Kinetic Migrator.",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
