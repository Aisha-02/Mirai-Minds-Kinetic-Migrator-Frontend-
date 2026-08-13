import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ValidationScreen } from "@/components/validation/ValidationScreen";

export const metadata: Metadata = {
  title: "Data Validation Center | Kinetic Migrator",
  description:
    "Upload raw legacy data for cleaning according to validation rules.",
};

export default function ValidationPage() {
  return (
    <RequireAuth roles={["normal_user", "admin"]}>
      <ValidationScreen />
    </RequireAuth>
  );
}
