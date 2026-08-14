import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { legalCopy, legalNavItems } from "@/lib/mock/legal";

type LegalSideNavProps = {
  activeId: string;
};

export function LegalSideNav({ activeId }: LegalSideNavProps) {
  return (
    <nav className="fixed top-16 bottom-0 left-0 hidden w-sidebar-width flex-col border-r border-outline-variant/20 bg-surface-container-low/60 py-6 backdrop-blur-2xl md:flex">
      <div className="mb-8 px-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {legalCopy.sideTitle}
        </h2>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          {legalCopy.lastUpdated}
        </p>
      </div>
      <div className="flex w-full flex-col gap-1">
        {legalNavItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                isActive
                  ? "flex cursor-pointer items-center gap-3 border-r-4 border-primary bg-primary-container/20 px-6 py-3 font-label-caps text-label-caps text-primary"
                  : "flex cursor-pointer items-center gap-3 px-6 py-3 font-label-caps text-label-caps text-on-surface-variant transition-all hover:bg-surface-container-highest"
              }
            >
              <Icon name={item.icon} className="text-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
