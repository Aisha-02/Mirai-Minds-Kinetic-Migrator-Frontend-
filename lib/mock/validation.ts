export type ValidationIssue = {
  id: string;
  row: string;
  field: string;
  issue: string;
  rule: string;
  severity: "error" | "warning";
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
  downloadLabel: "Download (.xlsx)",
  totalRecordsLabel: "Total Records",
  totalRecordsValue: "14,205",
  errorsLabel: "Errors Found",
  errorsValue: "12",
  warningsLabel: "Warnings",
  warningsValue: "84",
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
