"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { PipelineIssuesTable } from "@/components/pipeline/PipelineIssuesTable";
import { PipelineMetricsRow } from "@/components/pipeline/PipelineMetricsRow";
import { PipelineResultsHeader } from "@/components/pipeline/PipelineResultsHeader";
import { Icon } from "@/components/ui/Icon";
import {
  downloadComparisonPdf,
  fetchComparisonReport,
  type ComparisonReport,
  type ComparisonSummary,
} from "@/lib/api/comparisons";
import { getActiveBatch } from "@/lib/session/batch";
import type { PipelineIssue, PipelineMetric } from "@/lib/mock/pipeline";

const POLL_MS = 2500;
const MAX_POLLS = 48; // ~2 minutes

function count(items: unknown[] | undefined) {
  return Array.isArray(items) ? items.length : 0;
}

function buildMetrics(summary: ComparisonSummary | null): PipelineMetric[] {
  const missingRecords = count(summary?.missingRecords);
  const missingValues = count(summary?.missingValues);
  const valueMismatches = count(summary?.valueMismatches);
  const duplicateRecords = count(summary?.duplicateRecords);
  const baselineDuplicates = count(summary?.baselineDuplicates);
  const extraRecords = count(summary?.extraRecords);

  return [
    {
      id: "missingRecords",
      label: "Missing Records",
      value: String(missingRecords),
      icon: "warning",
      tone: "error",
      footer: {
        kind: "trend",
        direction: "up",
        text: "In preload, absent from postload",
      },
    },
    {
      id: "missingValues",
      label: "Missing Values",
      value: String(missingValues),
      icon: "data_array",
      tone: "tertiary",
      footer: {
        kind: "progress",
        percentWidth: `${Math.min(missingValues, 100)}%`,
        label: "Empty in postload",
      },
    },
    {
      id: "valueMismatches",
      label: "Value Mismatches",
      value: String(valueMismatches),
      icon: "compare_arrows",
      tone: "error",
      footer: {
        kind: "trend",
        direction: "up",
        text: "Field values differ",
      },
    },
    {
      id: "duplicateRecords",
      label: "Postload Duplicates",
      value: String(duplicateRecords),
      icon: "content_copy",
      tone: "primary",
      footer: {
        kind: "trend",
        direction: "down",
        text: "Duplicate keys in postload",
      },
    },
    {
      id: "baselineDuplicates",
      label: "Preload Duplicates",
      value: String(baselineDuplicates),
      icon: "library_add",
      tone: "tertiary",
      footer: {
        kind: "trend",
        direction: "down",
        text: "Duplicate keys in preload",
      },
    },
    {
      id: "extraRecords",
      label: "Extra Records",
      value: String(extraRecords),
      icon: "add_circle",
      tone: "primary",
      footer: {
        kind: "trend",
        direction: "down",
        text: "In postload only",
      },
    },
  ];
}

