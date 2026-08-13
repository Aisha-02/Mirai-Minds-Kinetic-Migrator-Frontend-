import { validationCopy } from "@/lib/mock/validation";

export function ValidationPageHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display-lg text-display-lg text-on-surface">
        {validationCopy.pageTitle}
      </h1>
      <p className="font-headline-sm text-headline-sm font-normal text-on-surface-variant">
        {validationCopy.pageSubtitle}
      </p>
    </div>
  );
}
