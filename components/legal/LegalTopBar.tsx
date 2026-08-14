import Link from "next/link";
import { legalCopy } from "@/lib/mock/legal";

export function LegalTopBar() {
  return (
    <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/80 px-grid-gutter shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
          {legalCopy.productName}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/signin"
          className="rounded-DEFAULT bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary-fixed transition-colors hover:bg-primary-fixed"
        >
          {legalCopy.signInLabel}
        </Link>
      </div>
    </header>
  );
}