function identifierText(value: unknown): string {
  if (value == null) return "{}";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function buildIssues(summary: ComparisonSummary | null): PipelineIssue[] {
  if (!summary) return [];

  const issues: PipelineIssue[] = [];

  for (const item of summary.missingRecords || []) {
    const row = item as { identifier?: unknown };
    issues.push({
      id: `missing-${issues.length}`,
      severity: "critical",
      category: "Missing Record",
      description: `Preload record missing in postload: ${identifierText(row.identifier)}`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  for (const item of summary.missingValues || []) {
    const row = item as { identifier?: unknown; field?: string };
    issues.push({
      id: `missing-value-${issues.length}`,
      severity: "high",
      category: "Missing Value",
      description: `Field ${row.field ?? "?"} empty in postload (${identifierText(row.identifier)})`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  for (const item of summary.valueMismatches || []) {
    const row = item as {
      identifier?: unknown;
      field?: string;
      expectedValue?: unknown;
      actualValue?: unknown;
    };
    issues.push({
      id: `mismatch-${issues.length}`,
      severity: "high",
      category: "Value Mismatch",
      description: `Field ${row.field ?? "?"}: expected ${String(row.expectedValue)} vs actual ${String(row.actualValue)} (${identifierText(row.identifier)})`,
      affectedRecords: "1",
      status: "investigating",
    });
  }

  for (const item of summary.duplicateRecords || []) {
    const row = item as { identifier?: unknown; count?: number };
    issues.push({
      id: `dup-post-${issues.length}`,
      severity: "medium",
      category: "Postload Duplicate",
      description: `Duplicate key in postload (${row.count ?? "?"} rows): ${identifierText(row.identifier)}`,
      affectedRecords: String(row.count ?? 1),
      status: "pending",
    });
  }

  for (const item of summary.baselineDuplicates || []) {
    const row = item as { identifier?: unknown; count?: number };
    issues.push({
      id: `dup-pre-${issues.length}`,
      severity: "medium",
      category: "Preload Duplicate",
      description: `Duplicate key in preload (${row.count ?? "?"} rows): ${identifierText(row.identifier)}`,
      affectedRecords: String(row.count ?? 1),
      status: "pending",
    });
  }

  for (const item of summary.extraRecords || []) {
    const row = item as { identifier?: unknown };
    issues.push({
      id: `extra-${issues.length}`,
      severity: "low",
      category: "Extra Record",
      description: `Postload-only record: ${identifierText(row.identifier)}`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  return issues.slice(0, 100);
}

function isTerminalStatus(status: string | undefined) {
  return status === "completed" || status === "failed";
}

export function PipelineResultsScreen() {
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);

  const loadReport = useCallback(async (id: string) => {
    return fetchComparisonReport(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let pollCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function load(isPoll = false) {
      const active = getActiveBatch();
      if (!active?.batchId) {
        if (!cancelled) {
          setBatchId(null);
          setError("No active batch. Upload files from Staging first.");
          setLoading(false);
          setReport(null);
        }
        return;
      }

      if (!cancelled) {
        setBatchId(active.batchId);
        if (!isPoll) {
          setLoading(true);
          setError(null);
        }
      }

      try {
        const next = await loadReport(active.batchId);
        if (cancelled) return;

        setReport(next);
        setError(null);

        if (!isTerminalStatus(next.status) && pollCount < MAX_POLLS) {
          pollCount += 1;
          timer = setTimeout(() => {
            void load(true);
          }, POLL_MS);
        } else if (!isTerminalStatus(next.status) && pollCount >= MAX_POLLS) {
          setError(
            "Comparison is still processing. Refresh this page in a moment.",
          );
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load report";

        // Report may not exist yet right after upload — keep polling briefly.
        if (
          /not found|no report/i.test(message) &&
          pollCount < MAX_POLLS
        ) {
          pollCount += 1;
          timer = setTimeout(() => {
            void load(true);
          }, POLL_MS);
          if (!isPoll) {
            setError(null);
            setReport(null);
          }
        } else {
          setError(message);
        }
      } finally {
        if (!cancelled && !isPoll) setLoading(false);
      }
    }

    void load(false);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [loadReport]);

  const metrics = useMemo(
    () => buildMetrics(report?.summary_json ?? null),
    [report],
  );
  const issues = useMemo(
    () => buildIssues(report?.summary_json ?? null),
    [report],
  );

  const processing =
    report?.status === "processing" ||
    (!report && loading === false && !error && Boolean(batchId));

  async function handleDownloadPdf() {
    const active = getActiveBatch();
    if (!active?.batchId) return;
    setDownloading(true);
    setError(null);
    try {
      const blob = await downloadComparisonPdf(active.batchId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `comparison-report-${active.batchId}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF download failed");
    } finally {
      setDownloading(false);
    }
  }

  const canDownloadPdf =
    Boolean(report) &&
    (report?.status === "completed" ||
      Boolean(report?.ai_report_text) ||
      Boolean(report?.summary_json));

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-lowest text-white antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen bg-background p-section-padding pt-[88px] transition-all duration-300 md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          <PipelineResultsHeader
            batchId={batchId || report?.batch_id || "—"}
            status={report?.status}
            onDownloadPdf={canDownloadPdf ? handleDownloadPdf : undefined}
            downloading={downloading}
          />

          {loading ? (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
              <Icon name="progress_activity" className="animate-spin text-primary" />
              <p className="font-body-md text-body-md text-on-surface">
                Loading comparison report…
              </p>
            </div>
          ) : null}

          {!loading && !batchId ? (
            <div className="mb-6 rounded-xl border border-outline-variant bg-surface-container p-8 text-center">
              <Icon
                name="assessment"
                className="mb-3 text-4xl text-on-surface-variant"
              />
              <p className="font-headline-sm text-headline-sm text-on-surface">
                No comparison batch yet
              </p>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Upload preload and postload files, then run a comparison to see
                results here.
              </p>
              <Link
                href="/staging"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-headline-sm text-headline-sm font-bold text-on-primary"
              >
                Go to Staging
              </Link>
            </div>
          ) : null}

          {error ? (
            <p className="mb-6 font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          {processing || report?.status === "processing" ? (
            <div
              className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
              role="status"
            >
              <Icon name="progress_activity" className="animate-spin text-primary" />
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Comparison in progress
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Diff and AI narrative are still running. This page refreshes
                  automatically.
                </p>
              </div>
            </div>
          ) : null}

          {report?.status === "failed" ? (
            <div
              className="mb-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3"
              role="alert"
            >
              <p className="font-headline-sm text-headline-sm text-error">
                Comparison failed
              </p>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface">
                {report.error_message || "Unknown error"}
              </p>
            </div>
          ) : null}

          {report?.ai_report_text ? (
            <div className="mb-container-margin rounded-xl border border-outline-variant bg-surface-container p-6">
              <h3 className="mb-3 font-headline-sm text-headline-sm text-white">
                AI comparison report
              </h3>
              <pre className="whitespace-pre-wrap font-body-md text-body-md text-on-surface">
                {report.ai_report_text}
              </pre>
            </div>
          ) : null}

          {report?.summary_json ? (
            <>
              <PipelineMetricsRow metrics={metrics} />
              <PipelineIssuesTable issues={issues} />
            </>
          ) : null}

          {report?.status === "completed" &&
          !report.ai_report_text &&
          !report.summary_json ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Report completed but no summary or narrative was stored.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
