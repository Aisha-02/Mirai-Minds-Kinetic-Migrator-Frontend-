"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  formatConfidencePercent,
  getConfidenceLevel,
  type SchemaFieldMapping,
} from "@/lib/api/schemaMapping";
import { mappingCopy } from "@/lib/mock/mapping";

type ConfidenceTone = "primary" | "tertiary" | "primary-container";

const confidenceBarClass: Record<ConfidenceTone, string> = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  "primary-container": "bg-primary-container",
};

const confidenceTextClass: Record<ConfidenceTone, string> = {
  primary: "text-primary",
  tertiary: "text-tertiary",
  "primary-container": "text-primary-container",
};

function toneForLevel(level: ReturnType<typeof getConfidenceLevel>): ConfidenceTone {
  if (level === "low") return "tertiary";
  if (level === "medium") return "primary-container";
  return "primary";
}

function MappingRow({ row }: { row: SchemaFieldMapping }) {
  const level = getConfidenceLevel(row.confidenceScore);
  const confidencePercent = Math.round(row.confidenceScore * 100);
  const tone = toneForLevel(level);
  const lowConfidence = level === "low";

  return (
    <tr
      className={`table-row-border transition-colors hover:bg-white/5 ${
        lowConfidence ? "border-l-2 border-l-error bg-error-container/10" : ""
      }`}
    >
      <td className="px-5 py-4">
        <div
          className={`text-on-surface ${lowConfidence ? "flex items-center gap-2" : ""}`}
        >
          {row.sourceField}
          {lowConfidence ? (
            <Icon name="warning" className="text-[14px] text-error" />
          ) : null}
        </div>
      </td>
      <td className="px-5 py-4">
        <div
          className={
            lowConfidence ? "text-tertiary" : "text-primary-fixed-dim"
          }
        >
          {row.sapField || "—"}
        </div>
      </td>
      <td className="px-5 py-4 font-body-sm text-body-sm text-on-surface-variant">
        {row.reasoning || "—"}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className={`h-full rounded-full ${confidenceBarClass[tone]}`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className={`w-10 text-right ${confidenceTextClass[tone]}`}>
            {formatConfidencePercent(row.confidenceScore)}
          </span>
        </div>
      </td>
    </tr>
  );
}

type FieldMappingTableProps = {
  mappings?: SchemaFieldMapping[];
  generating?: boolean;
  canAnalyze?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;
  onAnalyze?: () => void;
};

export function FieldMappingTable({
  mappings = [],
  generating = false,
  canAnalyze = false,
  readOnly = false,
  emptyMessage = "Upload a source schema and generate mappings to see results here.",
  onAnalyze,
}: FieldMappingTableProps) {
  const [search, setSearch] = useState("");

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mappings;
    return mappings.filter(
      (row) =>
        row.sourceField.toLowerCase().includes(query) ||
        (row.sapField ?? "").toLowerCase().includes(query) ||
        row.reasoning.toLowerCase().includes(query),
    );
  }, [mappings, search]);

  return (
    <div className="mapping-glass flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-xl">
      <div className="flex flex-col justify-between gap-4 border-b border-white/5 bg-surface/20 p-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {mappingCopy.tableTitle}
          </h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {mappingCopy.tableSubtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="input-glass w-full rounded-t-md py-2 pr-4 pl-9 font-body-sm text-body-sm text-on-surface transition-all sm:w-64"
            placeholder={mappingCopy.searchPlaceholder}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!readOnly ? (
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!canAnalyze || generating}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-body-sm text-body-sm font-medium text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="analytics" className="text-sm" />
              {generating ? "Analyzing…" : mappingCopy.analyzeLabel}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {mappings.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 p-6 text-center">
            <Icon
              name="compare_arrows"
              className="text-3xl text-on-surface-variant"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-white/10 bg-surface-container-high/90 shadow-sm backdrop-blur-md">
              <tr>
                <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  {mappingCopy.colSource}
                </th>
                <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  {mappingCopy.colTarget}
                </th>
                <th className="w-[30%] px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Reasoning
                </th>
                <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  {mappingCopy.colConfidence}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data">
              {filteredMappings.map((row) => (
                <MappingRow key={row.sourceField} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
