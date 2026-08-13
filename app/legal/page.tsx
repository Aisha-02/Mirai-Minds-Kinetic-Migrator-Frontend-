import type { Metadata } from "next";
import { LegalScreen } from "@/components/legal/LegalScreen";

export const metadata: Metadata = {
  title: "Legal Center | Kinetic Migrator",
  description: "Terms of Service, Privacy Policy, GDPR, and data security.",
};

export default function LegalPage() {
  return <LegalScreen />;
}
