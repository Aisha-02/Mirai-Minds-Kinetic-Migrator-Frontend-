import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import {
  adminCopy,
  adminNavPrimary,
  adminNavSecondary,
  type AdminNavKey,
} from "@/lib/mock/admin";

type AdminSideNavProps = {
  activeKey: AdminNavKey;
};

export function AdminSideNav({ activeKey }: AdminSideNavProps) {
  return (
    <nav className="fixed top-0 left-0 z-50 flex h-screen w-sidebar-width flex-col border-r border-white/10 bg-surface/60 px-4 py-6 shadow-none backdrop-blur-[20px]">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-primary/30 bg-primary-container/20">
          <Image
            src="/workspace-logo.png"
            alt={adminCopy.logoAlt}
            width={40}
            height={40}
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </div>
        <div>
          <div className="font-headline-md text-headline-md leading-tight font-bold text-primary">
            {adminCopy.workspaceTitle}
          </div>
          <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {adminCopy.enterpriseId}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {adminNavPrimary.map((item) => {
          const active = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ease-in-out ${
                active
                  ? "border-r-2 border-primary bg-white/5 font-bold text-primary"
                  : "font-medium text-on-surface-variant hover:bg-white/5"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
        {adminNavSecondary.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-on-surface-variant transition-colors duration-200 ease-in-out hover:bg-white/5"
          >
            <Icon name={item.icon} />
            <span className="font-body-sm text-body-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
