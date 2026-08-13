import { Icon } from "@/components/ui/Icon";
import {
  processingCopy,
  processingSteps,
  type ProcessingStep,
} from "@/lib/mock/processing";

function ProcessingStepNode({ step }: { step: ProcessingStep }) {
  if (step.state === "complete") {
    return (
      <div className="z-10 flex w-32 flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[0_0_25px_rgba(144,205,255,0.4)]">
          <Icon name={step.icon} className="text-3xl text-on-primary" />
        </div>
        <div className="text-center">
          <p className="font-headline-sm text-headline-sm font-bold text-white">
            {step.label}
          </p>
          <p className="mt-1 font-mono-data text-sm font-bold text-on-surface text-mono-data">
            {step.detail}
          </p>
        </div>
      </div>
    );
  }

  if (step.state === "active") {
    return (
      <div className="z-10 flex w-32 flex-col items-center gap-2">
        <div className="animate-pulse-icon relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-blue bg-surface-container-highest shadow-[0_0_0_0_rgba(0,143,211,0.4)]">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
          <Icon name={step.icon} className="text-3xl text-brand-blue" />
        </div>
        <div className="text-center">
          <p className="font-headline-sm text-headline-sm font-bold text-brand-blue">
            {step.label}
          </p>
          <p className="mt-1 font-mono-data text-sm font-bold text-brand-blue text-mono-data">
            {step.detail}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="z-10 flex w-32 flex-col items-center gap-2">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-container-high">
        <div className="absolute inset-0 animate-shimmer-icon bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Icon
          name={step.icon}
          className="text-3xl text-on-surface-variant"
        />
      </div>
      <div className="text-center">
        <p className="font-headline-sm text-headline-sm font-bold text-white">
          {step.label}
        </p>
        <p className="mt-1 font-mono-data text-sm font-bold text-on-surface-variant text-mono-data">
          {step.detail}
        </p>
      </div>
    </div>
  );
}

export function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm sm:p-12">
      <div className="flex w-full max-w-2xl flex-col items-center rounded-2xl border border-outline-variant bg-surface-container p-8 shadow-2xl">
        <h2 className="mb-2 font-headline-md text-headline-md text-white">
          {processingCopy.title}
        </h2>
        <p className="mb-8 animate-pulse text-center font-body-md text-body-md font-bold text-brand-blue">
          {processingCopy.statusPrefix}{" "}
          <span className="ml-2 font-mono-data text-white text-mono-data">
            {processingCopy.progressPercent}
          </span>
        </p>

        <div className="relative mb-4 flex w-full items-start justify-between px-4">
          <div className="absolute top-8 right-16 left-16 -z-10 h-1 rounded-full bg-outline-variant" />
          <div className="animate-slide-progress absolute top-8 left-16 -z-10 h-1 rounded-full bg-brand-blue shadow-[0_0_15px_rgba(0,143,211,0.8)]" />
          {processingSteps.map((step) => (
            <ProcessingStepNode key={step.id} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}
