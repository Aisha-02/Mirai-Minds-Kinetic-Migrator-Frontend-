import { apiFetch, parseJson, readApiError } from "@/lib/api/http";

export const RULES_BUSINESS_OBJECTS = [
  "MM",
  "PO",
  "GL Account",
  "BP",
] as const;

export type RulesBusinessObject = (typeof RULES_BUSINESS_OBJECTS)[number];

export type FieldRule = {
  ruleName: string;
  source: "PREDEFINED" | "AI" | string;
  ruleId?: string;
  type?: string;
  description?: string;
  constraint?: string;
  severity?: string;
  category?: string;
};

export type FieldRulesDraft = {
  fieldName: string;
  metadata?: {
    key?: string;
    fieldName?: string;
    dataType?: string;
    length?: string | number;
    defaultValue?: string;
  };
  rules: FieldRule[];
};

export type RulesDraft = {
  businessObject: string;
  fields: FieldRulesDraft[];
};

export type GenerateRulesResponse = {
  businessObject: string;
  sourceFields?: unknown;
  rules: RulesDraft;
  sourceSchemaId?: string | null;
  cached?: boolean;
  persisted: boolean;
  message?: string;
};

export async function fetchRulesBusinessObjects(): Promise<string[]> {
  const response = await apiFetch("/api/rules/business-objects");
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  const data = await parseJson<{ businessObjects: string[] }>(response);
  return data.businessObjects;
}

export async function generateValidationRules(
  businessObject: string,
  file: File | null,
  options?: { sourceSchemaId?: string; force?: boolean },
): Promise<GenerateRulesResponse> {
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
  const response = await apiFetch(`/api/rules/generate${query}`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<GenerateRulesResponse>(response);
}

export async function saveValidationRules(payload: {
  businessObject: string;
  rules: RulesDraft;
}) {
  const response = await apiFetch("/api/rules/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<{ message: string; ruleSet: unknown }>(response);
}

export async function listValidationRules(businessObject?: string) {
  const query = businessObject
    ? `?businessObject=${encodeURIComponent(businessObject)}`
    : "";
  const response = await apiFetch(`/api/rules${query}`);
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<{ rules: unknown[] }>(response);
}
