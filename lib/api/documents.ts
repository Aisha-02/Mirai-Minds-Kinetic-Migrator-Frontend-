import { apiFetch, parseJson, readApiError } from "@/lib/api/http";
import { downloadViaSignedUrl } from "@/lib/api/signedDownload";

export type TransformationDocument = {
  id: string;
  label: string;
  category: "source_rule" | "validation_rule" | "mapping_files" | string;
  original_filename: string;
  mime_type?: string | null;
  file_size?: number | null;
  created_at: string;
};

export async function fetchTransformationDocuments(): Promise<
  TransformationDocument[]
> {
  const response = await apiFetch("/api/documents/transformation");
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  const data = await parseJson<{ documents: TransformationDocument[] }>(response);
  return data.documents ?? [];
}

export async function downloadTransformationDocument(
  documentId: string,
): Promise<void> {
  await downloadViaSignedUrl(
    `/api/documents/transformation/${documentId}/download`,
    "document",
  );
}

export async function uploadTransformationDocument(params: {
  file: File;
  label: string;
  category: string;
}): Promise<TransformationDocument> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("label", params.label);
  form.append("category", params.category);

  const response = await apiFetch("/api/documents/transformation", {
    method: "POST",
    body: form,
  });

  const data = await parseJson<{ document?: TransformationDocument; error?: string }>(
    response,
  );
  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }
  if (!data.document) {
    throw new Error("Upload failed");
  }
  return data.document;
}

export async function deleteTransformationDocument(
  documentId: string,
): Promise<void> {
  const response = await apiFetch(
    `/api/documents/transformation/${documentId}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}
