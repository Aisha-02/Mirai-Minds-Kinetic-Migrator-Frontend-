import { Icon } from "@/components/ui/Icon";
import { mappingConfidenceWidth, mappingCopy } from "@/lib/mock/mapping";

export function MappingConfidenceCard() {
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
          {mappingCopy.confidenceValue}
        </span>
        <span className="mb-1 flex items-center gap-1 font-body-sm text-body-sm text-primary">
          <Icon name="arrow_upward" className="text-[16px]" />
          {mappingCopy.confidenceDelta}
        </span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: mappingConfidenceWidth }}
        />
      </div>
    </div>
  );
}
