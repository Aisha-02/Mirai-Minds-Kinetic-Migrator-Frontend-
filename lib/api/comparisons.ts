import { apiFetch, parseJson, readApiError } from "@/lib/api/http";

export const COMPARISON_BUSINESS_OBJECTS = [
  "MATERIAL_MASTER",
  "PURCHASE_ORDER",
  "GL_ACCOUNT",
  "BUSINESS_PARTNER",
  "SALES_ORDER",
] as const;

export type ComparisonSummary = {
  missingRecords?: unknown[];
  missingValues?: unknown[];
  valueMismatches?: unknown[];
  duplicateRecords?: unknown[];
  baselineDuplicates?: unknown[];
  extraRecords?: unknown[];
};

export type ComparisonReport = {
  id: string;
  batch_id: string;
  status: "processing" | "completed" | "failed" | string;
  summary_json: ComparisonSummary | null;
  ai_report_text: string | null;
  error_message: string | null;
  created_at?: string;
  completed_at?: string | null;
};

export type UploadResponse = {
  batch_id: string;
  file_type: "preload" | "postload";
  upload: {
    id: string;
    original_filename: string;
    row_count: number;
    uploaded_at: string;
  };
  business_object?: string;
  identifier_columns?: string[];
  schema_warnings?: unknown[];
  detection?: {
    source?: string;
    confidence?: string;
    reasoning?: string;
  };
};

export type NeedsBusinessObjectError = {
  needs_business_object: true;
  error: string;
  message?: string;
  candidates?: string[];
  detection?: unknown;
};

export class ComparisonApiError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>) {
    super(
      String(body.error || body.message || `Request failed (${status})`),
    );
    this.name = "ComparisonApiError";
    this.status = status;
    this.body = body;
  }
}

async function postUpload(
  path: string,
  file: File,
  extraFields?: Record<string, string>,
): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  if (extraFields) {
    for (const [key, value] of Object.entries(extraFields)) {
      form.append(key, value);
    }
  }

  const response = await apiFetch(path, {
    method: "POST",
    body: form,
  });

  const data = await parseJson<Record<string, unknown>>(response);

  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }

  return data as unknown as UploadResponse;
}

export async function uploadPreload(
  file: File,
  options?: { businessObject?: string },
): Promise<UploadResponse> {
  const fields: Record<string, string> = {};
  if (options?.businessObject) {
    fields.businessObject = options.businessObject;
  }
  return postUpload("/api/comparisons/upload-preload", file, fields);
}

export async function uploadPostload(
  file: File,
  batchId: string,
): Promise<UploadResponse> {
  return postUpload("/api/comparisons/upload-postload", file, {
    batch_id: batchId,
  });
}

export async function runComparison(batchId: string): Promise<{
  report: ComparisonReport;
  provider?: string;
  model_id?: string;
}> {
  const response = await apiFetch(`/api/comparisons/${batchId}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const data = await parseJson<Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ComparisonApiError(response.status, data);
  }

  return data as {
    report: ComparisonReport;
    provider?: string;
    model_id?: string;
  };
}

export async function fetchComparisonReport(
  batchId: string,
): Promise<ComparisonReport> {
  const response = await apiFetch(`/api/comparisons/${batchId}/report`);
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  const data = await parseJson<{ report: ComparisonReport }>(response);
  return data.report;
}

export async function downloadComparisonPdf(batchId: string): Promise<Blob> {
  const response = await apiFetch(
    `/api/comparisons/${batchId}/report/download`,
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return response.blob();
}

export type BatchUploadFileSummary = {
  id: string;
  file_type: "preload" | "postload" | string;
  original_filename: string;
  uploaded_at: string;
  row_count: number;
};

export type BatchUploadFileData = BatchUploadFileSummary & {
  columns: string[];
  rows: Record<string, unknown>[];
};

export async function fetchBatchFiles(
  batchId: string,
): Promise<{ batch_id: string; files: BatchUploadFileSummary[] }> {
  const response = await apiFetch(`/api/comparisons/${batchId}/files`);
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson(response);
}

export async function fetchBatchFileData(
  batchId: string,
  uploadId: string,
): Promise<{ batch_id: string; file: BatchUploadFileData }> {
  const response = await apiFetch(
    `/api/comparisons/${batchId}/files/${uploadId}`,
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson(response);
}

export function isNeedsBusinessObject(
  err: unknown,
): err is ComparisonApiError & { body: NeedsBusinessObjectError } {
  return (
    err instanceof ComparisonApiError &&
    Boolean((err.body as NeedsBusinessObjectError).needs_business_object)
  );
}
