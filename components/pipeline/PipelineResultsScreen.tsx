"use client";

import Link from "next/link";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ComparisonReportView } from "@/components/pipeline/ComparisonReportView";
import { Icon } from "@/components/ui/Icon";
import { getActiveBatch } from "@/lib/session/batch";
import { useMemo } from "react";

export function PipelineResultsScreen() {
  const batchId = useMemo(() => getActiveBatch()?.batchId ?? null, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-lowest text-white antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen bg-background p-section-padding pt-[88px] transition-all duration-300 md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          {!batchId ? (
            <div className="mb-6 rounded-xl border border-outline-variant bg-surface-container p-8 text-center">
              <Icon
                name="assessment"
                className="mb-3 text-4xl text-on-surface-variant"
              />
              <p className="font-headline-sm text-headline-sm text-on-surface">
                No comparison batch yet
              </p>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Upload preload and postload files, then run a comparison to see
                results here.
              </p>
              <Link
                href="/staging"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-headline-sm text-headline-sm font-bold text-on-primary"
              >
                Go to Staging
              </Link>
            </div>
          ) : (
            <ComparisonReportView batchId={batchId} poll />
          )}
        </div>
      </main>
    </div>
  );
}
