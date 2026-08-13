export type ValidationIssue = {
  id: string;
  row: string;
  field: string;
  issue: string;
  rule: string;
  severity: "error" | "warning";
};

export type SuggestionChip = {
  id: string;
  label: string;
  icon: string;
};

export const validationCopy = {
  pageTitle: "Data Cleaning Results",
  pageSubtitle:
    "Upload raw legacy data for cleaning according to validation rules.",
  sourceTitle: "Source Data",
  dropTitle: "Drag & Drop Raw Preload File",
  dropHint: "Supports .csv, .xlsx, .json (Max 500MB)",
  browseLabel: "Browse Files",
  rulesetTitle: "Active Ruleset",
  rulesetStatus: "Active (Admin Configured)",
  ruleId: "RuleID: VR-992-HR_MASTER",
  ruleChecks: "14 checks configured",
  executeLabel: "Execute Cleaning",
  reportTitle: "Cleaning Report",
  reportMeta: "Generated just now • HR_Master_Preload_v2.csv",
  suggestViaAiLabel: "Suggest via AI",
  downloadLabel: "Download (.xlsx)",
  totalRecordsLabel: "Total Records",
  totalRecordsValue: "14,205",
  errorsLabel: "Errors Found",
  errorsValue: "12",
  warningsLabel: "Warnings",
  warningsValue: "84",
  assistantTitle: "AI Migration Assistant",
  assistantSubtitle: "Powered by Kinetic Intelligence",
  assistantPlaceholder: "Ask Kinetic AI...",
  assistantMessagePrefix:
    "I've analyzed the cleaning results against the rule sheet for",
  assistantMessageRule: "VR-992-HR_MASTER",
  assistantMessageSuffix:
    "Would you like me to explain the issues found or suggest automated fixes for the 12 errors?",
} as const;

export const validationIssues: ValidationIssue[] = [
  {
    id: "1",
    row: "1042",
    field: "Department_ID",
    issue: "Invalid format",
    rule: "Format_AlphaNum_3",
    severity: "error",
  },
  {
    id: "2",
    row: "2891",
    field: "Hire_Date",
    issue: "Future date detected",
    rule: "Logic_PastDateOnly",
    severity: "error",
  },
  {
    id: "3",
    row: "4012",
    field: "Manager_ID",
    issue: "ID not in hierarchy",
    rule: "Ref_Check_Hierarchy (Soft)",
    severity: "warning",
  },
];

export const validationSuggestions: SuggestionChip[] = [
  { id: "explain", label: "Explain error codes", icon: "info" },
  { id: "fixes", label: "Suggest data fixes", icon: "build" },
  { id: "summarize", label: "Summarize rule violations", icon: "summarize" },
];
