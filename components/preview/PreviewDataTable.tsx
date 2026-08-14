"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { BatchUploadFileData } from "@/lib/api/comparisons";

const PREVIEW_ROW_LIMIT = 100;

type PreviewDataTableProps = {
  file: BatchUploadFileData;
};

function formatCellValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function fileTypeLabel(fileType: string): string {
  if (fileType === "preload") return "Preload";
  if (fileType === "postload") return "Postload";
  return fileType;
}

export function PreviewDataTable({ file }: PreviewDataTableProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);

  const columns = file.columns.length
    ? file.columns
    : file.rows[0]
      ? Object.keys(file.rows[0])
      : [];
  const truncated = file.rows.length > PREVIEW_ROW_LIMIT;
  const visibleRows =
    showFullPreview || !truncated
      ? file.rows
      : file.rows.slice(0, PREVIEW_ROW_LIMIT);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-ink/10 bg-surface-container shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-surface-container-highest px-4 py-3">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {file.original_filename}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {fileTypeLabel(file.file_type)} ·{" "}
            {file.row_count.toLocaleString()} rows · {columns.length} columns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-ink/15 bg-surface-dim px-2 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
            {showFullPreview || !truncated
              ? `Showing all ${file.rows.length.toLocaleString()} rows`
              : `Showing first ${PREVIEW_ROW_LIMIT} of ${file.rows.length.toLocaleString()} rows`}
          </span>
          {truncated ? (
            <button
              type="button"
              onClick={() => setShowFullPreview((current) => !current)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-headline-sm text-headline-sm font-bold text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon name={showFullPreview ? "unfold_less" : "unfold_more"} />
              {showFullPreview ? "Show preview only" : "Full preview"}
            </button>
          ) : null}
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="p-8 text-center">
          <Icon
            name="table_rows"
            className="mb-2 text-3xl text-on-surface-variant"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No columns found in this file.
          </p>
        </div>
      ) : (
        <div className="max-h-[min(70vh,720px)] overflow-auto">
          <table className="w-full min-w-max border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-ink/10 bg-surface-container-highest">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 font-label-caps text-label-caps font-semibold tracking-wider whitespace-nowrap text-on-surface"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data text-sm">
              {visibleRows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="border-b border-ink/10 transition-colors hover:bg-ink/5"
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column}`}
                      className="max-w-xs truncate px-4 py-3 text-on-surface"
                      title={formatCellValue(row[column])}
                    >
                      {formatCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
