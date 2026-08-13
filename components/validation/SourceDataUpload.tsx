"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { validationCopy } from "@/lib/mock/validation";

type SourceDataUploadProps = {
  fileName?: string | null;
  disabled?: boolean;
  onFileSelected?: (file: File) => void;
};

export function SourceDataUpload({
  fileName = null,
  disabled = false,
  onFileSelected,
}: SourceDataUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function acceptFile(file: File | undefined | null) {
    if (!file || disabled) return;
    onFileSelected?.(file);
  }

  return (
    <div className="workspace-glass flex flex-col gap-4 rounded-xl p-6 col-span-12 lg:col-span-8">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">
        {validationCopy.sourceTitle}
      </h3>
      <div
        className={`drop-zone flex cursor-pointer flex-col items-center justify-center rounded-lg bg-surface-container-lowest/50 px-6 py-12 text-center transition-colors hover:bg-surface-container-low ${
          dragging ? "dragover" : ""
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          acceptFile(event.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <Icon
          name="cloud_upload"
          className="mb-4 text-[48px] text-outline-variant"
        />
        <h4 className="mb-1 font-headline-sm text-headline-sm text-on-surface">
          {fileName || validationCopy.dropTitle}
        </h4>
        <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
          {fileName ? "Click to replace preload file" : validationCopy.dropHint}
        </p>
        <button
          type="button"
          className="rounded border border-white/10 bg-surface-bright px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-white/5"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {validationCopy.browseLabel}
        </button>
        <input
          ref={inputRef}
          accept=".csv,.xlsx"
          className="hidden"
          type="file"
          disabled={disabled}
          onChange={(event) => acceptFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
}
