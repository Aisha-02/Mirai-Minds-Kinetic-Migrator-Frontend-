"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  downloadTransformationDocument,
  fetchTransformationDocuments,
  type TransformationDocument,
} from "@/lib/api/documents";
import { stagingCopy } from "@/lib/mock/staging";

const CATEGORY_ICONS: Record<string, string> = {
  source_rule: "description",
  validation_rule: "verified",
  mapping_files: "account_tree",
};

function iconForCategory(category: string): string {
  return CATEGORY_ICONS[category] || "description";
}

export function TransformationDocuments() {
  const [documents, setDocuments] = useState<TransformationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const rows = await fetchTransformationDocuments();
        if (!cancelled) setDocuments(rows);
      } catch (err) {
        if (!cancelled) {
          setDocuments([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load transformation documents",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = useCallback(async (doc: TransformationDocument) => {
    setDownloadingId(doc.id);
    setError(null);
    try {
      await downloadTransformationDocument(doc.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to download document",
      );
    } finally {
      setDownloadingId(null);
    }
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-center gap-3">
          <Icon name="tune" className="text-tertiary" />
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {stagingCopy.documentsTitle}
          </h3>
        </div>
        <span className="rounded border border-outline-variant bg-surface-container-high px-2 py-1 font-label-caps text-label-caps font-bold text-on-surface">
          {documents.length > 0
            ? `${documents.length} available`
            : stagingCopy.documentsBadge}
        </span>
      </div>

      <div className="flex flex-grow flex-col gap-4">
        {loading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Loading documents…
          </p>
        ) : null}

        {error ? (
          <p className="font-body-sm text-body-sm text-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && documents.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No transformation documents uploaded yet. Ask an admin to upload
            source rules, validation rules, and mapping files.
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => handleDownload(doc)}
              disabled={downloadingId === doc.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant bg-surface-container-highest p-3 transition-colors hover:bg-surface-container-high disabled:opacity-60"
            >
              <div className="flex min-w-0 items-center gap-3 text-left">
                <Icon
                  name={iconForCategory(doc.category)}
                  className="shrink-0 text-[20px] text-on-surface"
                />
                <div className="min-w-0">
                  <span className="block truncate font-headline-sm text-headline-sm text-on-surface">
                    {doc.label}
                  </span>
                  <span className="mt-0.5 block truncate font-body-sm text-body-sm text-on-surface-variant">
                    {doc.original_filename}
                  </span>
                </div>
              </div>
              <Icon
                name={
                  downloadingId === doc.id ? "progress_activity" : "download"
                }
                className={`shrink-0 text-primary ${downloadingId === doc.id ? "animate-spin" : ""}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
