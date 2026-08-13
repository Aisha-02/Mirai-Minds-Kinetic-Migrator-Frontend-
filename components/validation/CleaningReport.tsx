import { Icon } from "@/components/ui/Icon";
import { validationCopy, validationIssues } from "@/lib/mock/validation";

export function CleaningReport() {
  return (
    <div className="workspace-glass rounded-xl border-l-2 border-l-tertiary p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {validationCopy.reportTitle}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {validationCopy.reportMeta}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-white/10 bg-surface-bright px-4 py-2 text-on-surface transition-colors hover:bg-white/10"
        >
          <Icon name="download" className="text-[18px]" />
          <span className="text-sm font-medium">
            {validationCopy.downloadLabel}
          </span>
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-surface-container-lowest/50 p-4">
          <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
            {validationCopy.totalRecordsLabel}
          </p>
          <p className="font-display-lg text-display-lg text-on-surface">
            {validationCopy.totalRecordsValue}
          </p>
        </div>
        <div className="rounded-lg border border-error/20 bg-error-container/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="error" className="text-[16px] text-error" />
            <p className="font-label-caps text-label-caps text-error">
              {validationCopy.errorsLabel}
            </p>
          </div>
          <p className="font-display-lg text-display-lg text-error">
            {validationCopy.errorsValue}
          </p>
        </div>
        <div className="rounded-lg border border-tertiary/20 bg-tertiary-container/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="warning" className="text-[16px] text-tertiary" />
            <p className="font-label-caps text-label-caps text-tertiary">
              {validationCopy.warningsLabel}
            </p>
          </div>
          <p className="font-display-lg text-display-lg text-tertiary">
            {validationCopy.warningsValue}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-bright/30">
              <th className="border-b border-white/5 p-3 font-label-caps text-label-caps text-on-surface-variant">
                Row
              </th>
              <th className="border-b border-white/5 p-3 font-label-caps text-label-caps text-on-surface-variant">
                Field
              </th>
              <th className="border-b border-white/5 p-3 font-label-caps text-label-caps text-on-surface-variant">
                Issue
              </th>
              <th className="border-b border-white/5 p-3 font-label-caps text-label-caps text-on-surface-variant">
                Rule Violated
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {validationIssues.map((issue, index) => (
              <tr
                key={issue.id}
                className={
                  index === validationIssues.length - 1
                    ? "transition-colors hover:bg-white/5"
                    : "border-b border-white/5 transition-colors hover:bg-white/5"
                }
              >
                <td className="p-3 text-on-surface">{issue.row}</td>
                <td className="p-3 text-on-surface">{issue.field}</td>
                <td
                  className={`flex items-center gap-2 p-3 ${
                    issue.severity === "warning" ? "text-tertiary" : "text-error"
                  }`}
                >
                  <Icon
                    name={issue.severity === "warning" ? "warning" : "close"}
                    className="text-[14px]"
                  />
                  {issue.issue}
                </td>
                <td className="p-3 text-on-surface-variant">{issue.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
