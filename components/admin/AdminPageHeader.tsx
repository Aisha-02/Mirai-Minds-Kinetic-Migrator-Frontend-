"use client";

import { Icon } from "@/components/ui/Icon";
import { adminCopy } from "@/lib/mock/admin";

type AdminPageHeaderProps = {
  onSave?: () => void;
  saving?: boolean;
  canSave?: boolean;
};

export function AdminPageHeader({
  onSave,
  saving = false,
  canSave = false,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="font-display-lg text-display-lg tracking-tight text-on-surface">
          {adminCopy.pageTitle}
        </h2>
        <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">
          {adminCopy.pageSubtitle}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          disabled={!canSave || saving}
          onClick={onSave}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-all hover:bg-primary-fixed hover:shadow-[0_0_15px_rgba(144,205,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="rule_settings" className="text-[18px]" />
          {saving ? "Saving…" : adminCopy.applyRulesLabel}
        </button>
      </div>
    </div>
  );
}
