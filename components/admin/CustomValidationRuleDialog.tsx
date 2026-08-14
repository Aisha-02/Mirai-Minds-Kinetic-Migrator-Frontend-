"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FieldRule } from "@/lib/api/rules";
import { adminCopy } from "@/lib/mock/admin";

export type CustomRuleFormValues = {
  fieldName: string;
  logic: string;
};

type CustomValidationRuleDialogProps = {
  open: boolean;
  fieldOptions: string[];
  initial?: CustomRuleFormValues | null;
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: CustomRuleFormValues) => void;
};

const emptyForm: CustomRuleFormValues = {
  fieldName: "",
  logic: "",
};

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-ink/5 px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary";

export function CustomValidationRuleDialog({
  open,
  fieldOptions,
  initial = null,
  saving = false,
  error = null,
  onClose,
  onSubmit,
}: CustomValidationRuleDialogProps) {
  const [values, setValues] = useState<CustomRuleFormValues>(emptyForm);
  const isEdit = Boolean(initial);

  useEffect(() => {
    if (open) {
      setValues(
        initial ?? {
          fieldName: fieldOptions[0] ?? "",
          logic: "",
        },
      );
    }
  }, [open, initial, fieldOptions]);

  const canSubmit = useMemo(
    () => Boolean(values.fieldName.trim() && values.logic.trim()),
    [values],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-6 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-ink/10 bg-surface-container-low px-5 py-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {isEdit ? "Edit Custom Rule" : adminCopy.addCustomRuleLabel}
            </h3>
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              Choose a field and describe the transformation to apply.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant transition-colors hover:bg-ink/10 hover:text-on-surface"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmit && !saving) onSubmit(values);
          }}
        >
          <label className="block space-y-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Field
            </span>
            <select
              className={inputClass}
              value={values.fieldName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  fieldName: event.target.value,
                }))
              }
            >
              <option value="">Select a field</option>
              {fieldOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {fieldOptions.length === 0 ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Upload a source schema and generate rules so fields appear here.
              </span>
            ) : null}
          </label>

          <label className="block space-y-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Custom logic
            </span>
            <textarea
              className={`${inputClass} min-h-[140px] resize-y`}
              placeholder="Describe the transformation for this field, e.g. Convert to uppercase and trim spaces"
              value={values.logic}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  logic: event.target.value,
                }))
              }
            />
          </label>

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-ink/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="save" className="text-[18px]" />
              {saving ? "Saving…" : isEdit ? "Save changes" : "Save custom rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function valuesFromRule(
  fieldName: string,
  rule: FieldRule,
): CustomRuleFormValues {
  return {
    fieldName,
    logic: rule.constraint || rule.description || "",
  };
}
