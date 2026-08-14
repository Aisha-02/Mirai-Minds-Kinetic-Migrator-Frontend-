import { Icon } from "@/components/ui/Icon";
import { mappingCopy } from "@/lib/mock/mapping";

type AnalysisSourceSummaryCardProps = {
  fileName: string | null;
  businessObjectLabel: string;
  mappingCount: number;
  statusMessage?: string | null;
};

export function AnalysisSourceSummaryCard({
  fileName,
  businessObjectLabel,
  mappingCount,
  statusMessage = null,
}: AnalysisSourceSummaryCardProps) {
  return (
    <div className="mapping-glass col-span-12 flex flex-col gap-4 rounded-xl p-5 lg:col-span-6">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Active Source Schema
        </h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          Read-only view of the file uploaded from Admin.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            File
          </div>
          <div className="mt-1 truncate font-mono-data text-mono-data text-primary">
            {fileName ?? "—"}
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            Business Object
          </div>
          <div className="mt-1 font-body-md text-body-md text-on-surface">
            {businessObjectLabel}
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            Mapped Fields
          </div>
          <div className="mt-1 font-mono-data text-mono-data text-on-surface">
            {mappingCount}
          </div>
        </div>
      </div>
      {statusMessage ? (
        <p className="font-body-sm text-body-sm text-primary" role="status">
          {statusMessage}
        </p>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {mappingCopy.tableSubtitle}
        </p>
      )}
      <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
        <Icon name="info" className="text-sm" />
        Upload and generate mappings from the Admin tab.
      </div>
    </div>
  );
}
