import Link from "next/link";
import { signInCopy } from "@/lib/mock/signin";

export function SignInFooter() {
  return (
    <div className="border-t border-outline-variant/30 pt-4 text-center font-body-sm text-body-sm text-on-surface-variant">
      {signInCopy.footerPrompt}{" "}
      <Link
        href="/register"
        className="ml-1 font-medium text-primary transition-colors hover:text-primary-fixed"
      >
        {signInCopy.registerLabel}
      </Link>
    </div>
  );
}
