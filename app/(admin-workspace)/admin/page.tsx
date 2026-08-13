import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AdminRuleHubScreen } from "@/components/admin/AdminRuleHubScreen";

export const metadata: Metadata = {
  title: "Admin Configuration Hub | Kinetic Migrator",
  description:
    "Manage global rule definitions, pipeline telemetry, and source-to-destination mappings.",
};

export default function AdminPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <AdminRuleHubScreen />
    </RequireAuth>
  );
}
