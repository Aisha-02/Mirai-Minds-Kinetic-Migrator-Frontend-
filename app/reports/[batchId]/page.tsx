import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ReportsDetailScreen } from "@/components/reports/ReportsDetailScreen";

export const metadata: Metadata = {
  title: "Batch report | Kinetic Migrator",
  description:
    "View uploaded preload/postload files and the comparison report for a past batch.",
};

export default function ReportsBatchPage() {
  return (
    <RequireAuth roles={["normal_user"]}>
      <ReportsDetailScreen />
    </RequireAuth>
  );
}
