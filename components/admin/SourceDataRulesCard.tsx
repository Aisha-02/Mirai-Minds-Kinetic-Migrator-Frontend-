"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FieldRulesDraft } from "@/lib/api/rules";
import { adminCopy } from "@/lib/mock/admin";

const iconToneClass = {
  primary: "text-primary",
  tertiary: "text-tertiary",
  error: "text-error",
} as const;

type SourceDataRulesCardProps = {
  fields: FieldRulesDraft[];
  fileName: string | null;
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
};

export function SourceDataRulesCard({
  fields,
  fileName,
  onFileSelected,
  disabled = false,
}: SourceDataRulesCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.sourceRulesTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.sourceRulesSubtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-0">
        {fields.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Icon name="upload_file" className="text-3xl text-on-surface-variant" />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Upload an Excel field metadata file to load source fields.
            </p>
            {fileName ? (
              <p className="font-mono-data text-mono-data text-primary">
                Selected: {fileName}
              </p>
            ) : null}
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-white/5 bg-surface/90 backdrop-blur-md">
              <tr>
                <th className="px-5 py-3 font-label-caps text-label-caps text-on-surface-variant">
                  Field Name
                </th>
                <th className="px-5 py-3 font-label-caps text-label-caps text-on-surface-variant">
                  Data Type
                </th>
                <th className="px-5 py-3 text-right font-label-caps text-label-caps text-on-surface-variant">
                  Rules
                </th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data text-on-surface">
              {fields.map((field) => {
                const tone =
                  field.metadata?.key === "X" ? "error" : "primary";
                return (
                  <tr
                    key={field.fieldName}
                    className="group border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="flex items-center gap-2 px-5 py-3">
                      <Icon
                        name="data_object"
                        className={`text-sm opacity-50 ${iconToneClass[tone]}`}
                      />
                      {field.fieldName}
                    </td>
                    <td className="px-5 py-3 text-primary opacity-80">
                      {field.metadata?.dataType || "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-on-surface-variant">
                      {field.rules?.length ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center border-t border-white/5 bg-surface-container-lowest/50 p-3">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.xlsm"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onFileSelected(file);
          }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-all hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="upload_file" className="text-[18px]" />
          {fileName ? "Change Excel file" : adminCopy.uploadRulesLabel}
        </button>
      </div>
    </div>
  );
}
