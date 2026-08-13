export const mappingCopy = {
  pageTitle: "AI Analysis & Mapping Hub",
  confidenceTitle: "Mapping Confidence Score",
  confidenceValue: "98.4%",
  confidenceDelta: "0.2%",
  progressTitle: "Migration Progress",
  progressPhase: "Phase 2: Data Transformation",
  progressEta: "Estimating 45 minutes remaining",
  recordsLabel: "Records Processed",
  recordsValue: "1,204,550 / 2,500,000",
  progressPercent: "48%",
  tableTitle: "Field Mapping Analysis",
  tableSubtitle: "Legacy data to SAP S/4HANA mappings.",
  searchPlaceholder: "Search fields...",
  filterLabel: "Filter",
  analyzeLabel: "Analyze",
  colSource: "Source Field (Oracle)",
  colTarget: "Target Field (SAP)",
  colDataType: "Data Type",
  colConfidence: "AI Confidence",
  assistantTitle: "AI Migration Assistant",
  assistantSubtitle: "Powered by Kinetic Intelligence",
  assistantTimestamp: "Today, 10:42 AM",
  kineticAiLabel: "KINETIC AI",
  assistantPlaceholder: "Ask Kinetic AI...",
  userQuestion:
    "Why is the ITEM_NUMBER to MATNR mapping flagged?",
  userFollowUp: "Apply TR-042 to all MATNR mappings in this batch.",
  assistantOracleField: "ITEM_NUMBER",
  assistantOracleType: "VARCHAR(50)",
  assistantSapField: "MATNR",
  assistantSapType: "CHAR(18)",
  assistantRecommendation:
    "Recommendation: Truncation risk detected. Apply transformation rule [TR-042] to zero-pad or truncate safely before migration.",
} as const;

export const mappingConfidenceWidth = "98.4%";
export const mappingProgressPercent = 48;

export type MappingConfidenceTone = "primary" | "tertiary" | "primary-container";

export type FieldMappingRow = {
  id: string;
  sourceField: string;
  sourceHint?: string;
  targetField: string;
  targetHint?: string;
  targetTone: "primary" | "tertiary";
  dataType: string;
  confidence: number;
  confidenceTone: MappingConfidenceTone;
  warning?: boolean;
  warningHint?: string;
};

export const fieldMappingRows: FieldMappingRow[] = [
  {
    id: "customer-id",
    sourceField: "CUSTOMER_ID",
    sourceHint: "Primary Key",
    targetField: "KUNNR",
    targetHint: "Customer Number",
    targetTone: "primary",
    dataType: "VARCHAR(30) → CHAR(10)",
    confidence: 98,
    confidenceTone: "primary",
  },
  {
    id: "item-number",
    sourceField: "ITEM_NUMBER",
    sourceHint: "Inventory Item",
    targetField: "MATNR",
    targetTone: "tertiary",
    dataType: "VARCHAR(50) → CHAR(18)",
    confidence: 65,
    confidenceTone: "tertiary",
    warning: true,
    warningHint: "Length mismatch detected",
  },
  {
    id: "creation-date",
    sourceField: "CREATION_DATE",
    targetField: "ERDAT",
    targetTone: "primary",
    dataType: "DATE → DATS(8)",
    confidence: 82,
    confidenceTone: "primary-container",
  },
  {
    id: "unit-price",
    sourceField: "UNIT_PRICE",
    targetField: "NETPR",
    targetTone: "primary",
    dataType: "NUMBER(15,2) → CURR(11,2)",
    confidence: 95,
    confidenceTone: "primary",
  },
];
