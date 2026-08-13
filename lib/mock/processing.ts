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
  statusPrefix: "Refining 1.4GB of legacy data...",
  progressPercent: "64%",
  redirectDelayMs: 2000,
} as const;

export const processingSteps: ProcessingStep[] = [
  {
    id: "uploaded",
    label: "Uploaded",
    detail: "2 Files / 1.4GB",
    icon: "check",
    state: "complete",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    detail: "Processing...",
    icon: "mop",
    state: "active",
  },
  {
    id: "validating",
    label: "Validating",
    detail: "Pending",
    icon: "fact_check",
    state: "pending",
  },
];
