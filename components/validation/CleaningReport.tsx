"use client";

import { Icon } from "@/components/ui/Icon";
import type {
  CleanupSessionPublic,
  ExecuteCleanupResponse,
  PlainLanguageFieldGroup,
} from "@/lib/api/validation";
import { downloadCorrectedFile } from "@/lib/api/validation";
import { validationCopy } from "@/lib/mock/validation";

type CleaningReportProps = {
  result?: ExecuteCleanupResponse | null;
  session?: CleanupSessionPublic | null;
  onSuggestAi?: () => void;
};

function FieldGroupCard({ group }: { group: PlainLanguageFieldGroup }) {
  const tone =
    group.errorCount > 0 ? "border-error/30" : "border-tertiary/30";

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface-container ${tone}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-surface-container-high/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <Icon
            name="data_object"
            className={group.errorCount > 0 ? "text-error" : "text-tertiary"}
          />
          <div>
            <h4 className="font-headline-sm text-headline-sm text-white">
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

      <ul className="divide-y divide-white/5">
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
              <span
                className={`shrink-0 rounded border px-2 py-1 font-label-caps text-label-caps ${
                  finding.severity === "warning"
                    ? "border-tertiary/40 text-tertiary"
                    : "border-error/40 text-error"
                }`}
              >
                {finding.severity}
              </span>
            </div>

            <div className="rounded-lg border border-white/5 bg-surface-container-lowest/50 p-3">
              <p className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
                What to correct
              </p>
              <p className="font-body-sm text-body-sm text-on-surface">
                {finding.whatToCorrect}
              </p>
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
}: {
  rows: Record<string, unknown>[];
}) {
  if (!rows.length) return null;
  const columns = Object.keys(rows[0] || {}).slice(0, 8);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/5">
      <div className="border-b border-white/5 bg-surface-bright/20 px-4 py-3 font-headline-sm text-headline-sm text-on-surface">
        Corrected data preview (first {rows.length} rows)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono-data text-mono-data">
          <thead>
            <tr className="bg-surface-bright/10">
              {columns.map((col) => (
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
              <tr key={index} className="border-t border-white/5">
                {columns.map((col) => (
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
  session = null,
  onSuggestAi,
}: CleaningReportProps) {
  const report = result?.report ?? session?.report ?? null;
  const fieldGroups = report?.fieldGroups ?? [];
  const summary = result?.summary ?? session?.summary;
  const totalRecords = summary?.totalRows ?? "—";
  const errors = summary?.errorCount ?? "—";
  const warnings = summary?.warningCount ?? "—";
  const meta = result
    ? `${result.rulesBusinessObject} • ${result.filename} • ${result.detection.confidence || "n/a"} confidence`
    : session
      ? `${session.businessObject} • ${session.filename}`
      : validationCopy.reportMeta;

  return (
    <div className="workspace-glass rounded-xl border-l-2 border-l-tertiary p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
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
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSuggestAi}
            className="flex items-center gap-2 rounded bg-tertiary-container px-4 py-2 text-on-tertiary shadow-sm transition-colors hover:bg-tertiary-fixed-dim"
          >
            <Icon name="smart_toy" className="text-[18px]" />
            <span className="text-sm font-medium">
              {validationCopy.suggestViaAiLabel}
            </span>
          </button>
          {session?.id ? (
            <button
              type="button"
              onClick={() =>
                void downloadCorrectedFile(session.id, session.filename)
              }
              className="flex items-center gap-2 rounded border border-white/10 bg-surface-bright px-4 py-2 text-on-surface transition-colors hover:bg-white/10"
            >
              <Icon name="download" className="text-[18px]" />
              <span className="text-sm font-medium">Download corrected CSV</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-surface-container-lowest/50 p-4">
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

      {!result && !session ? (
        <div className="rounded-xl border border-white/5 bg-surface-container-lowest/40 p-5 text-on-surface-variant">
          Upload a preload file and click Execute Cleaning to see a
          plain-language validation report.
        </div>
      ) : fieldGroups.length === 0 ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-primary">
          No violations found — the preload data passed the active ruleset.
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-headline-sm text-headline-sm text-on-surface">
            Findings by field
          </h4>
          {fieldGroups.map((group) => (
            <FieldGroupCard key={group.fieldName} group={group} />
          ))}
        </div>
      )}

      {session?.previewRows?.length ? (
        <DataPreview rows={session.previewRows} />
      ) : null}
    </div>
  );
}
