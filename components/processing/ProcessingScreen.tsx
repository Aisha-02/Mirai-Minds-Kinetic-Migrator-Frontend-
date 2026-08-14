"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ProcessingOverlay } from "@/components/processing/ProcessingOverlay";
import { StagingPageHeader } from "@/components/staging/StagingPageHeader";
import { TransformationDocuments } from "@/components/staging/TransformationDocuments";
import { UploadZoneCard } from "@/components/staging/UploadZoneCard";
import { ValidationPipeline } from "@/components/staging/ValidationPipeline";
import { runComparison, waitForComparisonReport } from "@/lib/api/comparisons";
import {
  buildProcessingStatusText,
  buildProcessingSteps,
} from "@/lib/mock/processing";
import { getActiveBatch } from "@/lib/session/batch";
import { stagingCopy, uploadZones } from "@/lib/mock/staging";

export function ProcessingScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(5);

  const steps = useMemo(() => buildProcessingSteps(progress), [progress]);
  const statusText = useMemo(
    () => buildProcessingStatusText(progress),
    [progress],
  );

  useEffect(() => {
    let cancelled = false;
    let progressTimer: ReturnType<typeof setInterval> | null = null;

    progressTimer = setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;
        const increment = current < 40 ? 4 : current < 75 ? 2 : 1;
        return Math.min(92, current + increment);
      });
    }, 500);

    async function run() {
      const batch = getActiveBatch();
      if (!batch?.batchId) {
        router.replace("/staging");
        return;
      }

      try {
        await runComparison(batch.batchId);
        if (cancelled) return;
        await waitForComparisonReport(batch.batchId);
        if (cancelled) return;
        setProgress(100);
        window.setTimeout(() => {
          if (!cancelled) router.replace(`/reports/${batch.batchId}`);
        }, 600);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Comparison failed");
        setProgress(100);
        window.setTimeout(() => {
          if (!cancelled) router.replace(`/reports/${batch.batchId}`);
        }, 2500);
      }
    }

    void run();

    return () => {
      cancelled = true;
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <SideNav activeKey="upload" />
      <TopAppBar variant="staging" pageTitle={stagingCopy.pageTitle} />

      <main className="flex min-h-screen w-full flex-col bg-background pt-16 md:pl-sidebar-width">
        <div className="mx-auto flex w-full max-w-[1600px] flex-grow flex-col gap-6 p-section-padding lg:p-container-margin">
          <StagingPageHeader disabled />

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid min-h-[300px] grid-cols-1 gap-6 lg:grid-cols-2">
            {uploadZones.map((zone) => (
              <UploadZoneCard key={zone.id} zone={zone} disabled />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ValidationPipeline />
            <TransformationDocuments />
          </div>
        </div>
      </main>

      <ProcessingOverlay
        progressPercent={progress}
        statusText={statusText}
        steps={steps}
      />
    </div>
  );
}
