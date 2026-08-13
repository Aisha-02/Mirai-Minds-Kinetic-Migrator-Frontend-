"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StagingPageHeader } from "@/components/staging/StagingPageHeader";
import { TransformationDocuments } from "@/components/staging/TransformationDocuments";
import { UploadZoneCard } from "@/components/staging/UploadZoneCard";
import { ValidationPipeline } from "@/components/staging/ValidationPipeline";
import {
  COMPARISON_BUSINESS_OBJECTS,
  isNeedsBusinessObject,
  uploadPostload,
  uploadPreload,
} from "@/lib/api/comparisons";
import { storeActiveBatch } from "@/lib/session/batch";
import { stagingCopy, uploadZones } from "@/lib/mock/staging";

export function StagingScreen() {
  const router = useRouter();
  const [preloadFile, setPreloadFile] = useState<File | null>(null);
  const [postloadFile, setPostloadFile] = useState<File | null>(null);
  const [businessObject, setBusinessObject] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [needsBo, setNeedsBo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const canProcess = Boolean(preloadFile && postloadFile);

  const zonesById = useMemo(() => {
    const map: Record<string, (typeof uploadZones)[number]> = {};
    for (const zone of uploadZones) {
      map[zone.id] = zone;
    }
    return map;
  }, []);

  async function handleProcess() {
    if (!preloadFile || !postloadFile) {
      setError("Select both preload and postload files");
      return;
    }

    setProcessing(true);
    setError(null);
    setStatus(null);

    try {
      setStatus("Uploading preload…");
      const preload = await uploadPreload(preloadFile, {
        businessObject: businessObject || undefined,
      });

      setStatus("Uploading postload…");
      await uploadPostload(postloadFile, preload.batch_id);

      storeActiveBatch({
        batchId: preload.batch_id,
        businessObject: preload.business_object,
        identifierColumns: preload.identifier_columns,
      });

      setNeedsBo(false);
      setStatus("Uploads complete. Starting comparison…");
      router.push("/processing");
    } catch (err) {
      if (isNeedsBusinessObject(err)) {
        setNeedsBo(true);
        setCandidates(
          err.body.candidates?.length
            ? err.body.candidates
            : [...COMPARISON_BUSINESS_OBJECTS],
        );
        setError(
          err.message ||
            "Couldn’t auto-detect business object — select one and try again",
        );
      } else {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <SideNav activeKey="upload" />
      <TopAppBar variant="staging" pageTitle={stagingCopy.pageTitle} />

      <main className="flex min-h-screen w-full flex-col bg-background pt-16 md:pl-sidebar-width">
        <div className="mx-auto flex w-full max-w-[1600px] flex-grow flex-col gap-6 p-section-padding lg:p-container-margin">
          <StagingPageHeader
            onProcess={handleProcess}
            processing={processing}
            disabled={!canProcess}
          />

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="font-body-sm text-body-sm text-primary" role="status">
              {status}
            </p>
          ) : null}

          {needsBo ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
              <label className="mb-2 block font-body-sm text-body-sm text-on-surface">
                Business object
              </label>
              <select
                className="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 font-body-md text-body-md text-white"
                value={businessObject}
                onChange={(event) => setBusinessObject(event.target.value)}
              >
                <option value="">Select business object…</option>
                {candidates.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {candidate}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="grid min-h-[300px] grid-cols-1 gap-6 lg:grid-cols-2">
            <UploadZoneCard
              zone={zonesById.source}
              fileName={preloadFile?.name}
              disabled={processing}
              onFileSelected={setPreloadFile}
            />
            <UploadZoneCard
              zone={zonesById.target}
              fileName={postloadFile?.name}
              disabled={processing}
              onFileSelected={setPostloadFile}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ValidationPipeline />
            <TransformationDocuments />
          </div>
        </div>
      </main>
    </div>
  );
}
