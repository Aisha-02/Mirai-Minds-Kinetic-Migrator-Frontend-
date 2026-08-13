export type ProcessingStepState = "complete" | "active" | "pending";

export type ProcessingStep = {
  id: string;
  label: string;
  detail: string;
  icon: string;
  state: ProcessingStepState;
};

export const processingCopy = {
  title: "Processing Data",
  redirectDelayMs: 2000,
} as const;

export const initialProcessingSteps: ProcessingStep[] = [
  {
    id: "uploaded",
    label: "Uploaded",
    detail: "Files received",
    icon: "check",
    state: "complete",
  },
  {
    id: "comparing",
    label: "Comparing",
    detail: "Running diff…",
    icon: "compare_arrows",
    state: "active",
  },
  {
    id: "reporting",
    label: "AI Report",
    detail: "Pending",
    icon: "auto_awesome",
    state: "pending",
  },
];

export function buildProcessingSteps(
  progressPercent: number,
  fileSummary?: string,
): ProcessingStep[] {
  const progress = Math.min(100, Math.max(0, progressPercent));

  return [
    {
      id: "uploaded",
      label: "Uploaded",
      detail: fileSummary || "Files received",
      icon: "check",
      state: "complete",
    },
    {
      id: "comparing",
      label: "Comparing",
      detail:
        progress < 40
          ? "Analyzing preload vs postload…"
          : progress < 75
            ? "Building diff summary…"
            : "Comparison complete",
      icon: "compare_arrows",
      state: progress < 75 ? "active" : "complete",
    },
    {
      id: "reporting",
      label: "AI Report",
      detail:
        progress < 75
          ? "Waiting…"
          : progress < 100
            ? "Generating narrative…"
            : "Report ready",
      icon: "auto_awesome",
      state:
        progress < 75 ? "pending" : progress < 100 ? "active" : "complete",
    },
  ];
}

export function buildProcessingStatusText(progressPercent: number): string {
  if (progressPercent < 40) return "Comparing preload and postload files…";
  if (progressPercent < 75) return "Calculating differences and metrics…";
  if (progressPercent < 100) return "Generating AI comparison summary…";
  return "Finalizing report…";
}
