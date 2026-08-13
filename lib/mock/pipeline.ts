export type PipelineSeverity = "critical" | "high" | "medium" | "low";
export type PipelineIssueStatus =
  | "pending"
  | "investigating"
  | "resolved"
  | "ignored";

export type PipelineIssue = {
  id: string;
  severity: PipelineSeverity;
  category: string;
  description: string;
  affectedRecords: string;
  status: PipelineIssueStatus;
};

export type PipelineMetric = {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone: "error" | "tertiary" | "primary" | "health";
  footer:
    | { kind: "trend"; direction: "up" | "down"; text: string }
    | { kind: "progress"; percentWidth: string; label: string }
    | { kind: "health"; status: string; target: string; score: number };
};

export const pipelineCopy = {
  pageTitle: "Comparison Report",
  analysisPrefix: "Analysis complete for",
  analysisProcessing: "Comparison running for",
  analysisFailed: "Comparison failed for",
  batchId: "—",
  downloadPdfLabel: "Download PDF",
  downloadXlsLabel: "Download as XLS",
  downloadWordLabel: "Download as Word",
  issuesTitle: "Structured findings",
  filterAllLabel: "All Categories",
  filterCriticalLabel: "Critical Only",
  paginationLabel: "Showing findings from this comparison",
} as const;

export const pipelineMetrics: PipelineMetric[] = [
  {
    id: "errors",
    label: "Total Errors",
    value: "4,291",
    icon: "error",
    tone: "error",
    footer: { kind: "trend", direction: "up", text: "+12% vs previous run" },
  },
  {
    id: "lost",
    label: "Lost Data Records",
    value: "842",
    icon: "warning",
    tone: "tertiary",
    footer: { kind: "progress", percentWidth: "15%", label: "0.05%" },
  },
  {
    id: "schema",
    label: "Schema Mismatches",
    value: "156",
    icon: "schema",
    tone: "primary",
    footer: { kind: "trend", direction: "down", text: "-4% vs previous run" },
  },
  {
    id: "health",
    label: "Overall Health",
    value: "88",
    icon: "health_and_safety",
    tone: "health",
    footer: { kind: "health", status: "Stable", target: "Target: 99.9%", score: 88 },
  },
];

export const pipelineIssues: PipelineIssue[] = [
  {
    id: "1",
    severity: "critical",
    category: "Data Truncation",
    description:
      "String length exceeds target VARCHAR(255) in 'CustomerAddress' table.",
    affectedRecords: "3,102",
    status: "pending",
  },
  {
    id: "2",
    severity: "high",
    category: "Referential Integrity",
    description:
      "Missing Foreign Key constraints on 'OrderLineItem' resolving to 'ProductID'.",
    affectedRecords: "842",
    status: "investigating",
  },
  {
    id: "3",
    severity: "high",
    category: "Type Conversion",
    description:
      "Failed cast from DATETIME2 to DATE in legacy 'InvoiceRecords' schema.",
    affectedRecords: "189",
    status: "pending",
  },
  {
    id: "4",
    severity: "medium",
    category: "Encoding Error",
    description:
      "Non-UTF8 characters detected in 'UserNotes' column. Defaulting to replacement char.",
    affectedRecords: "1,105",
    status: "resolved",
  },
  {
    id: "5",
    severity: "low",
    category: "Null Constraint",
    description:
      "Target column 'MiddleName' marked NOT NULL but source data contains nulls.",
    affectedRecords: "53",
    status: "ignored",
  },
];

export const pipelineSeverityStyles: Record<
  PipelineSeverity,
  { label: string; className: string }
> = {
  critical: {
    label: "CRITICAL",
    className:
      "border-error bg-surface-container-highest text-error",
  },
  high: {
    label: "HIGH",
    className:
      "border-tertiary-container bg-surface-container-highest text-tertiary-container",
  },
  medium: {
    label: "MEDIUM",
    className: "border-primary bg-surface-container-highest text-primary",
  },
  low: {
    label: "LOW",
    className:
      "border-outline-variant bg-surface-container-highest text-on-surface",
  },
};
