import { API_BASE } from "@/lib/api/config";
import { apiFetch, authHeaders, parseJson } from "@/lib/api/http";
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
  rule: {
    ruleName?: string;
    source?: string;
    type?: string;
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
  filename: string | null;
  totalRows: number | null;
  fieldGroups: PlainLanguageFieldGroup[];
};

export type ExecuteCleanupResponse = {
  sessionId?: string;
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
    unmatchedFields: string[];
  };
  findings: ValidationFinding[];
  report: PlainLanguageReport;
};

export type FixDiffSample = {
  row: number;
  field: string;
  before: string | null;
  after: string | null;
};

export type PendingFixProposal = {
  id: string;
  fieldName: string;
  ruleName: string;
  matchedColumn: string;
  transform: { type: string; params?: Record<string, unknown>; label: string };
  explanation: string;
  affectedCount: number;
  affectedRowIndexes: number[];
  diffSample: FixDiffSample[];
  rule?: ValidationFinding["rule"] | null;
};

export type CleanupSessionPublic = {
  id: string;
  filename: string;
  businessObject: string;
  detectorLabel?: string | null;
  detection?: ExecuteCleanupResponse["detection"];
  ruleSetId?: string | null;
  findings: ValidationFinding[];
  report: PlainLanguageReport;
  summary: ExecuteCleanupResponse["summary"];
  pendingProposal: PendingFixProposal | null;
  chatMessages: Array<{
    id: string;
    role: "user" | "assistant" | string;
    content: string;
    at?: string;
    proposalId?: string;
  }>;
  rowCount: number;
  previewRows: Record<string, unknown>[];
  created_at?: string;
  updated_at?: string;
};

export type ExecuteCleanupWithSession = ExecuteCleanupResponse & {
  sessionId: string;
  session: CleanupSessionPublic;
};

export async function executeCleanup(
  file: File,
  options?: { businessObject?: string },
): Promise<ExecuteCleanupWithSession> {
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

  return data as unknown as ExecuteCleanupWithSession;
}

export async function sendCleanupChat(sessionId: string, message: string) {
  const response = await apiFetch(
    `/api/validation/sessions/${sessionId}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    },
  );
  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }
  return data as {
    session: CleanupSessionPublic;
    reply: string;
    pendingProposal: PendingFixProposal | null;
  };
}

export async function confirmCleanupFix(
  sessionId: string,
  proposalId?: string,
) {
  const response = await apiFetch(
    `/api/validation/sessions/${sessionId}/confirm-fix`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    },
  );
  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }
  return data as {
    session: CleanupSessionPublic;
    findings: ValidationFinding[];
    report: PlainLanguageReport;
    summary: ExecuteCleanupResponse["summary"];
    appliedProposal: PendingFixProposal;
  };
}

export async function rejectCleanupFix(sessionId: string) {
  const response = await apiFetch(
    `/api/validation/sessions/${sessionId}/reject-fix`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );
  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }
  return data as { session: CleanupSessionPublic };
}

export async function downloadCorrectedFile(
  sessionId: string,
  filenameHint?: string,
) {
  const response = await fetch(
    `${API_BASE}/api/validation/sessions/${sessionId}/download`,
    {
      headers: authHeaders(),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to download corrected file");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filenameHint
    ? `${filenameHint.replace(/\.[^.]+$/, "")}-corrected.csv`
    : "corrected.csv";
  anchor.click();
  URL.revokeObjectURL(url);
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
