import { ADMIN_WORKSPACE_KEY } from "@/lib/api/config";

export type AdminWorkspacePointer = {
  sourceSchemaId: string | null;
  selectedBusinessObject: string | null;
};

export function buildWorkspaceSourceKey(
  fileHash: string | null | undefined,
  businessObject: string,
): string | null {
  if (!fileHash || !businessObject) return null;
  return `${fileHash}:${businessObject}`;
}

export function storeAdminWorkspacePointer(pointer: AdminWorkspacePointer) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_WORKSPACE_KEY, JSON.stringify(pointer));
}

export function getAdminWorkspacePointer(): AdminWorkspacePointer | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ADMIN_WORKSPACE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminWorkspacePointer;
  } catch {
    return null;
  }
}

export function clearAdminWorkspaceSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_WORKSPACE_KEY);
}
