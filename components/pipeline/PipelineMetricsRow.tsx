"use client";

import { Icon } from "@/components/ui/Icon";
import type { PipelineMetric } from "@/lib/mock/pipeline";

function MetricIcon({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <span
      className={`rounded-md border border-outline-variant bg-surface-container-highest p-1.5 ${className}`}
    >
      <Icon name={name} className="text-[18px]" />
    </span>
  );
}

function HealthGauge({ score }: { score: number }) {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
        <path
          className="text-surface-container-highest"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="stroke-current text-primary"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeDasharray={`${score}, 100`}
          strokeWidth="4"
        />
      </svg>
      <span className="absolute font-headline-sm text-headline-sm font-bold text-white">
        {score}
        <span className="text-[10px]">%</span>
      </span>
    </div>
  );
}

function MetricCard({ metric }: { metric: PipelineMetric }) {
  if (metric.footer.kind === "health") {
    return (
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-4 transition-colors hover:bg-surface-container-high">
        <div className="relative z-10 mb-1 flex items-start justify-between">
          <h3 className="font-label-caps text-label-caps uppercase text-on-surface">
            {metric.label}
          </h3>
          <MetricIcon name={metric.icon} className="text-primary-fixed" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <HealthGauge score={metric.footer.score} />
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm text-on-surface">
              Status:{" "}
              <span className="font-bold text-primary">
                {metric.footer.status}
              </span>
            </span>
            <span className="mt-0.5 font-mono-data text-mono-data text-on-surface">
              {metric.footer.target}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const valueClass =
    metric.tone === "error"
      ? "text-error"
      : metric.tone === "tertiary"
        ? "text-tertiary"
        : "text-primary";

  const iconClass =
    metric.tone === "error"
      ? "text-error"
      : metric.tone === "tertiary"
        ? "text-tertiary"
        : "text-primary";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-4 transition-colors hover:bg-surface-container-high">
      <div className="relative z-10 mb-2 flex items-start justify-between gap-2">
        <h3 className="font-label-caps text-label-caps uppercase text-on-surface">
          {metric.label}
        </h3>
        <MetricIcon name={metric.icon} className={iconClass} />
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <span
          className={`font-headline-md text-headline-md font-bold ${valueClass}`}
        >
          {metric.value}
        </span>
      </div>
      {metric.footer.kind === "trend" ? (
        <div
          className={`relative z-10 mt-2 flex items-center gap-1.5 font-body-sm text-body-sm ${
            metric.footer.direction === "up" ? "text-error" : "text-primary"
          }`}
        >
          <Icon
            name={
              metric.footer.direction === "up" ? "trending_up" : "trending_down"
            }
            className="text-[14px]"
          />
          <span>{metric.footer.text}</span>
        </div>
      ) : (
        <div className="relative z-10 mt-2 flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
          <span className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <span
              className="block h-full bg-tertiary"
              style={{ width: metric.footer.percentWidth }}
            />
          </span>
          <span className="shrink-0 font-mono-data text-mono-data text-white">
            {metric.footer.label}
          </span>
        </div>
      )}
    </div>
  );
}

type PipelineMetricsRowProps = {
  metrics: PipelineMetric[];
};

export function PipelineMetricsRow({ metrics }: PipelineMetricsRowProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
