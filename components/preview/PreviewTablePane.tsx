import { Icon } from "@/components/ui/Icon";
import type { PreviewCell, PreviewPane } from "@/lib/mock/preview";

type PreviewTablePaneProps = {
  pane: PreviewPane;
  visible: boolean;
};

function cellToneClass(tone: PreviewCell["tone"]) {
  if (tone === "error") return "bg-error/5 text-error";
  if (tone === "tertiary") return "bg-tertiary/5 text-tertiary";
  return "text-on-surface";
}

export function PreviewTablePane({ pane, visible }: PreviewTablePaneProps) {
  return (
    <div
      className={`${
        visible ? "flex" : "hidden"
      } absolute inset-0 flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-container`}
      id={`${pane.id}-pane`}
    >
      <div
        className={`flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 ${
          pane.badge.tone === "mapped"
            ? "relative overflow-hidden bg-surface-container-highest"
            : "bg-surface-container-highest"
        }`}
      >
        {pane.badge.tone === "mapped" ? (
          <div className="absolute inset-0 bg-primary/5" />
        ) : null}
        <h3
          className={`font-headline-sm text-headline-sm text-on-surface ${
            pane.badge.tone === "mapped" ? "relative z-10" : ""
          }`}
        >
          {pane.title}{" "}
          <span className="ml-2 text-sm font-normal text-on-surface-variant">
            {pane.subtitle}
          </span>
        </h3>
        {pane.badge.tone === "mapped" ? (
          <span className="relative z-10 flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-1 font-label-caps text-label-caps text-primary">
            <Icon name="auto_awesome" className="text-[12px]" />
            {pane.badge.label}
          </span>
        ) : (
          <span className="rounded border border-white/5 bg-surface-dim px-2 py-1 font-label-caps text-label-caps text-on-surface-variant">
            {pane.badge.label}
          </span>
        )}
      </div>

      <div className="relative flex-1 overflow-auto">
        {pane.accentRail ? (
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-tertiary" />
        ) : null}
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-surface-container">
            <tr>
              {pane.columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 font-label-caps text-label-caps font-semibold tracking-wider text-on-surface"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {pane.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 transition-colors hover:bg-white/5"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.id}-${pane.columns[index]?.key ?? index}`}
                    className={`px-4 py-3 ${cellToneClass(cell.tone)}`}
                  >
                    {cell.value}
                    {cell.note ? (
                      <>
                        {" "}
                        <span className="text-[10px] text-outline">
                          {cell.note}
                        </span>
                      </>
                    ) : null}
                    <br />
                    <span className="text-[10px] text-outline">
                      {cell.typeLabel}
                    </span>
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
