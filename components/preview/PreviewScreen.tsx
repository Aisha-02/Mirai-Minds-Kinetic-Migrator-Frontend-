"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { PreviewFileList } from "@/components/preview/PreviewFileList";
import { Icon } from "@/components/ui/Icon";
import {
  fetchBatchFiles,
  type BatchUploadFileSummary,
} from "@/lib/api/comparisons";
import { previewCopy } from "@/lib/mock/preview";
import { getActiveBatch } from "@/lib/session/batch";

export function PreviewScreen() {
  const [files, setFiles] = useState<BatchUploadFileSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const batch = getActiveBatch();
      if (!batch?.batchId) {
        if (!cancelled) {
          setBatchId(null);
          setFiles([]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setBatchId(batch.batchId);
        setLoading(true);
        setError(null);
      }

      try {
        const result = await fetchBatchFiles(batch.batchId);
        if (cancelled) return;
        setFiles(result.files);
      } catch (err) {
        if (cancelled) return;
        setFiles([]);
        setError(
          err instanceof Error ? err.message : "Failed to load uploaded files",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="display" />
      <TopAppBar variant="preview" />

      <main className="ml-0 flex h-screen flex-col overflow-y-auto px-section-padding pt-[88px] pb-container-margin md:ml-sidebar-width md:px-container-margin">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/staging"
              className="mb-1 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              <Icon name="arrow_back" className="text-[16px]" />
              {previewCopy.backLabel}
            </Link>
            <h2 className="font-display-lg text-display-lg text-on-surface">
              {previewCopy.pageTitle}
            </h2>
            {batchId ? (
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Batch {batchId}
              </p>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Loading uploaded files…
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 font-body-sm text-body-sm text-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !batchId ? (
          <div className="rounded-xl border border-white/5 bg-surface-container p-8 text-center">
            <Icon
              name="upload_file"
              className="mb-3 text-4xl text-on-surface-variant"
            />
            <p className="font-headline-sm text-headline-sm text-on-surface">
              No active batch
            </p>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              Complete a preload/postload upload on Staging first. Files from
              that batch will appear here.
            </p>
            <Link
              href="/staging"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-headline-sm text-headline-sm font-bold text-on-primary"
            >
              Go to Staging
            </Link>
          </div>
        ) : null}

        {!loading && batchId ? (
          <PreviewFileList
            files={files}
            selectedId={selectedId}
            onSelect={(file) => setSelectedId(file.id)}
          />
        ) : null}

        {selectedId ? (
          <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
            File selected. ALV-style grid view comes in Stage B.
          </p>
        ) : null}
      </main>
    </div>
  );
}
