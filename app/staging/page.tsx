import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { StagingScreen } from "@/components/staging/StagingScreen";

export const metadata: Metadata = {
  title: "Data Staging Center | Kinetic Migrator",
  description:
    "Stage legacy source data alongside target structures for AI-assisted mapping and validation.",
};

export default function StagingPage() {
  return (
    <RequireAuth roles={["normal_user"]}>
      <StagingScreen />
    </RequireAuth>
  );
}
