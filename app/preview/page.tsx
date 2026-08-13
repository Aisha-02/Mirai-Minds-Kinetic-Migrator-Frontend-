import type { Metadata } from "next";
import { PreviewScreen } from "@/components/preview/PreviewScreen";

export const metadata: Metadata = {
  title: "Data Preview | Kinetic Migrator",
  description:
    "Preview preload and postload migration data in a horizontal table view.",
};

export default function PreviewPage() {
  return <PreviewScreen />;
}
