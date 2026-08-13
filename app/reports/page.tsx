import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PipelineResultsScreen } from "@/components/pipeline/PipelineResultsScreen";

export const metadata: Metadata = {
  title: "Comparison Report | Kinetic Migrator",
  description:
    "Review AI comparison narrative, structured finding counts, and download the PDF report.",
};

export default function ReportsPage() {
  return (
    <RequireAuth roles={["normal_user"]}>
      <PipelineResultsScreen />
    </RequireAuth>
  );
}
