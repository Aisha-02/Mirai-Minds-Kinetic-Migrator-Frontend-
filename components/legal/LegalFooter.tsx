import { legalCopy, legalFooterLinks } from "@/lib/mock/legal";

export function LegalFooter() {
  return (
    <footer className="relative z-40 flex w-full flex-col items-center justify-between gap-4 border-t border-outline-variant/10 bg-surface-container-lowest px-grid-gutter py-8 md:ml-sidebar-width md:w-[calc(100%-260px)] md:flex-row">
      <span className="font-label-caps text-label-caps text-on-surface-variant">
        {legalCopy.copyright}
      </span>
      <div className="flex gap-6 font-body-sm text-body-sm">
        {legalFooterLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-on-surface-variant transition-opacity hover:text-on-surface"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
