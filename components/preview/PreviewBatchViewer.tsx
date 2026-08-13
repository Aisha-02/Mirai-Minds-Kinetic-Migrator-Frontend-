"use client";

import { useCallback, useEffect, useState } from "react";
import { PreviewDataTable } from "@/components/preview/PreviewDataTable";
import { PreviewFileList } from "@/components/preview/PreviewFileList";
import { Icon } from "@/components/ui/Icon";
import {
  fetchBatchFileData,
  fetchBatchFiles,
  type BatchUploadFileData,
  type BatchUploadFileSummary,
} from "@/lib/api/comparisons";

type PreviewBatchViewerProps = {
  batchId: string;
};

export function PreviewBatchViewer({ batchId }: PreviewBatchViewerProps) {
  const [files, setFiles] = useState<BatchUploadFileSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<BatchUploadFileData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setSelectedId(null);
      setSelectedFile(null);

      try {
        const result = await fetchBatchFiles(batchId);
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
  }, [batchId]);

  const handleSelectFile = useCallback(
    async (file: BatchUploadFileSummary) => {
      setSelectedId(file.id);
      setPreviewError(null);
      setLoadingPreview(true);
      setSelectedFile(null);

      try {
        const result = await fetchBatchFileData(batchId, file.id);
        setSelectedFile(result.file);
      } catch (err) {
        setPreviewError(
          err instanceof Error ? err.message : "Failed to load file preview",
        );
      } finally {
        setLoadingPreview(false);
      }
    },
    [batchId],
  );

  return (
    <div>
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

      {!loading ? (
        <PreviewFileList
          files={files}
          selectedId={selectedId}
          onSelect={handleSelectFile}
        />
      ) : null}

      {loadingPreview ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
          <Icon
            name="progress_activity"
            className="animate-spin text-primary"
          />
          <p className="font-body-md text-body-md text-on-surface">
            Loading file preview…
          </p>
        </div>
      ) : null}

      {previewError ? (
        <p className="mt-4 font-body-sm text-body-sm text-error" role="alert">
          {previewError}
        </p>
      ) : null}

      {selectedFile && !loadingPreview ? (
        <PreviewDataTable key={selectedFile.id} file={selectedFile} />
      ) : null}
    </div>
  );
}
