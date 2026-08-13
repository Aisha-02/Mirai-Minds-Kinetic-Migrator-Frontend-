"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type {
  CleanupSessionPublic,
  PendingFixProposal,
} from "@/lib/api/validation";
import {
  confirmCleanupFix,
  rejectCleanupFix,
  sendCleanupChat,
} from "@/lib/api/validation";
import { validationCopy, validationSuggestions } from "@/lib/mock/validation";

type AiAssistantPanelProps = {
  open?: boolean;
  onClose?: () => void;
  session?: CleanupSessionPublic | null;
  onSessionUpdated?: (session: CleanupSessionPublic) => void;
  onReportRefreshed?: (payload: {
    session: CleanupSessionPublic;
    findings: CleanupSessionPublic["findings"];
    report: CleanupSessionPublic["report"];
    summary: CleanupSessionPublic["summary"];
  }) => void;
};

function DiffPreview({ proposal }: { proposal: PendingFixProposal }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-tertiary-container/40 bg-surface-container-lowest">
      <div className="border-b border-white/5 px-3 py-2 font-label-caps text-label-caps text-tertiary">
        Preview · {proposal.affectedCount} row(s) · {proposal.transform.label}
      </div>
      <div className="max-h-48 overflow-auto">
        <table className="w-full border-collapse text-left font-mono-data text-mono-data">
          <thead>
            <tr className="bg-surface-bright/20">
              <th className="p-2 text-on-surface-variant">Row</th>
              <th className="p-2 text-on-surface-variant">Before</th>
              <th className="p-2 text-on-surface-variant">After</th>
            </tr>
          </thead>
          <tbody>
            {proposal.diffSample.map((row) => (
              <tr key={`${row.row}-${row.before}-${row.after}`} className="border-t border-white/5">
                <td className="p-2 text-on-surface">{row.row}</td>
                <td className="p-2 text-error">{row.before ?? "∅"}</td>
                <td className="p-2 text-primary">{row.after ?? "∅"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AiAssistantPanel({
  open = false,
  onClose,
  session = null,
  onSessionUpdated,
  onReportRefreshed,
}: AiAssistantPanelProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = session?.chatMessages ?? [];
  const pending = session?.pendingProposal ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending?.id, open]);

  async function handleSend(text?: string) {
    const content = (text ?? message).trim();
    if (!content || !session?.id || sending) return;

    setSending(true);
    setError(null);
    setMessage("");

    try {
      const result = await sendCleanupChat(session.id, content);
      onSessionUpdated?.(result.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setSending(false);
    }
  }

  async function handleConfirm() {
    if (!session?.id || !pending?.id || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await confirmCleanupFix(session.id, pending.id);
      onSessionUpdated?.(result.session);
      onReportRefreshed?.({
        session: result.session,
        findings: result.findings,
        report: result.report,
        summary: result.summary,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm failed");
    } finally {
      setSending(false);
    }
  }

  async function handleReject() {
    if (!session?.id || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await rejectCleanupFix(session.id);
      onSessionUpdated?.(result.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <aside
      aria-hidden={!open}
      className={`assistant-panel fixed top-0 right-0 z-50 flex h-screen w-assistant-panel-width flex-col border-l border-tertiary-container p-6 transition-transform duration-300 ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-tertiary-container bg-tertiary-container/20 text-tertiary">
            <Icon name="smart_toy" className="text-[24px]" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {validationCopy.assistantTitle}
            </h2>
            <p className="mt-1 font-label-caps text-label-caps tracking-widest text-tertiary">
              {session
                ? `${session.businessObject} · ${session.filename}`
                : validationCopy.assistantSubtitle}
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

      <div className="mb-4 flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
        {!session ? (
          <div className="rounded-2xl border border-white/5 bg-surface-container-lowest p-4 font-body-md text-body-md text-on-surface-variant">
            Run Execute Cleaning first. Chat is scoped to that file, detected
            business object, saved validation rules, and current findings.
          </div>
        ) : (
          messages.map((entry, index) => (
            <div
              key={entry.id || `msg-${index}`}
              className={`flex gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-tertiary-container/20 text-tertiary">
                <Icon
                  name={entry.role === "user" ? "person" : "smart_toy"}
                  className="text-[16px]"
                />
              </div>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl border border-white/5 p-4 font-body-md text-body-md text-on-surface ${
                  entry.role === "user"
                    ? "rounded-tr-sm bg-primary/10"
                    : "rounded-tl-sm bg-surface-container-lowest"
                }`}
              >
                {entry.content}
              </div>
            </div>
          ))
        )}

        {pending ? (
          <div className="rounded-xl border border-tertiary-container/40 bg-tertiary-container/10 p-4">
            <p className="font-body-sm text-body-sm text-on-surface">
              Confirm this fix before anything is written to the session or
              downloadable file.
            </p>
            <DiffPreview proposal={pending} />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={sending}
                onClick={handleConfirm}
                className="rounded-lg bg-primary px-3 py-2 font-body-sm text-body-sm font-semibold text-on-primary disabled:opacity-50"
              >
                Confirm & apply
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={handleReject}
                className="rounded-lg border border-white/10 px-3 py-2 font-body-sm text-body-sm text-on-surface disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ) : null}

        {session ? (
          <div className="flex flex-wrap gap-2">
            {validationSuggestions.map((chip) => (
              <button
                key={chip.id}
                type="button"
                disabled={sending}
                onClick={() => handleSend(chip.label)}
                className="flex items-center gap-2 rounded-full border border-tertiary-container/30 bg-surface-bright/50 px-4 py-2 text-sm text-on-surface transition-all duration-200 hover:border-tertiary-container/50 hover:bg-tertiary-container/20 disabled:opacity-50"
              >
                <Icon name={chip.icon} className="text-[16px] text-tertiary" />
                {chip.label}
              </button>
            ))}
            {session.findings?.[0] ? (
              <button
                type="button"
                disabled={sending}
                onClick={() =>
                  handleSend(
                    `fix the ${session.findings[0].fieldName} ${session.findings[0].ruleName} issue`,
                  )
                }
                className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
              >
                <Icon name="build" className="text-[16px]" />
                Fix first finding
              </button>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="font-body-sm text-body-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="relative mt-auto">
        <div className="absolute inset-0 z-0 rounded-full bg-tertiary/5 blur-xl" />
        <form
          className="relative z-10 flex items-center rounded-xl border border-tertiary-container/30 bg-surface-container-lowest p-2 transition-colors focus-within:border-tertiary"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}
        >
          <input
            type="text"
            value={message}
            disabled={!session || sending}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={
              session
                ? 'e.g. "fix the material length issue"'
                : validationCopy.assistantPlaceholder
            }
            className="flex-1 border-none bg-transparent px-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!session || sending || !message.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary transition-colors hover:bg-tertiary-fixed-dim disabled:opacity-50"
            aria-label="Send message"
          >
            <Icon name="send" className="text-[18px]" />
          </button>
        </form>
      </div>
    </aside>
  );
}
