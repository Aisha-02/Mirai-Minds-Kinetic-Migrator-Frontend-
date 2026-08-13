import { apiFetch, parseJson } from "@/lib/api/http";
import { ComparisonApiError } from "@/lib/api/comparisons";

export type ValidationFinding = {
  fieldName: string;
  matchedColumn?: string;
  ruleName: string;
  ruleViolated: string;
  severity: "error" | "warning" | string;
  affectedCount: number;
  affectedRows: number[];
  sampleValues?: Array<{ row: number; value: string | null; reason?: string }>;
  issue: string;
  summary?: string;
  rule: {
    ruleName?: string;
    source?: string;
    description?: string;
    constraint?: string;
    severity?: string;
    category?: string;
  };
};

export type PlainLanguageFinding = {
  ruleName: string;
  severity: "error" | "warning" | string;
  affectedCount: number;
  affectedRowsSample: number[];
  affectedRowsLabel: string;
  summary: string;
  whatToCorrect: string;
  rule: ValidationFinding["rule"] | null;
};

export type PlainLanguageFieldGroup = {
  fieldName: string;
  errorCount: number;
  warningCount: number;
  findingCount: number;
  findings: PlainLanguageFinding[];
};

export type PlainLanguageReport = {
  headline: string;
  businessObject: string | null;
  filename?: string | null;
  totalRows?: number | null;
  fieldGroups: PlainLanguageFieldGroup[];
};

export type ExecuteCleanupResponse = {
  filename: string;
  rowCount: number;
  columns: string[];
  detection: {
    source?: string;
    businessObject?: string;
    confidence?: string;
    reasoning?: string;
    modelId?: string;
  };
  rulesBusinessObject: string;
  ruleSet: {
    id: string;
    business_object: string;
    created_at: string;
  };
  summary: {
    totalRows: number;
    fieldsChecked: number;
    rulesChecked: number;
    violationCount: number;
    errorCount: number;
    warningCount: number;
  };
  findings: ValidationFinding[];
  report: PlainLanguageReport;
  previewRows: Record<string, unknown>[];
  evaluator?: string;
};

export async function executeCleanup(
  file: File,
  options?: { businessObject?: string },
): Promise<ExecuteCleanupResponse> {
  const form = new FormData();
  form.append("file", file);
  if (options?.businessObject) {
    form.append("businessObject", options.businessObject);
  }

  const response = await apiFetch("/api/validation/execute-cleanup", {
    method: "POST",
    body: form,
  });

  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }

  return data as unknown as ExecuteCleanupResponse;
}

export function isNeedsBusinessObjectCleanup(err: unknown): boolean {
  return (
    err instanceof ComparisonApiError &&
    Boolean(err.body.needs_business_object)
  );
}

export async function safeCleanupErrorMessage(err: unknown): Promise<string> {
  if (err instanceof ComparisonApiError) {
    return String(err.body.error || err.message);
  }
  if (err instanceof Error) return err.message;
  return "Cleanup failed";
}
