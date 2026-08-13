import { Icon } from "@/components/ui/Icon";
import { validationCopy } from "@/lib/mock/validation";

export function ActiveRulesetCard() {
  return (
    <div className="workspace-glass flex h-full flex-col gap-3 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {validationCopy.rulesetTitle}
        </h3>
        <Icon
          name="admin_panel_settings"
          className="text-[20px] text-tertiary"
        />
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="relative h-2 w-2 rounded-full bg-primary">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-50" />
        </div>
        <span className="font-label-caps text-label-caps tracking-wider text-primary">
          {validationCopy.rulesetStatus}
        </span>
      </div>
      <div className="mt-2 rounded border border-white/5 bg-surface-container-lowest/50 p-3">
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {validationCopy.ruleId}
        </p>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          {validationCopy.ruleChecks}
        </p>
      </div>
    </div>
  );
}
