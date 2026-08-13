"use client";

import { useEffect, useState } from "react";
import { LegalContent } from "@/components/legal/LegalContent";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { LegalSideNav } from "@/components/legal/LegalSideNav";
import { LegalTopBar } from "@/components/legal/LegalTopBar";
import { DEFAULT_LEGAL_SECTION_ID, legalNavItems } from "@/lib/mock/legal";

function sectionIdFromHash(hash: string) {
  const id = hash.replace(/^#/, "");
  return legalNavItems.some((item) => item.id === id)
    ? id
    : DEFAULT_LEGAL_SECTION_ID;
}

export function LegalScreen() {
  const [activeId, setActiveId] = useState(DEFAULT_LEGAL_SECTION_ID);

  useEffect(() => {
    function syncHash() {
      setActiveId(sectionIdFromHash(window.location.hash));
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <LegalTopBar />
      <LegalSideNav activeId={activeId} />
      <LegalContent />
      <LegalFooter />
    </div>
  );
}
