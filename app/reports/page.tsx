import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ReportsHistoryScreen } from "@/components/reports/ReportsHistoryScreen";

export const metadata: Metadata = {
  title: "Reports | Kinetic Migrator",
  description:
    "Review your history of uploaded files and generated comparison reports.",
};

export default function ReportsPage() {
  return (
    <RequireAuth roles={["normal_user"]}>
      <ReportsHistoryScreen />
    </RequireAuth>
  );
}
