"use client";

import { useState } from "react";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { FieldMappingTable } from "@/components/mapping/FieldMappingTable";
import { MappingAiAssistantPanel } from "@/components/mapping/MappingAiAssistantPanel";
import { MappingConfidenceCard } from "@/components/mapping/MappingConfidenceCard";
import { MigrationProgressCard } from "@/components/mapping/MigrationProgressCard";
import { mappingCopy } from "@/lib/mock/mapping";

export function MappingHubScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md text-on-background antialiased">
      <AdminSideNav activeKey="analysis" />
      <TopAppBar
        variant="analysis"
        pageTitle={mappingCopy.pageTitle}
        assistantOpen={assistantOpen}
      />
      <MappingAiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <main
        className={`mt-16 ml-0 flex-1 overflow-y-auto p-section-padding transition-[margin] duration-300 md:ml-sidebar-width ${
          assistantOpen ? "xl:mr-assistant-panel-width" : "mr-0"
        }`}
      >
        <div className="flex h-full flex-col gap-grid-gutter">
          <div className="grid grid-cols-12 gap-grid-gutter">
            <MappingConfidenceCard />
            <MigrationProgressCard />
          </div>
          <FieldMappingTable onAnalyze={() => setAssistantOpen(true)} />
        </div>
      </main>
    </div>
  );
}
