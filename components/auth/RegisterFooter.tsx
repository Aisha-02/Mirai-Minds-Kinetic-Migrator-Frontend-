import Link from "next/link";
import { registerCopy } from "@/lib/mock/register";

export function RegisterFooter() {
  return (
    <div className="border-t border-outline-variant/30 pt-4 text-center font-body-sm text-body-sm text-on-surface-variant">
      {registerCopy.footerPrompt}{" "}
      <Link
        href="/signin"
        className="ml-1 font-medium text-brand-blue transition-colors hover:text-primary"
      >
        {registerCopy.signInLabel}
      </Link>
    </div>
  );
}
