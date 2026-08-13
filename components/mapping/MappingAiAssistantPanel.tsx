"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { mappingCopy } from "@/lib/mock/mapping";

type MappingAiAssistantPanelProps = {
  open?: boolean;
  onClose?: () => void;
};

export function MappingAiAssistantPanel({
  open = false,
  onClose,
}: MappingAiAssistantPanelProps) {
  const [message, setMessage] = useState("");

  return (
    <aside
      aria-hidden={!open}
      className={`assistant-panel fixed top-0 right-0 z-50 flex h-screen w-assistant-panel-width flex-col p-6 transition-transform duration-300 ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      <div className="mb-6 flex items-start justify-between border-b border-tertiary/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="smart_toy" className="text-tertiary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {mappingCopy.assistantTitle}
            </h2>
          </div>
          <div className="mt-1 font-label-caps text-label-caps tracking-widest text-tertiary">
            {mappingCopy.assistantSubtitle}
          </div>
        </div>
        <button
          type="button"
          className="text-on-surface-variant transition-colors hover:text-tertiary"
          aria-label="Close assistant"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="mb-4 flex flex-1 flex-col gap-4 overflow-y-auto pr-2 font-body-sm text-body-sm">
        <div className="my-2 text-center font-label-caps text-label-caps text-on-surface-variant">
          {mappingCopy.assistantTimestamp}
        </div>

        <div className="max-w-[85%] self-end rounded-xl rounded-tr-sm border border-white/10 bg-surface-container p-3">
          <p className="text-on-surface">{mappingCopy.userQuestion}</p>
        </div>

        <div className="max-w-[90%] self-start rounded-xl rounded-tl-sm border border-tertiary/30 bg-tertiary/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Icon name="auto_awesome" className="text-sm text-tertiary" />
            <span className="font-label-caps text-label-caps text-tertiary">
              {mappingCopy.kineticAiLabel}
            </span>
          </div>
          <p className="leading-relaxed text-on-surface">
            The Oracle field{" "}
            <code className="rounded bg-black/20 px-1 font-mono-data text-tertiary-fixed">
              {mappingCopy.assistantOracleField}
            </code>{" "}
            is{" "}
            <code className="font-mono-data text-on-surface-variant">
              {mappingCopy.assistantOracleType}
            </code>
            , but the standard SAP{" "}
            <code className="rounded bg-black/20 px-1 font-mono-data text-tertiary-fixed">
              {mappingCopy.assistantSapField}
            </code>{" "}
            is{" "}
            <code className="font-mono-data text-on-surface-variant">
              {mappingCopy.assistantSapType}
            </code>{" "}
            (or 40 depending on configuration).
          </p>
          <div className="mt-2 rounded border border-white/5 bg-black/30 p-2">
            <p className="text-[12px] text-on-surface-variant">
              {mappingCopy.assistantRecommendation}
            </p>
          </div>
        </div>

        <div className="max-w-[85%] self-end rounded-xl rounded-tr-sm border border-white/10 bg-surface-container p-3">
          <p className="text-on-surface">{mappingCopy.userFollowUp}</p>
        </div>

        <div className="flex items-center gap-1 self-start rounded-xl rounded-tl-sm border border-tertiary/10 bg-tertiary/5 p-3">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary/60" />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary/60"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary/60"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-tertiary/20 pt-4">
        <div className="relative flex items-end gap-2 rounded-lg border border-white/10 bg-surface-container-high p-1 transition-colors focus-within:border-tertiary/50">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={mappingCopy.assistantPlaceholder}
            rows={1}
            className="max-h-24 w-full resize-none overflow-y-auto border-none bg-transparent p-2 font-body-sm text-body-sm text-on-surface focus:ring-0 focus:outline-none"
            style={{ minHeight: 40 }}
          />
          <button
            type="button"
            className="mb-0.5 rounded-md p-2 text-tertiary transition-colors hover:bg-tertiary/10"
            aria-label="Send message"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    </aside>
  );
}
