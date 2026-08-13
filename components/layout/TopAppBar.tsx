import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { workspaceCopy } from "@/lib/mock/workspace";

type TopAppBarProps = {
  variant?:
    | "staging"
    | "preview"
    | "validation"
    | "reports"
    | "admin"
    | "analysis";
  pageTitle?: string;
  assistantOpen?: boolean;
};

export function TopAppBar({
  variant = "staging",
  pageTitle,
  assistantOpen = false,
}: TopAppBarProps) {
  const isPreview = variant === "preview";
  const isValidation = variant === "validation";
  const isReports = variant === "reports";
  const isAdmin = variant === "admin";
  const isAnalysis = variant === "analysis";

  if (isAdmin) {
    return (
      <header
        className={`fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px] transition-[right] duration-300 md:left-sidebar-width ${
          assistantOpen ? "xl:right-assistant-panel-width" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-headline-md font-black tracking-tight text-primary">
            {workspaceCopy.productName}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="group relative cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full border border-surface bg-error transition-colors group-hover:border-primary" />
          </button>
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  if (isAnalysis) {
    return (
      <header
        className={`fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px] transition-[right] duration-300 md:left-sidebar-width ${
          assistantOpen ? "xl:right-assistant-panel-width" : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="font-headline-md text-headline-md font-black text-primary">
            {workspaceCopy.productName}
          </span>
          <div className="mx-2 hidden h-6 w-px bg-white/10 sm:block" />
          <span className="hidden truncate font-headline-sm text-headline-sm text-on-surface sm:inline">
            {pageTitle ?? "AI Analysis & Mapping Hub"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  if (isReports) {
    return (
      <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-8 shadow-sm md:left-sidebar-width">
        <div className="flex flex-1 items-center gap-8">
          <Image
            src="/workspace-logo.png"
            alt={workspaceCopy.logoAlt}
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="cursor-pointer text-on-surface transition-all hover:text-white"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="mr-4 cursor-pointer text-on-surface transition-all hover:text-white"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  if (isValidation) {
    return (
      <header
        className={`fixed top-0 right-0 left-sidebar-width z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px] transition-[right] duration-300 ${
          assistantOpen ? "xl:right-assistant-panel-width" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md font-black text-primary">
            {workspaceCopy.productName}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      className={
        isPreview
          ? "fixed top-0 right-0 left-sidebar-width z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px]"
          : "fixed top-0 right-0 left-0 z-30 hidden h-16 items-center justify-between border-b border-outline-variant bg-surface px-8 shadow-sm md:left-sidebar-width md:flex"
      }
    >
      <div className="flex items-center gap-4">
        <span
          className={
            isPreview
              ? "font-headline-md text-headline-md font-black tracking-tight text-primary"
              : "font-headline-md text-headline-md font-black text-white"
          }
        >
          {workspaceCopy.productName}
        </span>
        {!isPreview && pageTitle ? (
          <>
            <div className="mx-2 h-6 w-px bg-outline-variant" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {pageTitle}
            </h2>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className={
            isPreview
              ? "cursor-pointer text-on-surface-variant transition-all hover:text-primary"
              : "cursor-pointer text-on-surface-variant transition-all hover:text-white"
          }
          aria-label="Notifications"
        >
          <Icon name="notifications" />
        </button>
        <button
          type="button"
          className={
            isPreview
              ? "cursor-pointer text-on-surface-variant transition-all hover:text-primary"
              : "cursor-pointer text-on-surface-variant transition-all hover:text-white"
          }
          aria-label="Settings"
        >
          <Icon name="settings" />
        </button>
      </div>
    </header>
  );
}
