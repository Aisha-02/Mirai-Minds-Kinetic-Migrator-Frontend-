import { Icon } from "@/components/ui/Icon";
import { stagingCopy, transformationDocs } from "@/lib/mock/staging";

export function TransformationDocuments() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-center gap-3">
          <Icon name="tune" className="text-tertiary" />
          <h3 className="font-headline-md text-headline-md text-white">
            {stagingCopy.documentsTitle}
          </h3>
        </div>
        <span className="rounded border border-outline-variant bg-surface-container-high px-2 py-1 font-label-caps text-label-caps font-bold text-on-surface">
          {stagingCopy.documentsBadge}
        </span>
      </div>

      <div className="flex flex-grow flex-col gap-4">
        <div className="flex flex-col gap-3">
          {transformationDocs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant bg-surface-container-highest p-3 transition-colors hover:bg-surface-container-high"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={doc.icon}
                  className="text-[20px] text-on-surface"
                />
                <span className="font-headline-sm text-headline-sm text-white">
                  {doc.label}
                </span>
              </div>
              <Icon name="download" className="text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
