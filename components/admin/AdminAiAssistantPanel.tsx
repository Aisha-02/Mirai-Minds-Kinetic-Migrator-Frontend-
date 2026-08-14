"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  adminAssistantSuggestions,
  adminCopy,
} from "@/lib/mock/admin";

type AdminAiAssistantPanelProps = {
  open?: boolean;
  onClose?: () => void;
  businessObjectLabel?: string;
  hasRulesDraft?: boolean;
};

export function AdminAiAssistantPanel({
  open = false,
  onClose,
  businessObjectLabel = "",
  hasRulesDraft = false,
}: AdminAiAssistantPanelProps) {
  const [message, setMessage] = useState("");

  const introMessage = businessObjectLabel
    ? hasRulesDraft
      ? `I've generated validation rules for ${businessObjectLabel}. Ask me to explain any rule or suggest improvements.`
      : `Select ${businessObjectLabel}, upload a source schema, and generate rules to get AI recommendations.`
    : "Upload a source schema and select a business object to get started.";

  return (
    <aside
      aria-hidden={!open}
      className={`fixed top-0 right-0 z-50 flex h-screen w-assistant-panel-width flex-col border-l border-ink/10 bg-surface/95 p-6 shadow-[-18px_0_44px_-20px_rgba(15,26,42,0.22)] backdrop-blur-[60px] transition-transform duration-300 ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-tertiary-container/30 bg-tertiary-container/10">
            <Icon name="smart_toy" className="text-tertiary" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm leading-tight text-on-surface">
              {adminCopy.assistantTitle}
            </h3>
            <p className="mt-0.5 font-label-caps text-[10px] tracking-wider text-tertiary-container uppercase">
              {adminCopy.assistantSubtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded p-1 text-on-surface-variant transition-colors hover:bg-ink/10 hover:text-on-surface"
          aria-label="Close assistant"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="mb-4 flex flex-1 flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex gap-3">
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-tertiary-container text-on-tertiary-container">
            <Icon name="smart_toy" className="text-[16px]" />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-ink/10 bg-surface-container-low p-4 text-body-md text-on-surface">
            {introMessage}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pl-11">
          {adminAssistantSuggestions.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="flex items-center gap-2 rounded-full border border-tertiary-container/30 bg-surface-container-high px-4 py-2 text-sm text-on-surface transition-all duration-200 hover:border-tertiary-container/50 hover:bg-tertiary-container/20"
            >
              <Icon name={chip.icon} className="text-[16px] text-tertiary" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-auto">
        <div className="mt-auto flex flex-col gap-3 border-t border-tertiary/20 pt-4">
          <button
            type="button"
            className="flex items-center gap-1 self-start font-label-caps text-label-caps text-tertiary transition-colors hover:text-tertiary-fixed-dim"
          >
            <Icon name="delete" className="text-[14px]" />
            {adminCopy.clearChatLabel}
          </button>
          <div className="relative flex items-end gap-2 rounded-lg border border-ink/15 bg-surface-container-high p-1 transition-colors focus-within:border-tertiary/50">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={adminCopy.assistantPlaceholder}
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
        <div className="mt-6 flex justify-center gap-6 border-t border-ink/10 pt-4">
          <a
            href="#"
            className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-tertiary"
          >
            <Icon name="menu_book" className="text-[16px]" />
            <span className="font-body-sm text-body-sm">
              {adminCopy.documentationLabel}
            </span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-tertiary"
          >
            <Icon name="tune" className="text-[16px]" />
            <span className="font-body-sm text-body-sm">
              {adminCopy.settingsLabel}
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}
