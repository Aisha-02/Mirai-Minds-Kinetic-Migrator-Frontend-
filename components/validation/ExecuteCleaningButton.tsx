"use client";

import { Icon } from "@/components/ui/Icon";
import { validationCopy } from "@/lib/mock/validation";

type ExecuteCleaningButtonProps = {
  onExecute?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function ExecuteCleaningButton({
  onExecute,
  disabled = false,
  loading = false,
}: ExecuteCleaningButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onExecute}
      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-4 font-headline-sm text-headline-sm text-on-primary shadow-[0_0_20px_rgba(144,205,255,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(144,205,255,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
      <Icon name="play_circle" filled className="relative z-10" />
      <span className="relative z-10">
        {loading ? "Running…" : validationCopy.executeLabel}
      </span>
    </button>
  );
}
