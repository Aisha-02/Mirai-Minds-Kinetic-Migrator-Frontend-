"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  legalCopy,
  legalDocuments,
  type LegalDocId,
} from "@/lib/mock/legal";

const DEFAULT_DOC: LegalDocId = "terms-of-service";

function docFromHash(): LegalDocId {
  if (typeof window === "undefined") return DEFAULT_DOC;
  const id = window.location.hash.replace("#", "") as LegalDocId;
  return legalDocuments.some((doc) => doc.id === id) ? id : DEFAULT_DOC;
}

export function LegalCenterScreen() {
  const [activeId, setActiveId] = useState<LegalDocId>(DEFAULT_DOC);

  useEffect(() => {
    function applyHash() {
      const id = docFromHash();
      setActiveId(id);
      const node = document.getElementById(id);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-surface/90 px-6 py-3 backdrop-blur-[20px]">
        <Link href="/register" className="flex items-center gap-3">
          <Image
            src="/kinetic-logo.png"
            alt={legalCopy.logoAlt}
            width={411}
            height={179}
            className="h-10 w-auto rounded-md"
            priority
          />
        </Link>
        <Link
          href="/signin"
          className="rounded-DEFAULT bg-primary px-4 py-2 font-headline-sm text-headline-sm font-semibold text-on-primary shadow-primary transition-colors hover:bg-primary-fixed"
        >
          {legalCopy.signInLabel}
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="lg:sticky lg:top-24">
            <h1 className="font-headline-md text-headline-md font-semibold text-on-surface">
              {legalCopy.sidebarTitle}
            </h1>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              {legalCopy.lastUpdated}
            </p>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Legal documents">
              {legalDocuments.map((doc) => {
                const active = activeId === doc.id;
                return (
                  <a
                    key={doc.id}
                    href={`#${doc.id}`}
                    className={`flex items-center gap-3 rounded-DEFAULT px-3 py-2 font-body-md text-body-md transition-colors ${
                      active
                        ? "border-r-2 border-primary bg-primary/10 font-semibold text-primary"
                        : "text-on-surface-variant hover:bg-ink/5 hover:text-on-surface"
                    }`}
                  >
                    <Icon name={doc.icon} filled={active} className="text-[20px]" />
                    {doc.title}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <article className="rounded-xl border border-ink/10 bg-surface p-6 shadow-card sm:p-8">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
              {legalCopy.pageTitle}
            </h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              {legalCopy.pageIntro}
            </p>

            <div className="mt-8 flex flex-col gap-10">
              {legalDocuments.map((doc) => (
                <section
                  key={doc.id}
                  id={doc.id}
                  className="scroll-mt-24"
                >
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">
                    {doc.title}
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {doc.sections.map((section) => (
                      <div key={section.title} className="flex flex-col gap-1">
                        <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                          {section.title}
                        </h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {section.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </main>
      </div>

      <footer className="mt-auto border-t border-ink/10 bg-surface px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {legalCopy.footerCopyright}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-body-sm text-body-sm">
            <a
              href="mailto:legal@kineticmigrator.example"
              className="text-on-surface transition-colors hover:text-primary"
            >
              {legalCopy.contactLegal}
            </a>
            <a
              href="#privacy-policy"
              className="text-on-surface transition-colors hover:text-primary"
            >
              {legalCopy.globalPrivacy}
            </a>
            <a
              href="#privacy-policy"
              className="text-on-surface transition-colors hover:text-primary"
            >
              {legalCopy.cookieSettings}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
