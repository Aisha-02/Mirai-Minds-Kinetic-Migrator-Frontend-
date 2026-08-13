import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { previewCopy, type PreviewPane } from "@/lib/mock/preview";

type PreviewActionBarProps = {
  panes: PreviewPane[];
  activePaneId: PreviewPane["id"];
  onTabChange: (id: PreviewPane["id"]) => void;
};

export function PreviewActionBar({
  panes,
  activePaneId,
  onTabChange,
}: PreviewActionBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          href="/staging"
          className="mb-1 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {previewCopy.backLabel}
        </Link>
        <h2 className="font-display-lg text-display-lg text-on-surface">
          {previewCopy.pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-high p-1">
        {panes.map((pane) => {
          const active = pane.id === activePaneId;
          return (
            <button
              key={pane.id}
              type="button"
              onClick={() => onTabChange(pane.id)}
              className={`rounded-md px-6 py-2 font-headline-sm text-headline-sm font-bold transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {pane.tabLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
