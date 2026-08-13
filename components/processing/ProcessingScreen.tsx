"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ProcessingOverlay } from "@/components/processing/ProcessingOverlay";
import { StagingPageHeader } from "@/components/staging/StagingPageHeader";
import { TransformationDocuments } from "@/components/staging/TransformationDocuments";
import { UploadZoneCard } from "@/components/staging/UploadZoneCard";
import { ValidationPipeline } from "@/components/staging/ValidationPipeline";
import { runComparison } from "@/lib/api/comparisons";
import { getActiveBatch } from "@/lib/session/batch";
import { stagingCopy, uploadZones } from "@/lib/mock/staging";

export function ProcessingScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const batch = getActiveBatch();
      if (!batch?.batchId) {
        router.replace("/staging");
        return;
      }

      try {
        await runComparison(batch.batchId);
        if (!cancelled) {
          router.replace("/reports");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Comparison failed");
        window.setTimeout(() => {
          if (!cancelled) router.replace("/reports");
        }, 2500);
      }
    }

    void run();

    return () => {
      cancelled = true;
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

      <ProcessingOverlay />
    </div>
  );
}
