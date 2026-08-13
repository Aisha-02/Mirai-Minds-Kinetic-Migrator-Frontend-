import { Icon } from "@/components/ui/Icon";
import { mappingCopy } from "@/lib/mock/mapping";

type MappingConfidenceCardProps = {
  averageConfidence?: number | null;
};

export function MappingConfidenceCard({
  averageConfidence = null,
}: MappingConfidenceCardProps) {
  const hasData =
    averageConfidence !== null && averageConfidence !== undefined;
  const displayValue = hasData ? `${averageConfidence.toFixed(1)}%` : "—";
  const barWidth = hasData ? `${Math.min(100, averageConfidence)}%` : "0%";

  return (
    <div className="mapping-glass col-span-12 flex flex-col rounded-xl p-5 transition-all duration-300 lg:col-span-4">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
          {mappingCopy.confidenceTitle}
        </h3>
        <Icon name="monitor_heart" className="text-sm text-primary" />
      </div>
      <div className="mt-auto flex items-end gap-3">
        <span className="font-display-lg text-display-lg leading-none text-on-surface">
          {displayValue}
        </span>
        {hasData ? (
          <span className="mb-1 font-body-sm text-body-sm text-on-surface-variant">
            avg. across {mappingCopy.tableTitle.toLowerCase()}
          </span>
        ) : null}
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}
