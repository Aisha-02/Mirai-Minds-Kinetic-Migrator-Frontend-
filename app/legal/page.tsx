import type { Metadata } from "next";
import { LegalCenterScreen } from "@/components/legal/LegalCenterScreen";

export const metadata: Metadata = {
  title: "Legal Center | Kinetic Migrator",
  description:
    "Terms of Service, Privacy Policy, GDPR, and data security documentation for Kinetic Migrator.",
};

export default function LegalPage() {
  return <LegalCenterScreen />;
}
