import { ACTIVE_BATCH_KEY } from "@/lib/api/config";

export type ActiveBatchSession = {
  batchId: string;
  businessObject?: string;
  identifierColumns?: string[];
};

export function storeActiveBatch(session: ActiveBatchSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ACTIVE_BATCH_KEY, JSON.stringify(session));
}

export function getActiveBatch(): ActiveBatchSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ACTIVE_BATCH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActiveBatchSession;
  } catch {
    return null;
  }
}

export function clearActiveBatch() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACTIVE_BATCH_KEY);
}
