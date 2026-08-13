import type { Metadata } from "next";
import { MappingHubScreen } from "@/components/mapping/MappingHubScreen";

export const metadata: Metadata = {
  title: "AI Analysis & Mapping Hub | Kinetic Migrator",
  description:
    "Review AI-assisted field mappings from legacy data to SAP S/4HANA.",
};

export default function AnalysisPage() {
  return <MappingHubScreen />;
}
