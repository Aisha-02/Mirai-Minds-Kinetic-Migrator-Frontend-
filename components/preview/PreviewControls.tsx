"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { previewCopy } from "@/lib/mock/preview";

export function PreviewControls() {
  const [query, setQuery] = useState("");

  return (
    <div className="mb-4 flex shrink-0 flex-col gap-3 rounded-xl border border-white/5 bg-surface-container-low p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Icon
            name="search"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={previewCopy.searchPlaceholder}
            className="w-full rounded border border-outline-variant/30 bg-surface-dim py-1.5 pr-3 pl-10 text-body-sm transition-colors focus:border-primary focus:outline-none sm:w-64"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-outline-variant/30 bg-surface-container-highest px-3 py-1.5 text-body-sm transition-colors hover:bg-white/5"
        >
          <Icon name="filter_list" className="text-[18px]" />
          {previewCopy.filterLabel}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-outline-variant/30 bg-surface-container-highest px-3 py-1.5 text-body-sm transition-colors hover:bg-white/5"
        >
          <Icon name="sort" className="text-[18px]" />
          {previewCopy.sortLabel}
        </button>
      </div>
      <div className="font-label-caps text-label-caps text-on-surface-variant">
        {previewCopy.showingLabel}
      </div>
    </div>
  );
}
