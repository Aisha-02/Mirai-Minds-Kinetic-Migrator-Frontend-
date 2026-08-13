"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  validationCopy,
  validationSuggestions,
} from "@/lib/mock/validation";

type AiAssistantPanelProps = {
  open?: boolean;
  onClose?: () => void;
};

/** Reuses existing assistant chrome; scoped messaging for the current report. */
export function AiAssistantPanel({
  open = false,
  onClose,
}: AiAssistantPanelProps) {
  const [message, setMessage] = useState("");

  return (
    <aside
      aria-hidden={!open}
      className={`assistant-panel fixed top-0 right-0 z-50 flex h-screen w-assistant-panel-width flex-col border-l border-tertiary-container p-6 transition-transform duration-300 ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-tertiary-container bg-tertiary-container/20 text-tertiary">
            <Icon name="smart_toy" className="text-[24px]" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {validationCopy.assistantTitle}
            </h2>
            <p className="mt-1 font-label-caps text-label-caps tracking-widest text-tertiary">
              {validationCopy.assistantSubtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded p-1 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
          aria-label="Close assistant"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="mb-4 flex flex-1 flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex gap-3">
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-tertiary-container/20 text-tertiary">
            <Icon name="smart_toy" className="text-[16px]" />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-surface-container-lowest p-4 font-body-md text-body-md text-on-surface">
            Run Execute Cleaning to detect the business object and load
            validation findings by field. Ask about totals, errors, or a
            specific field once the report is ready.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pl-11">
          {validationSuggestions.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="flex items-center gap-2 rounded-full border border-tertiary-container/30 bg-surface-bright/50 px-4 py-2 text-sm text-on-surface transition-all duration-200 hover:border-tertiary-container/50 hover:bg-tertiary-container/20"
            >
              <Icon name={chip.icon} className="text-[16px] text-tertiary" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-auto">
        <div className="absolute inset-0 z-0 rounded-full bg-tertiary/5 blur-xl" />
        <div className="relative z-10 flex items-center rounded-xl border border-tertiary-container/30 bg-surface-container-lowest p-2 transition-colors focus-within:border-tertiary">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={validationCopy.assistantPlaceholder}
            className="flex-1 border-none bg-transparent px-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary transition-colors hover:bg-tertiary-fixed-dim"
            aria-label="Send message"
          >
            <Icon name="send" className="text-[18px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
