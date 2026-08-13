import { apiFetch, parseJson, readApiError } from "@/lib/api/http";

export type SignedDownloadResponse = {
  signedUrl: string;
  filename: string;
  expiresIn: number;
};

export function triggerSignedDownload(signedUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = signedUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.target = "_blank";
  anchor.click();
}

export async function fetchSignedDownload(
  path: string,
): Promise<SignedDownloadResponse> {
  const response = await apiFetch(path);
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
  return parseJson<SignedDownloadResponse>(response);
}

export async function downloadViaSignedUrl(path: string, fallbackFilename: string) {
  const payload = await fetchSignedDownload(path);
  triggerSignedDownload(payload.signedUrl, payload.filename || fallbackFilename);
}
