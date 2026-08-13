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
  source: "PREDEFINED" | "AI" | "CUSTOM" | string;
  ruleId?: string;
  type?: string;
  description?: string;
  constraint?: string;
  severity?: string;
  category?: string;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
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

export type CustomValidationRulePayload = {
  businessObject: string;
  ruleSetId?: string;
  fieldName: string;
  ruleName: string;
  constraint: string;
  description: string;
  type?: string;
  severity?: string;
  category?: string;
};

export type CustomRuleApiResponse = {
  message: string;
  rule: FieldRule;
  ruleSet?: { id?: string; rules?: RulesDraft };
};

export async function createCustomValidationRule(
  payload: CustomValidationRulePayload,
) {
  const response = await apiFetch("/api/admin/validation-rules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<CustomRuleApiResponse>(response);
}

export async function updateCustomValidationRule(
  ruleId: string,
  payload: Partial<CustomValidationRulePayload>,
) {
  const response = await apiFetch(
    `/api/admin/validation-rules/${encodeURIComponent(ruleId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<CustomRuleApiResponse>(response);
}

export async function deleteCustomValidationRule(
  ruleId: string,
  options?: { businessObject?: string; ruleSetId?: string },
) {
  const params = new URLSearchParams();
  if (options?.businessObject) {
    params.set("businessObject", options.businessObject);
  }
  if (options?.ruleSetId) {
    params.set("ruleSetId", options.ruleSetId);
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await apiFetch(
    `/api/admin/validation-rules/${encodeURIComponent(ruleId)}${query}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<{ message: string; deletedRuleId: string }>(response);
}

export function isCustomRule(rule: FieldRule) {
  return String(rule.source || "").toUpperCase() === "CUSTOM";
}

export function isAiRule(rule: FieldRule) {
  return String(rule.source || "").toUpperCase() === "AI";
}

export function upsertRuleInDraft(
  draft: RulesDraft | null,
  businessObject: string,
  fieldName: string,
  rule: FieldRule,
): RulesDraft {
  const next: RulesDraft = draft
    ? {
        businessObject: draft.businessObject || businessObject,
        fields: draft.fields.map((field) => ({
          ...field,
          rules: [...(field.rules || [])],
        })),
      }
    : { businessObject, fields: [] };

  const fieldKey = fieldName.trim().toUpperCase();
  let field = next.fields.find(
    (entry) => entry.fieldName.trim().toUpperCase() === fieldKey,
  );
  if (!field) {
    field = { fieldName, rules: [] };
    next.fields = [...next.fields, field];
  }

  const ruleId = String(rule.ruleId || "");
  const existingIndex = field.rules.findIndex(
    (entry) => ruleId && String(entry.ruleId || "") === ruleId,
  );
  if (existingIndex >= 0) {
    field.rules[existingIndex] = { ...field.rules[existingIndex], ...rule };
  } else {
    field.rules.push(rule);
  }

  return { ...next, fields: [...next.fields] };
}

export function removeRuleFromDraft(
  draft: RulesDraft | null,
  ruleId: string,
): RulesDraft | null {
  if (!draft) return draft;
  return {
    ...draft,
    fields: draft.fields.map((field) => ({
      ...field,
      rules: (field.rules || []).filter(
        (rule) => String(rule.ruleId || "") !== ruleId,
      ),
    })),
  };
}

