"use client";

import { Icon } from "@/components/ui/Icon";
import type { BatchUploadFileSummary } from "@/lib/api/comparisons";

type PreviewFileListProps = {
  files: BatchUploadFileSummary[];
  selectedId?: string | null;
  onSelect?: (file: BatchUploadFileSummary) => void;
};

function formatUploadedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function fileTypeLabel(fileType: string): string {
  if (fileType === "preload") return "Preload";
  if (fileType === "postload") return "Postload";
  return fileType;
}

export function PreviewFileList({
  files,
  selectedId = null,
  onSelect,
}: PreviewFileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface-container p-8 text-center">
        <Icon
          name="folder_off"
          className="mb-3 text-4xl text-on-surface-variant"
        />
        <p className="font-headline-sm text-headline-sm text-on-surface">
          No uploaded files yet
        </p>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Upload preload and postload files from Staging, then return here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-container">
      <div className="border-b border-white/5 bg-surface-container-highest px-4 py-3">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Uploaded files
        </h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          Preload and postload extracts for this batch
        </p>
      </div>
      <ul className="divide-y divide-white/5">
        {files.map((file) => {
          const selected = selectedId === file.id;
          return (
            <li key={file.id}>
              <button
                type="button"
                onClick={() => onSelect?.(file)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/5 ${
                  selected ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-high">
                  <Icon
                    name={
                      file.file_type === "postload"
                        ? "account_tree"
                        : "database"
                    }
                    className={
                      file.file_type === "postload"
                        ? "text-primary"
                        : "text-secondary"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-headline-sm text-headline-sm text-on-surface">
                      {file.original_filename}
                    </span>
                    <span className="rounded border border-white/10 bg-surface-dim px-2 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
                      {fileTypeLabel(file.file_type)}
                    </span>
                  </div>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Uploaded {formatUploadedAt(file.uploaded_at)}
                    <span className="mx-2 text-outline">·</span>
                    {file.row_count.toLocaleString()} rows
                  </p>
                </div>
                <Icon
                  name="chevron_right"
                  className="shrink-0 text-on-surface-variant"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
