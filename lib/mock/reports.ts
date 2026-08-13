export const reportsCopy = {
  pageTitle: "Reports",
  pageSubtitle: "History of your preload/postload uploads and comparison results",
  emptyTitle: "No history yet",
  emptyBody:
    "When you upload files and run a comparison, those batches will appear here.",
  emptyAction: "Go to Staging",
  loading: "Loading history…",
  filesHeading: "Uploaded files",
  reportHeading: "Comparison report",
  backLabel: "Back to history",
  viewBatch: "View files and report",
  previousPage: "Previous",
  nextPage: "Next",
} as const;

export function formatReportStatus(status: string): string {
  if (status === "completed") return "Completed";
  if (status === "processing") return "Processing";
  if (status === "failed") return "Failed";
  if (status === "pending") return "Uploaded";
  return status;
}
