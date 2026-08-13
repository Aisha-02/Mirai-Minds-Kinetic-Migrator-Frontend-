export type FileFormatBadge = {
  label: string;
  icon: string;
};

export type UploadZoneConfig = {
  id: "source" | "target";
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: "secondary" | "primary";
  headerIcon: string;
  headerIconTone: "secondary" | "primary";
  dropTitle: string;
  dropHint: string;
  formats: FileFormatBadge[];
};

export type PipelineStep = {
  id: string;
  label: string;
  detail: string;
  icon: string;
  state: "complete" | "active" | "pending";
};

export type TransformationDoc = {
  id: string;
  label: string;
  icon: string;
};

export const stagingCopy = {
  pageTitle: "Data Staging Center",
  heading: "Upload & Refine",
  description:
    "Stage legacy source data alongside target structures for AI-assisted mapping and validation.",
  processLabel: "Process Data",
  pipelineTitle: "Data Validation Process",
  documentsTitle: "Transformation Documents",
  documentsBadge: "AI Assisted",
} as const;

export const uploadZones: UploadZoneConfig[] = [
  {
    id: "source",
    title: "Preload Files",
    subtitle: "Oracle / Legacy Source",
    badge: "Source",
    badgeTone: "secondary",
    headerIcon: "database",
    headerIconTone: "secondary",
    dropTitle: "Drag & Drop Legacy Extracts",
    dropHint: "or click to browse local files",
    formats: [
      { label: ".csv", icon: "description" },
      { label: ".xlsx", icon: "table" },
    ],
  },
  {
    id: "target",
    title: "Postload Files",
    subtitle: "SAP / Target Schema",
    badge: "Target",
    badgeTone: "primary",
    headerIcon: "account_tree",
    headerIconTone: "primary",
    dropTitle: "Drag & Drop Target Definitions",
    dropHint: "or click to browse local files",
    formats: [
      { label: ".csv", icon: "description" },
      { label: ".xlsx", icon: "table" },
    ],
  },
];

export const pipelineSteps: PipelineStep[] = [
  {
    id: "uploaded",
    label: "Uploaded",
    detail: "2 Files / 1.4GB",
    icon: "check",
    state: "complete",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    detail: "Processing...",
    icon: "mop",
    state: "active",
  },
  {
    id: "validating",
    label: "Validating",
    detail: "Pending",
    icon: "fact_check",
    state: "pending",
  },
];

export const transformationDocs: TransformationDoc[] = [
  { id: "source-rule", label: "Source Rule", icon: "description" },
  { id: "validation-rule", label: "Validation Rule", icon: "verified" },
  { id: "mapping-files", label: "Mapping Files", icon: "account_tree" },
];
