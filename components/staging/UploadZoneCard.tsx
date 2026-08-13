"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { UploadZoneConfig } from "@/lib/mock/staging";

type FileFormatKind = "csv" | "xlsx";

type UploadZoneCardProps = {
  zone: UploadZoneConfig;
  fileName?: string | null;
  disabled?: boolean;
  onFileSelected?: (file: File) => void;
};

const FORMAT_ACCEPT: Record<FileFormatKind, string> = {
  csv: ".csv",
  xlsx: ".xlsx",
};

function formatKindFromLabel(label: string): FileFormatKind | null {
  const normalized = label.trim().toLowerCase().replace(/^\./, "");
  if (normalized === "csv") return "csv";
  if (normalized === "xlsx" || normalized === "xls") return "xlsx";
  return null;
}

function fileExtension(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index >= 0 ? filename.slice(index).toLowerCase() : "";
}

export function UploadZoneCard({
  zone,
  fileName = null,
  disabled = false,
  onFileSelected,
}: UploadZoneCardProps) {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const xlsxInputRef = useRef<HTMLInputElement>(null);
  const [activeFormat, setActiveFormat] = useState<FileFormatKind | null>(null);
  const [formatError, setFormatError] = useState<string | null>(null);

  const badgeClass =
    zone.badgeTone === "secondary"
      ? "border-secondary/30 bg-secondary/20 text-secondary"
      : "border-primary/30 bg-primary/20 text-primary";
  const iconTone =
    zone.headerIconTone === "secondary" ? "text-secondary" : "text-primary";

  function openPicker(kind: FileFormatKind) {
    if (disabled) return;
    setFormatError(null);
    setActiveFormat(kind);
    const input = kind === "csv" ? csvInputRef.current : xlsxInputRef.current;
    // Reset so selecting the same file again still fires onChange
    if (input) input.value = "";
    input?.click();
  }

  function handleZoneActivate() {
    if (disabled) return;
    if (!activeFormat) {
      setFormatError("Choose CSV or XLSX, then select a file");
      return;
    }
    openPicker(activeFormat);
  }

  function handleFilePicked(file: File | undefined, kind: FileFormatKind) {
    if (!file) return;

    const expected = FORMAT_ACCEPT[kind];
    const ext = fileExtension(file.name);
    if (ext !== expected) {
      setFormatError(
        `That file doesn’t match the ${kind.toUpperCase()} picker. Please choose a ${expected} file.`,
      );
      const input = kind === "csv" ? csvInputRef.current : xlsxInputRef.current;
      if (input) input.value = "";
      return;
    }

    setFormatError(null);
    onFileSelected?.(file);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-high">
            <Icon name={zone.headerIcon} className={iconTone} />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-white">
              {zone.title}
            </h3>
            <p className="mt-1 font-label-caps text-label-caps font-bold uppercase text-on-surface">
              {zone.subtitle}
            </p>
          </div>
        </div>
        <span
          className={`rounded px-2 py-1 font-label-caps text-label-caps font-bold border ${badgeClass}`}
        >
          {zone.badge}
        </span>
      </div>

      <input
        ref={csvInputRef}
        type="file"
        accept={FORMAT_ACCEPT.csv}
        className="hidden"
        disabled={disabled}
        onChange={(event) =>
          handleFilePicked(event.target.files?.[0], "csv")
        }
      />
      <input
        ref={xlsxInputRef}
        type="file"
        accept={FORMAT_ACCEPT.xlsx}
        className="hidden"
        disabled={disabled}
        onChange={(event) =>
          handleFilePicked(event.target.files?.[0], "xlsx")
        }
      />

      <div
        className={`upload-zone relative flex flex-grow flex-col items-center justify-center overflow-hidden rounded-lg p-8 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={zone.dropTitle}
        onClick={handleZoneActivate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleZoneActivate();
          }
        }}
      >
        <Icon
          name="cloud_upload"
          className="mb-4 text-4xl text-on-surface transition-transform duration-300 group-hover:-translate-y-2"
        />
        <p className="mb-2 text-center font-headline-sm text-headline-sm text-white">
          {fileName || zone.dropTitle}
        </p>
        <p className="mb-6 text-center font-body-sm text-body-sm font-bold text-on-surface">
          {fileName
            ? "Click a format icon to replace file"
            : "Choose CSV or XLSX below to browse files"}
        </p>
        <div className="flex gap-3">
          {zone.formats.map((format) => {
            const kind = formatKindFromLabel(format.label);
            if (!kind) return null;
            const isActive = activeFormat === kind;
            return (
              <button
                key={format.label}
                type="button"
                disabled={disabled}
                aria-pressed={isActive}
                aria-label={`Upload ${kind.toUpperCase()} file`}
                className={`flex items-center gap-1 rounded-full border px-3 py-1 font-mono-data text-mono-data font-bold transition-colors ${
                  isActive
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-outline-variant bg-surface-container-high text-on-surface hover:border-primary/50 hover:text-primary"
                } disabled:cursor-not-allowed disabled:opacity-60`}
                onClick={(event) => {
                  event.stopPropagation();
                  openPicker(kind);
                }}
              >
                <Icon name={format.icon} className="text-[14px]" />
                {format.label}
              </button>
            );
          })}
        </div>
        {formatError ? (
          <p
            className="mt-4 text-center font-body-sm text-body-sm text-error"
            role="alert"
          >
            {formatError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
