import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import {
  workspaceCopy,
  workspaceNavPrimary,
  workspaceNavSecondary,
  type NavItem,
  type WorkspaceNavKey,
} from "@/lib/mock/workspace";

type SideNavProps = {
  activeKey: WorkspaceNavKey;
};

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const base =
    "flex items-center gap-3 rounded-DEFAULT px-3 py-2 font-body-md text-body-md transition-colors duration-200 ease-in-out";
  const activeClass =
    "border-r-2 border-primary bg-white/5 font-bold text-primary";
  const inactiveClass =
    "font-medium text-on-surface-variant hover:bg-white/5";

  return (
    <Link
      href={item.href}
      className={`${base} ${active ? activeClass : inactiveClass}`}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={item.icon} filled={active} />
      {item.label}
    </Link>
  );
}

export function SideNav({ activeKey }: SideNavProps) {
  return (
    <nav className="fixed top-0 left-0 z-40 flex h-screen w-sidebar-width flex-col border-r border-white/10 bg-surface/60 px-4 py-6 shadow-none backdrop-blur-[20px]">
      <div className="mb-10 flex items-center gap-3 px-2">
        <Image
          src="/workspace-logo.png"
          alt={workspaceCopy.logoAlt}
          width={40}
          height={40}
          className="h-10 w-10 rounded-sm border border-outline-variant object-cover"
          priority
        />
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            {workspaceCopy.workspaceTitle}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {workspaceCopy.enterpriseId}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {workspaceNavPrimary.map((item) => (
          <NavLink
            key={item.key}
            item={item}
            active={item.key === activeKey}
          />
        ))}
      </div>

      <div className="mt-auto space-y-1 border-t border-white/10 pt-6">
        {workspaceNavSecondary.map((item) => (
          <NavLink
            key={item.key}
            item={item}
            active={item.key === activeKey}
          />
        ))}
      </div>
    </nav>
  );
}
