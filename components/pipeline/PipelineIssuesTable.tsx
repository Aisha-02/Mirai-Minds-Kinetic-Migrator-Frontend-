"use client";

import { useEffect, useState } from "react";
import { AlvDataGrid, type AlvColumn } from "@/components/ui/AlvDataGrid";
import { Icon } from "@/components/ui/Icon";
import {
  pipelineCopy,
  pipelineIssues,
  pipelineSeverityStyles,
  type PipelineIssue,
} from "@/lib/mock/pipeline";

type IssueRow = {
  id: string;
  severity: string;
  category: string;
  description: string;
  affectedRecords: string;
};

const columns: AlvColumn<IssueRow>[] = [
  {
    key: "severity",
    label: "Severity",
    filter: "select",
    headerClassName: "w-24",
    render: (value) => {
      const key = String(value) as PipelineIssue["severity"];
      const severity = pipelineSeverityStyles[key];
      if (!severity) return String(value ?? "");
      return (
        <span
          className={`inline-flex items-center justify-center rounded border px-2 py-1 font-label-caps text-label-caps font-bold ${severity.className}`}
        >
          {severity.label}
        </span>
      );
    },
  },
  {
    key: "category",
    label: "Category",
    filter: "select",
    render: (value) => (
      <span className="font-medium text-white">{String(value ?? "")}</span>
    ),
  },
  {
    key: "description",
    label: "Issue Description",
    filter: "text",
    headerClassName: "w-1/3",
    render: (value) => (
      <span className="text-on-surface">{String(value ?? "")}</span>
    ),
  },
  {
    key: "affectedRecords",
    label: "Affected Records",
    filter: "text",
    align: "right",
    render: (value) => (
      <span className="font-mono-data text-mono-data font-bold text-white">
        {String(value ?? "")}
      </span>
    ),
  },
];

export function PipelineIssuesTable({
  issues,
}: {
  issues?: PipelineIssue[];
}) {
  const source = issues ?? pipelineIssues;
  const rows: IssueRow[] = source.map((issue) => ({
    id: issue.id,
    severity: issue.severity,
    category: issue.category,
    description: issue.description,
    affectedRecords: issue.affectedRecords,
  }));

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [resetSignal, setResetSignal] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    setResetSignal((n) => n + 1);
  }, [issues]);

  function showAll() {
    setFilters({});
    setResetSignal((n) => n + 1);
  }

  function showCriticalOnly() {
    setFilters({ severity: "critical" });
    setResetSignal((n) => n + 1);
  }

  return (
    <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container">
      <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface-container-high p-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-headline-sm text-headline-sm font-bold text-white">
          {pipelineCopy.issuesTitle}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant">
            Rows
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="rounded border border-outline-variant/30 bg-surface-dim px-2 py-0.5 text-on-surface focus:border-primary focus:outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={showAll}
            className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1.5 font-label-caps text-label-caps text-white transition-colors hover:bg-surface-bright"
          >
            <Icon name="filter_list" className="text-[14px]" />
            {pipelineCopy.filterAllLabel}
          </button>
          <button
            type="button"
            onClick={showCriticalOnly}
            className="flex items-center gap-1 rounded-full border border-error bg-surface-container-highest px-3 py-1.5 font-label-caps text-label-caps text-error transition-colors hover:bg-surface-bright"
          >
            {pipelineCopy.filterCriticalLabel}
          </button>
        </div>
      </div>

      <AlvDataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={pageSize}
        rowLabel="issues"
        emptyMessage="No findings for this comparison"
        filters={filters}
        onFiltersChange={setFilters}
        resetSignal={resetSignal}
      />
    </div>
  );
}
