"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SchemaFieldMapping } from "@/lib/api/schemaMapping";
import {
  formatConfidencePercent,
} from "@/lib/api/schemaMapping";
import { mappingCopy } from "@/lib/mock/mapping";

type MappingAiAssistantPanelProps = {
  open?: boolean;
  onClose?: () => void;
  schemaMappings?: SchemaFieldMapping[];
  highlightMapping?: SchemaFieldMapping | null;
};

export function MappingAiAssistantPanel({
  open = false,
  onClose,
  schemaMappings = [],
  highlightMapping = null,
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
        {highlightMapping ? (
          <div className="max-w-[90%] self-start rounded-xl rounded-tl-sm border border-tertiary/30 bg-tertiary/10 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Icon name="auto_awesome" className="text-sm text-tertiary" />
              <span className="font-label-caps text-label-caps text-tertiary">
                {mappingCopy.kineticAiLabel}
              </span>
            </div>
            <p className="leading-relaxed text-on-surface">
              Lowest-confidence mapping:{" "}
              <code className="rounded bg-black/20 px-1 font-mono-data text-tertiary-fixed">
                {highlightMapping.sourceField}
              </code>{" "}
              →{" "}
              <code className="rounded bg-black/20 px-1 font-mono-data text-tertiary-fixed">
                {highlightMapping.sapField || "unmapped"}
              </code>{" "}
              ({formatConfidencePercent(highlightMapping.confidenceScore)}).
            </p>
            {highlightMapping.reasoning ? (
              <div className="mt-2 rounded border border-white/5 bg-black/30 p-2">
                <p className="text-[12px] text-on-surface-variant">
                  {highlightMapping.reasoning}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-on-surface-variant">
            <Icon name="forum" className="text-3xl" />
            <p>Ask about your field mappings once results are available.</p>
            {schemaMappings.length > 0 ? (
              <p className="text-[12px]">
                {schemaMappings.length} mapping(s) loaded.
              </p>
            ) : null}
          </div>
        )}
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
