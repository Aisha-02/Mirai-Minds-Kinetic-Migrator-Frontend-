import { Icon } from "@/components/ui/Icon";
import { pipelineSteps, stagingCopy } from "@/lib/mock/staging";

export function ValidationPipeline() {
  return (
    <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container p-6 lg:col-span-2">
      <div className="mb-6 flex items-center gap-3 border-b border-outline-variant pb-4">
        <Icon name="route" className="text-primary" />
        <h3 className="font-headline-md text-headline-md text-white">
          {stagingCopy.pipelineTitle}
        </h3>
      </div>

      <div className="flex flex-grow flex-col justify-center py-4">
        <div className="relative mx-auto flex w-full max-w-3xl items-start justify-between">
          <div className="absolute top-5 right-6 left-6 -z-10 h-0.5 bg-outline-variant" />
          <div className="absolute top-5 left-6 -z-10 h-0.5 w-1/2 bg-primary shadow-[0_0_8px_rgba(144,205,255,0.6)]" />

          {pipelineSteps.map((step) => (
            <div
              key={step.id}
              className="flex w-32 flex-col items-center gap-3"
            >
              {step.state === "complete" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_rgba(144,205,255,0.3)]">
                  <Icon name={step.icon} className="text-on-primary" />
                </div>
              ) : null}

              {step.state === "active" ? (
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-surface-container-highest">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <Icon
                    name={step.icon}
                    className="text-[20px] text-primary"
                  />
                </div>
              ) : null}

              {step.state === "pending" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high">
                  <Icon
                    name={step.icon}
                    className="text-[20px] text-on-surface-variant"
                  />
                </div>
              ) : null}

              <div className="text-center">
                <p
                  className={`font-headline-sm text-headline-sm ${
                    step.state === "active" ? "text-primary" : "text-white"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`mt-1 font-mono-data text-mono-data font-bold ${
                    step.state === "active"
                      ? "text-primary"
                      : step.state === "pending"
                        ? "text-on-surface-variant"
                        : "text-on-surface"
                  }`}
                >
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
