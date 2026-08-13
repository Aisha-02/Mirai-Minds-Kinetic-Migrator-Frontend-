"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ActiveRulesetCard } from "@/components/validation/ActiveRulesetCard";
import { CleaningReport } from "@/components/validation/CleaningReport";
import { ExecuteCleaningButton } from "@/components/validation/ExecuteCleaningButton";
import { SourceDataUpload } from "@/components/validation/SourceDataUpload";
import { ValidationPageHeader } from "@/components/validation/ValidationPageHeader";

export function ValidationScreen() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen overflow-hidden bg-background font-body-md text-body-md text-on-surface antialiased">
      <SideNav activeKey="validate" />
      <TopAppBar variant="validation" />

      <main className="mt-16 ml-0 h-[calc(100vh-64px)] flex-1 overflow-y-auto md:ml-sidebar-width">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-section-padding md:p-8">
          <ValidationPageHeader />

          <div className="grid grid-cols-12 gap-4">
            <SourceDataUpload
              fileName={fileName}
              onFileSelected={(file) => setFileName(file.name)}
            />
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
              <ActiveRulesetCard />
              <ExecuteCleaningButton />
            </div>
          </div>

          <CleaningReport />
        </div>
      </main>
    </div>
  );
}
