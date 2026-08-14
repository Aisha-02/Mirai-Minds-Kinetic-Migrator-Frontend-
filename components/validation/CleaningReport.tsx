"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type {
  AutoFixResponse,
  ExecuteCleanupResponse,
  PlainLanguageFieldGroup,
} from "@/lib/api/validation";
import { downloadRefinedFile } from "@/lib/api/validation";
import { validationCopy } from "@/lib/mock/validation";

const PAGE_SIZE = 8;

function sourceLabel(source: string | undefined) {
  const value = String(source || "").toUpperCase();
  if (value === "CUSTOM") return "Custom";
  if (value === "PREDEFINED") return "Predefined";
  if (value === "AI") return "AI";
  return source || "";
}

function filterFieldGroups(
  groups: PlainLanguageFieldGroup[],
  {
    severity,
    source,
    field,
    failedOnly,
  }: {
    severity: string;
    source: string;
    field: string;
    failedOnly: boolean;
  },
) {
  const fieldNeedle = field.trim().toLowerCase();
  return groups
    .filter((group) =>
      fieldNeedle
        ? group.fieldName.toLowerCase().includes(fieldNeedle)
        : true,
    )
    .map((group) => {
      const findings = group.findings.filter((finding) => {
        if (failedOnly && finding.severity !== "error") return false;
        if (severity && finding.severity !== severity) return false;
        if (source) {
          const value = String(finding.rule?.source || "").toLowerCase();
          if (value !== source.toLowerCase()) return false;
        }
        return true;
      });
      if (findings.length === 0) return null;
      return {
        ...group,
        findings,
        findingCount: findings.length,
        errorCount: findings
          .filter((item) => item.severity === "error")
          .reduce((sum, item) => sum + (item.affectedCount || 0), 0),
        warningCount: findings
          .filter((item) => item.severity === "warning")
          .reduce((sum, item) => sum + (item.affectedCount || 0), 0),
      } satisfies PlainLanguageFieldGroup;
    })
    .filter((group): group is PlainLanguageFieldGroup => group !== null);
}

type CleaningReportProps = {
  result?: ExecuteCleanupResponse | null;
  autoFixResult?: AutoFixResponse | null;
  autoFixLoading?: boolean;
};

