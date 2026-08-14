"use client";

import { Icon } from "@/components/ui/Icon";
import {
  adminCopy,
  type BusinessObjectOption,
} from "@/lib/mock/admin";

type BusinessObjectCardProps = {
  options: BusinessObjectOption[];
  loading?: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirming?: boolean;
  disabled?: boolean;
};

export function BusinessObjectCard({
  options,
  loading = false,
  selectedId,
  onSelect,
  onConfirm,
  confirmLabel = adminCopy.confirmSelectionLabel,
  confirming = false,
  disabled = false,
}: BusinessObjectCardProps) {
  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-ink/10 bg-surface-container-low p-5">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.businessObjectTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.businessObjectSubtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {loading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Loading business objects…
          </p>
        ) : options.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No business objects available.
          </p>
        ) : (
          options.map((option) => {
            const selected = option.id === selectedId;
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(option.id)}
                className="group w-full cursor-pointer rounded-lg border border-ink/10 bg-surface-container-low p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      selected ? "border-primary" : "border-ink/25"
                    }`}
                  >
                    {selected ? (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="flex justify-center border-t border-ink/10 bg-surface-container-low p-3">
        <button
          type="button"
          disabled={disabled || !selectedId || confirming || loading}
          onClick={onConfirm}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary shadow-primary transition-all hover:bg-primary-fixed hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="check_circle" className="text-[18px]" />
          {confirming ? "Generating…" : confirmLabel}
        </button>
      </div>
    </div>
  );
}
