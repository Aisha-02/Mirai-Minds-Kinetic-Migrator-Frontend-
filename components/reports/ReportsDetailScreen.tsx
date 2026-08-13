"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ComparisonReportView } from "@/components/pipeline/ComparisonReportView";
import { PreviewBatchViewer } from "@/components/preview/PreviewBatchViewer";
import { Icon } from "@/components/ui/Icon";
import { reportsCopy } from "@/lib/mock/reports";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ReportsDetailScreen() {
  const params = useParams<{ batchId: string }>();
  const batchId = String(params?.batchId || "").trim();
  const valid = UUID_RE.test(batchId);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen p-section-padding pt-[88px] md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          <Link
            href="/reports"
            className="mb-4 inline-flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            {reportsCopy.backLabel}
          </Link>

          {!valid ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              Invalid batch id
            </p>
          ) : (
            <div className="flex flex-col gap-10">
              <section>
                <h2 className="mb-4 font-display-lg text-display-lg text-on-surface">
                  {reportsCopy.filesHeading}
                </h2>
                <PreviewBatchViewer batchId={batchId} />
              </section>
              <section>
                <ComparisonReportView batchId={batchId} />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