function FieldGroupCard({ group }: { group: PlainLanguageFieldGroup }) {
  const tone =
    group.errorCount > 0 ? "border-error/30" : "border-tertiary/30";

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface-container ${tone}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-surface-container-high px-5 py-4">
        <div className="flex items-center gap-3">
          <Icon
            name="data_object"
            className={group.errorCount > 0 ? "text-error" : "text-tertiary"}
          />
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">
              {group.fieldName}
            </h4>
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              {group.findingCount} issue{group.findingCount === 1 ? "" : "s"} to
              review
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {group.errorCount > 0 ? (
            <span className="rounded border border-error/40 bg-error/10 px-2 py-1 font-label-caps text-label-caps text-error">
              {group.errorCount} error hits
            </span>
          ) : null}
          {group.warningCount > 0 ? (
            <span className="rounded border border-tertiary/40 bg-tertiary/10 px-2 py-1 font-label-caps text-label-caps text-tertiary">
              {group.warningCount} warning hits
            </span>
          ) : null}
        </div>
      </header>

      <ul className="divide-y divide-ink/10">
        {group.findings.map((finding) => (
          <li
            key={`${group.fieldName}-${finding.ruleName}-${finding.summary}`}
            className="space-y-3 px-5 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p
                className={`font-body-md text-body-md leading-relaxed ${
                  finding.severity === "warning"
                    ? "text-tertiary"
                    : "text-on-surface"
                }`}
              >
                {finding.summary}
              </p>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {finding.rule?.source ? (
<<<<<<< HEAD
                  <span className="rounded border border-ink/20 px-2 py-1 font-label-caps text-label-caps text-on-surface-variant">
                    {String(finding.rule.source).toUpperCase() === "CUSTOM"
                      ? "Custom"
                      : String(finding.rule.source).toUpperCase() === "PREDEFINED"
                        ? "Predefined"
                        : "AI"}
=======
                  <span className="rounded border border-white/20 px-2 py-1 font-label-caps text-label-caps text-on-surface-variant">
                {sourceLabel(finding.rule?.source)}
>>>>>>> d628137d2c06f1070f5ed5b4ca2b43e1a4f42251
                  </span>
                ) : null}
                <span
                  className={`rounded border px-2 py-1 font-label-caps text-label-caps ${
                    finding.severity === "warning"
                      ? "border-tertiary/40 text-tertiary"
                      : "border-error/40 text-error"
                  }`}
                >
                  {finding.severity}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 font-body-sm text-body-sm text-on-surface-variant">
              <span>
                Affected:{" "}
                <span className="text-on-surface">
                  {finding.affectedCount} row
                  {finding.affectedCount === 1 ? "" : "s"}
                </span>
              </span>
              {finding.affectedRowsLabel ? (
                <span>
                  Sample:{" "}
                  <span className="font-mono-data text-mono-data text-primary">
                    {finding.affectedRowsLabel}
                  </span>
                </span>
              ) : null}
              <span>
                Rule:{" "}
                <span className="text-on-surface">{finding.ruleName}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function DataPreview({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns?: string[];
}) {
  if (!rows.length) return null;
  const displayColumns =
    columns?.length ? columns : Object.keys(rows[0] || {});

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-ink/10">
      <div className="border-b border-ink/10 bg-surface-container-high px-4 py-3 font-headline-sm text-headline-sm text-on-surface">
        Data Preview
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono-data text-mono-data">
          <thead>
            <tr className="bg-surface-container-high">
              {displayColumns.map((col) => (
                <th
                  key={col}
                  className="p-3 font-label-caps text-label-caps text-on-surface-variant"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-ink/10">
                {displayColumns.map((col) => (
                  <td key={col} className="p-3 text-on-surface">
                    {row[col] == null ? "—" : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CleaningReport({
  result = null,
  autoFixResult = null,
  autoFixLoading = false,
}: CleaningReportProps) {
  const report = result?.report ?? null;
  const fieldGroups = report?.fieldGroups ?? [];
  const [severity, setSeverity] = useState("");
  const [source, setSource] = useState("");
  const [fieldQuery, setFieldQuery] = useState("");
  const [failedOnly, setFailedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filteredGroups = useMemo(
    () =>
      filterFieldGroups(fieldGroups, {
        severity,
        source,
        field: fieldQuery,
        failedOnly,
      }),
    [fieldGroups, severity, source, fieldQuery, failedOnly],
  );

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedGroups = filteredGroups.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const summary = result?.summary;
  const totalRecords = summary?.totalRows ?? "—";
  const errors = summary?.errorCount ?? "—";
  const warnings = summary?.warningCount ?? "—";
  const meta = result
    ? `${result.rulesBusinessObject} • ${result.filename} • ${result.detection.confidence || "n/a"} confidence`
    : validationCopy.reportMeta;
  const refinedReady = Boolean(autoFixResult?.ok && result?.sessionId);
  const refinedFilename =
    autoFixResult?.refinedFilename || "preload_refined.xlsx";
  const previewRows =
    autoFixResult?.previewRefinedRows?.length
      ? autoFixResult.previewRefinedRows
      : result?.previewRows;

  async function handleDownload() {
    if (!result?.sessionId || !refinedReady) return;
    await downloadRefinedFile(result.sessionId, refinedFilename);
  }

  return (
    <div className="workspace-glass rounded-xl border-l-2 border-l-tertiary p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {validationCopy.reportTitle}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {meta}
          </p>
          {report?.headline ? (
            <p className="mt-2 max-w-3xl font-body-md text-body-md text-on-surface">
              {report.headline}
            </p>
          ) : null}
          {result?.detection?.reasoning ? (
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Detected as {result.detection.businessObject}:{" "}
              {result.detection.reasoning}
            </p>
          ) : null}
          {result?.columnMapping &&
          Object.entries(result.columnMapping).some(
            ([source, target]) => source !== target,
          ) ? (
            <p className="mt-2 font-body-sm text-body-sm text-primary">
              Descriptive columns mapped to SAP field names before validation
              {result.sapMetadataUsed ? " (via SAP metadata)" : ""}.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!refinedReady || autoFixLoading}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="download" className="text-[18px]" />
            <span className="text-sm font-medium">
              {autoFixLoading
                ? "Preparing refined file…"
                : validationCopy.downloadLabel}
            </span>
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ink/10 bg-surface-container-low p-4">
          <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
            {validationCopy.totalRecordsLabel}
          </p>
          <p className="font-display-lg text-display-lg text-on-surface">
            {totalRecords}
          </p>
        </div>
        <div className="rounded-lg border border-error/20 bg-error-container/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="error" className="text-[16px] text-error" />
            <p className="font-label-caps text-label-caps text-error">
              {validationCopy.errorsLabel}
            </p>
          </div>
          <p className="font-display-lg text-display-lg text-error">{errors}</p>
        </div>
        <div className="rounded-lg border border-tertiary/20 bg-tertiary-container/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="warning" className="text-[16px] text-tertiary" />
            <p className="font-label-caps text-label-caps text-tertiary">
              {validationCopy.warningsLabel}
            </p>
          </div>
          <p className="font-display-lg text-display-lg text-tertiary">
            {warnings}
          </p>
        </div>
      </div>

      {!result ? (
        <div className="rounded-xl border border-ink/10 bg-surface-container-low p-5 text-on-surface-variant">
          Upload a preload file and click Execute Cleaning to see findings by
          field.
        </div>
      ) : fieldGroups.length === 0 ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-primary">
          No violations found — the preload data passed the active ruleset.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">
              Findings by field
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={failedOnly}
                  onChange={(event) => {
                    setFailedOnly(event.target.checked);
                    setPage(1);
                  }}
                />
                Failed only
              </label>
              <select
                value={severity}
                onChange={(event) => {
                  setSeverity(event.target.value);
                  setPage(1);
                }}
                className="rounded border border-white/15 bg-surface-container-lowest px-2 py-1 font-body-sm text-body-sm text-on-surface"
              >
                <option value="">All severities</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
              </select>
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setPage(1);
                }}
                className="rounded border border-white/15 bg-surface-container-lowest px-2 py-1 font-body-sm text-body-sm text-on-surface"
              >
                <option value="">All sources</option>
                <option value="custom">Custom</option>
                <option value="predefined">Predefined</option>
                <option value="ai">AI</option>
              </select>
              <input
                type="search"
                value={fieldQuery}
                onChange={(event) => {
                  setFieldQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Filter by field"
                className="rounded border border-white/15 bg-surface-container-lowest px-2 py-1 font-body-sm text-body-sm text-on-surface"
              />
            </div>
          </div>
          {filteredGroups.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-surface-container-lowest/40 p-5 text-on-surface-variant">
              No findings match the current filters.
            </div>
          ) : (
            pagedGroups.map((group) => (
              <FieldGroupCard key={group.fieldName} group={group} />
            ))
          )}
          {filteredGroups.length > PAGE_SIZE ? (
            <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredGroups.length)} of{" "}
                {filteredGroups.length} fields
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded border border-white/15 px-3 py-1 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                  className="rounded border border-white/15 px-3 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {result && autoFixLoading ? (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 font-body-sm text-body-sm text-primary">
          Applying auto-fix rules to SAP-mapped data…
        </div>
      ) : null}

      {autoFixResult?.ok ? (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-body-md text-body-md text-on-surface">
            Refined file ready: {autoFixResult.refinedFilename}
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            SAP field names with fixes applied — Applied {autoFixResult.fixesApplied}{" "}
            fix{autoFixResult.fixesApplied === 1 ? "" : "es"}
            {autoFixResult.fixesSkipped
              ? ` • ${autoFixResult.fixesSkipped} could not be auto-fixed`
              : ""}
          </p>
        </div>
      ) : null}

      {previewRows?.length ? (
        <DataPreview
          rows={previewRows}
          columns={result?.originalColumns}
        />
      ) : null}
    </div>
  );
}
