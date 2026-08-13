import { mappingCopy } from "@/lib/mock/mapping";

const GAUGE_CIRCUMFERENCE = 283;

type MigrationProgressCardProps = {
  mappedCount?: number;
  totalFields?: number;
  businessObject?: string | null;
  fileName?: string | null;
  statusMessage?: string | null;
};

export function MigrationProgressCard({
  mappedCount = 0,
  totalFields = 0,
  businessObject = null,
  fileName = null,
  statusMessage = null,
}: MigrationProgressCardProps) {
  const hasData = totalFields > 0;
  const percent = hasData ? Math.round((mappedCount / totalFields) * 100) : 0;
  const gaugeOffset = GAUGE_CIRCUMFERENCE * (1 - percent / 100);

  const phaseLine =
    businessObject && fileName
      ? `${businessObject} · ${fileName}`
      : businessObject || fileName || "No active mapping";

  const recordsValue = hasData
    ? `${mappedCount} / ${totalFields}`
    : "— / —";

  return (
    <div className="mapping-glass col-span-12 flex flex-col items-stretch justify-between gap-6 rounded-xl p-5 transition-all duration-300 sm:flex-row sm:items-center lg:col-span-8">
      <div className="flex flex-col">
        <h3 className="mb-2 font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
          {mappingCopy.progressTitle}
        </h3>
        <div className="font-headline-md text-headline-md text-on-surface">
          {phaseLine}
        </div>
        <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          {statusMessage || (hasData ? "Field mapping progress" : "—")}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="font-body-md text-body-md text-on-surface">
            {mappingCopy.recordsLabel}
          </div>
          <div className="mt-1 font-mono-data text-mono-data text-primary">
            {recordsValue} fields mapped
          </div>
        </div>
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <circle
              className="transition-all duration-1000 ease-out"
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="#90cdff"
              strokeDasharray={GAUGE_CIRCUMFERENCE}
              strokeDashoffset={gaugeOffset}
              strokeWidth="10"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-headline-sm text-headline-sm font-bold">
            {hasData ? `${percent}%` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
