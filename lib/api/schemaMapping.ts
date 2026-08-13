import { apiFetch, parseJson, readApiError } from "@/lib/api/http";

export type SchemaFieldMapping = {
  sourceField: string;
  sapField: string | null;
  confidenceScore: number;
  reasoning: string;
};

export type GenerateSchemaMappingResponse = {
  businessObject: string;
  sapBusinessObject: string;
  mappings: SchemaFieldMapping[];
  sourceFieldCount: number;
  sapFieldCount?: number;
  sapMetadataUsed?: boolean;
  sapMetadataCached?: boolean;
  sourceSchemaId?: string | null;
  cached?: boolean;
  message?: string;
};

export async function generateSchemaMapping(
  businessObject: string,
  file: File | null,
  options?: { sourceSchemaId?: string; force?: boolean },
): Promise<GenerateSchemaMappingResponse> {
  const form = new FormData();
  form.append("businessObject", businessObject);
  if (file) {
    form.append("file", file);
  }
  if (options?.sourceSchemaId) {
    form.append("sourceSchemaId", options.sourceSchemaId);
  }
  if (options?.force) {
    form.append("force", "true");
  }

  const query = options?.force ? "?force=true" : "";
  const response = await apiFetch(`/api/admin/schema-mapping${query}`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<GenerateSchemaMappingResponse>(response);
}

export async function generateSchemaMappingFromFields(
  businessObject: string,
  sourceFields: Array<{
    fieldName: string;
    dataType: string;
    length?: string | number;
    key?: string;
    defaultValue?: string;
  }>,
): Promise<GenerateSchemaMappingResponse> {
  const response = await apiFetch("/api/admin/schema-mapping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessObject, sourceFields }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<GenerateSchemaMappingResponse>(response);
}

export type ConfidenceLevel = "low" | "medium" | "high";

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score < 0.6) return "low";
  if (score <= 0.85) return "medium";
  return "high";
}

export function formatConfidencePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}
