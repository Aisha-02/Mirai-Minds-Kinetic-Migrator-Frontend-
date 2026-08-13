import { Icon } from "@/components/ui/Icon";
import {
  fieldMappingRows,
  mappingCopy,
  type FieldMappingRow,
  type MappingConfidenceTone,
} from "@/lib/mock/mapping";

const confidenceBarClass: Record<MappingConfidenceTone, string> = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  "primary-container": "bg-primary-container",
};

const confidenceTextClass: Record<MappingConfidenceTone, string> = {
  primary: "text-primary",
  tertiary: "text-tertiary",
  "primary-container": "text-primary-container",
};

function MappingRow({ row }: { row: FieldMappingRow }) {
  return (
    <tr
      className={`table-row-border transition-colors hover:bg-white/5 ${
        row.warning ? "border-l-2 border-l-error bg-error-container/10" : ""
      }`}
    >
      <td className="px-5 py-4">
        <div
          className={`text-on-surface ${row.warning ? "flex items-center gap-2" : ""}`}
        >
          {row.sourceField}
          {row.warning ? (
            <Icon name="warning" className="text-[14px] text-error" />
          ) : null}
        </div>
        {row.sourceHint ? (
          <div className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
            {row.sourceHint}
          </div>
        ) : null}
      </td>
      <td className="px-5 py-4">
        <div
          className={
            row.targetTone === "tertiary"
              ? "text-tertiary"
              : "text-primary-fixed-dim"
          }
        >
          {row.targetField}
        </div>
        {row.warningHint ? (
          <div className="mt-1 flex items-center gap-1 font-body-sm text-[11px] text-error">
            {row.warningHint}
          </div>
        ) : row.targetHint ? (
          <div className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
            {row.targetHint}
          </div>
        ) : null}
      </td>
      <td className="px-5 py-4 text-on-surface-variant">{row.dataType}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className={`h-full rounded-full ${confidenceBarClass[row.confidenceTone]}`}
              style={{ width: `${row.confidence}%` }}
            />
          </div>
          <span
            className={`w-8 text-right ${confidenceTextClass[row.confidenceTone]}`}
          >
            {row.confidence}%
          </span>
        </div>
      </td>
    </tr>
  );
}

type FieldMappingTableProps = {
  onAnalyze?: () => void;
};

export function FieldMappingTable({ onAnalyze }: FieldMappingTableProps) {
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
          />
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-white/5"
          >
            <Icon name="filter_list" className="text-sm" />
            {mappingCopy.filterLabel}
          </button>
          <button
            type="button"
            onClick={onAnalyze}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-body-sm text-body-sm font-medium text-on-primary transition-colors hover:bg-primary/90"
          >
            <Icon name="analytics" className="text-sm" />
            {mappingCopy.analyzeLabel}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-surface-container-high/90 shadow-sm backdrop-blur-md">
            <tr>
              <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                {mappingCopy.colSource}
              </th>
              <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                {mappingCopy.colTarget}
              </th>
              <th className="w-[15%] px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                {mappingCopy.colDataType}
              </th>
              <th className="w-1/4 px-5 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">
                {mappingCopy.colConfidence}
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {fieldMappingRows.map((row) => (
              <MappingRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
