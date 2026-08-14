"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Icon } from "@/components/ui/Icon";
import {
  fetchComparisonHistory,
  type ComparisonHistoryBatch,
} from "@/lib/api/comparisons";
import { formatReportStatus, reportsCopy } from "@/lib/mock/reports";

const PAGE_SIZE = 20;

function formatWhen(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function statusClass(status: string): string {
  if (status === "completed") return "text-status-healthy";
  if (status === "failed") return "text-error";
  if (status === "processing") return "text-tertiary";
  return "text-on-surface-variant";
}

export function ReportsHistoryScreen() {
  const [page, setPage] = useState(1);
  const [batches, setBatches] = useState<ComparisonHistoryBatch[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchComparisonHistory({ page, limit: PAGE_SIZE });
        if (cancelled) return;
        setBatches(result.batches);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        if (cancelled) return;
        setBatches([]);
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen p-section-padding pt-[88px] md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8">
            <h2 className="font-display-lg text-display-lg text-on-surface">
              {reportsCopy.pageTitle}
            </h2>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              {reportsCopy.pageSubtitle}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
              <Icon
                name="progress_activity"
                className="animate-spin text-primary"
              />
              <p className="font-body-md text-body-md text-on-surface">
                {reportsCopy.loading}
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="mb-6 font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          {!loading && !error && batches.length === 0 ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container p-8 text-center">
              <Icon
                name="history"
                className="mb-3 text-4xl text-on-surface-variant"
              />
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {reportsCopy.emptyTitle}
              </p>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                {reportsCopy.emptyBody}
              </p>
              <Link
                href="/staging"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-headline-sm text-headline-sm font-bold text-on-primary"
              >
                {reportsCopy.emptyAction}
              </Link>
            </div>
          ) : null}

          {!loading && batches.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface-container shadow-card">
              <ul className="divide-y divide-ink/10">
                {batches.map((batch) => (
                  <li key={batch.batch_id}>
                    <Link
                      href={`/reports/${batch.batch_id}`}
                      className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-ink/5 md:flex-row md:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-headline-sm text-headline-sm text-on-surface">
                            {batch.business_object || "Unknown object"}
                          </span>
                          <span
                            className={`rounded border border-ink/15 bg-surface-dim px-2 py-0.5 font-label-caps text-label-caps ${statusClass(batch.status)}`}
                          >
                            {formatReportStatus(batch.status)}
                          </span>
                        </div>
                        <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
                          {batch.batch_id}
                        </p>
                        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                          Preload: {batch.preload?.filename || "—"}
                          <span className="mx-2 text-outline">·</span>
                          {formatWhen(batch.preload?.uploaded_at)}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Postload: {batch.postload?.filename || "—"}
                          <span className="mx-2 text-outline">·</span>
                          {formatWhen(batch.postload?.uploaded_at)}
                        </p>
                      </div>
                      <div className="shrink-0 text-left md:text-right">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Created {formatWhen(batch.created_at)}
                        </p>
                        {batch.summary ? (
                          <p className="mt-1 font-body-sm text-body-sm text-on-surface">
                            {batch.summary.total} finding
                            {batch.summary.total === 1 ? "" : "s"}
                            {batch.summary.missingRecords
                              ? ` · ${batch.summary.missingRecords} missing`
                              : ""}
                            {batch.summary.valueMismatches
                              ? ` · ${batch.summary.valueMismatches} mismatches`
                              : ""}
                          </p>
                        ) : (
                          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                            No comparison summary
                          </p>
                        )}
                        <p className="mt-2 inline-flex items-center gap-1 font-body-sm text-body-sm text-primary">
                          {reportsCopy.viewBatch}
                          <Icon name="chevron_right" className="text-[16px]" />
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Page {page} of {totalPages} ({total} batches)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 font-headline-sm text-headline-sm text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reportsCopy.previousPage}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 font-headline-sm text-headline-sm text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reportsCopy.nextPage}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
