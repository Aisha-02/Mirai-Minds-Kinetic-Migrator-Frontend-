import { apiFetch, parseJson, readApiError } from "@/lib/api/http";
import type { RulesDraft } from "@/lib/api/rules";
import type { SchemaFieldMapping } from "@/lib/api/schemaMapping";

export type SourceSchemaSummary = {
  id: string;
  fileHash: string;
  originalFilename: string;
  sourceFields?: unknown[];
};

export type RegisterSourceSchemaResponse = SourceSchemaSummary & {
  selectedBusinessObject?: string | null;
  message?: string;
};

export type WorkspaceRulesDraft = {
  businessObject: string;
  rules: RulesDraft;
};

export type WorkspaceSchemaMapping = {
  businessObject: string;
  sapBusinessObject: string;
  mappings: SchemaFieldMapping[];
  cached?: boolean;
};

export type AdminWorkspaceResponse = {
  sourceSchema: SourceSchemaSummary | null;
  selectedBusinessObject: string | null;
  rulesDraft: WorkspaceRulesDraft | null;
  schemaMapping: WorkspaceSchemaMapping | null;
};

export async function registerSourceSchema(
  file: File,
  businessObject?: string,
): Promise<RegisterSourceSchemaResponse> {
  const form = new FormData();
  form.append("file", file);
  if (businessObject) {
    form.append("businessObject", businessObject);
  }

  const response = await apiFetch("/api/admin/source-schema", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<RegisterSourceSchemaResponse>(response);
}

export async function fetchAdminWorkspace(): Promise<AdminWorkspaceResponse> {
  const response = await apiFetch("/api/admin/workspace");
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<AdminWorkspaceResponse>(response);
}

export async function updateAdminWorkspaceSelection(payload: {
  sourceSchemaId?: string | null;
  selectedBusinessObject?: string | null;
}): Promise<void> {
  const response = await apiFetch("/api/admin/workspace", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function clearAdminWorkspace(): Promise<void> {
  const response = await apiFetch("/api/admin/workspace", {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}
