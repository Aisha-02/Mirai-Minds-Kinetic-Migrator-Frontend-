import { apiFetch, parseJson } from "@/lib/api/http";
import { ComparisonApiError } from "@/lib/api/comparisons";
import { triggerSignedDownload } from "@/lib/api/signedDownload";
import type { SignedDownloadResponse } from "@/lib/api/signedDownload";

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
  columnMapping?: Record<string, string>;
  originalColumns?: string[];
  sapColumns?: string[];
  sapMetadataUsed?: boolean;
};

export type ExecuteCleanupResponse = {
  sessionId: string;
  filename: string;
  rowCount: number;
  columns: string[];
  originalColumns?: string[];
  columnMapping?: Record<string, string>;
  sapMetadataUsed?: boolean;
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
  autoFix?: AutoFixResponse;
};

export type AutoFixResponse = {
  sessionId: string;
  ok: boolean;
  refinedFilename: string;
  columnMapping: Record<string, string>;
  fixesApplied: number;
  fixesSkipped: number;
  appliedFixes: Array<{
    fieldName: string;
    ruleName: string;
    transform?: string;
    affectedCount?: number;
  }>;
  skippedFixes: Array<{
    fieldName: string;
    ruleName: string;
    reason?: string;
  }>;
  sapMetadataUsed: boolean;
  rowCount: number;
  previewRefinedRows: Record<string, unknown>[];
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

export async function triggerAutoFix(sessionId: string): Promise<AutoFixResponse> {
  const response = await apiFetch(`/api/validation/sessions/${sessionId}/auto-fix`, {
    method: "POST",
  });

  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }

  return data as unknown as AutoFixResponse;
}

export async function downloadRefinedFile(
  sessionId: string,
  filename: string,
): Promise<void> {
  const response = await apiFetch(
    `/api/validation/sessions/${sessionId}/download-refined`,
  );

  if (!response.ok) {
    const data = await parseJson<Record<string, unknown>>(response);
    throw new ComparisonApiError(response.status, data);
  }

  const payload = await parseJson<SignedDownloadResponse>(response);
  triggerSignedDownload(payload.signedUrl, payload.filename || filename);
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
