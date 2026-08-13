"use client";

import { useEffect, useRef, useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ActiveRulesetCard } from "@/components/validation/ActiveRulesetCard";
import { AiAssistantPanel } from "@/components/validation/AiAssistantPanel";
import { CleaningReport } from "@/components/validation/CleaningReport";
import { ExecuteCleaningButton } from "@/components/validation/ExecuteCleaningButton";
import { SourceDataUpload } from "@/components/validation/SourceDataUpload";
import { ValidationPageHeader } from "@/components/validation/ValidationPageHeader";
import { COMPARISON_BUSINESS_OBJECTS } from "@/lib/api/comparisons";
import {
  executeCleanup,
  isNeedsBusinessObjectCleanup,
  safeCleanupErrorMessage,
  triggerAutoFix,
  type AutoFixResponse,
  type ExecuteCleanupResponse,
} from "@/lib/api/validation";

export function ValidationScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [businessObject, setBusinessObject] = useState("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [needsBo, setNeedsBo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoFixLoading, setAutoFixLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoFixError, setAutoFixError] = useState<string | null>(null);
  const [result, setResult] = useState<ExecuteCleanupResponse | null>(null);
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResponse | null>(
    null,
  );
  const lastAutoFixSessionRef = useRef<string | null>(null);

  async function handleExecute() {
    if (!file) {
      setError("Upload a preload file first");
      return;
    }

    setLoading(true);
    setError(null);
    setAutoFixError(null);
    setAutoFixResult(null);
    lastAutoFixSessionRef.current = null;

    try {
      const response = await executeCleanup(file, {
        businessObject: businessObject || undefined,
      });
      setResult(response);
      setNeedsBo(false);
    } catch (err) {
      if (isNeedsBusinessObjectCleanup(err)) {
        setNeedsBo(true);
        const body = (
          err as {
            body: { candidates?: string[] };
          }
        ).body;
        setCandidates(
          body.candidates?.length
            ? body.candidates
            : [...COMPARISON_BUSINESS_OBJECTS],
        );
        setError(await safeCleanupErrorMessage(err));
      } else {
        setError(await safeCleanupErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const sessionId = result?.sessionId;
    if (!sessionId || lastAutoFixSessionRef.current === sessionId) return;

    let cancelled = false;
    lastAutoFixSessionRef.current = sessionId;

    async function runAutoFix() {
      setAutoFixLoading(true);
      setAutoFixError(null);
      try {
        const response = await triggerAutoFix(sessionId);
        if (!cancelled) {
          setAutoFixResult(response);
        }
      } catch (err) {
        if (!cancelled) {
          setAutoFixError(await safeCleanupErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setAutoFixLoading(false);
        }
      }
    }

    void runAutoFix();

    return () => {
      cancelled = true;
    };
  }, [result?.sessionId]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="validate" />
      <TopAppBar variant="validation" assistantOpen={assistantOpen} />
      <AiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <main
        className={`min-h-screen w-full overflow-y-auto pt-16 pl-sidebar-width transition-[padding] duration-300 ${
          assistantOpen ? "xl:pr-assistant-panel-width" : "pr-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-section-padding md:p-8">
          <ValidationPageHeader />

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          {autoFixError ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              Auto-fix failed: {autoFixError}
            </p>
          ) : null}

          {needsBo ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
              <label className="mb-2 block font-body-sm text-body-sm text-on-surface">
                Select business object, then run again
              </label>
              <select
                className="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 font-body-md text-body-md text-white"
                value={businessObject}
                onChange={(event) => setBusinessObject(event.target.value)}
              >
                <option value="">Select…</option>
                {candidates.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {candidate}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="grid grid-cols-12 gap-4">
            <SourceDataUpload
              fileName={file?.name}
              disabled={loading}
              onFileSelected={(next) => {
                setFile(next);
                setResult(null);
                setAutoFixResult(null);
                setAutoFixError(null);
                lastAutoFixSessionRef.current = null;
                setError(null);
              }}
            />
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
              <ActiveRulesetCard
                businessObject={
                  result?.rulesBusinessObject ||
                  result?.detection?.businessObject ||
                  null
                }
                ruleSetId={result?.ruleSet?.id || null}
                rulesChecked={result?.summary?.rulesChecked ?? null}
                statusLabel={
                  result
                    ? `Rules via Lambda (${result.evaluator || "local"})`
                    : "Waiting for execute"
                }
              />
              <ExecuteCleaningButton
                onExecute={handleExecute}
                disabled={!file}
                loading={loading}
              />
            </div>
          </div>

          <CleaningReport
            result={result}
            autoFixResult={autoFixResult}
            autoFixLoading={autoFixLoading}
            onSuggestAi={() => setAssistantOpen(true)}
          />
        </div>
      </main>
    </div>
  );
}
