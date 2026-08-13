export type SourceFieldIconTone = "primary" | "tertiary" | "error";

export type SourceFieldRule = {
  id: string;
  name: string;
  dataType: string;
  iconTone: SourceFieldIconTone;
};

export type BusinessObjectOption = {
  id: string;
  label: string;
};

export type ValidationToggle = {
  id: string;
  label: string;
  enabled: boolean;
};

export type AiRecommendedRule = {
  id: string;
  title: string;
  subtitle: string;
};

export const adminCopy = {
  workspaceTitle: "Kinetic Workspace",
  enterpriseId: "Enterprise ID: 8821",
  productName: "Kinetic Migrator",
  pageTitle: "Admin Configuration Hub",
  pageSubtitle:
    "Manage global rule definitions, monitor pipeline telemetry, and configure core source-to-destination mappings for the Kinetic enterprise network.",
  applyRulesLabel: "Apply Global Rules",
  sourceRulesTitle: "Source Data Rules",
  sourceRulesSubtitle: "Define expected data from sources.",
  uploadRulesLabel: "Upload Excel/Word Rules",
  businessObjectTitle: "Business Object",
  businessObjectSubtitle: "Select the primary object for migration.",
  confirmSelectionLabel: "Confirm Selection",
  validationTitle: "Validation Selection",
  validationSubtitle: "Choose which checks are available to users.",
  suggestViaAiLabel: "Suggest via AI",
  aiRulesTitle: "AI Recommended Rules",
  pendingReviewLabel: "3 suggestions pending review",
  assistantTitle: "AI Migration Assistant",
  assistantSubtitle: "Powered by Kinetic Intelligence",
  assistantMessagePrefix: "I've analyzed the",
  assistantMessageObject: "Business Partner",
  assistantMessageSuffix:
    "object and suggest these validation rules based on standard SAP requirements. Would you like to review the logic behind these recommendations?",
  assistantPlaceholder: "Ask Kinetic AI...",
  clearChatLabel: "Clear Chat",
  documentationLabel: "Documentation",
  settingsLabel: "Settings",
  navAdmin: "Admin",
  navAnalysis: "Analysis",
  navHelp: "Help",
  navLogs: "Logs",
  logoAlt: "Kinetic Migrator New Logo",
} as const;

export const adminNavPrimary = [
  { key: "admin" as const, label: adminCopy.navAdmin, icon: "settings", href: "/admin" },
  { key: "analysis" as const, label: adminCopy.navAnalysis, icon: "analytics", href: "/analysis" },
];

export const adminNavSecondary = [
  { key: "help" as const, label: adminCopy.navHelp, icon: "help", href: "#" },
  { key: "logs" as const, label: adminCopy.navLogs, icon: "history", href: "#" },
];

export type AdminNavKey =
  | (typeof adminNavPrimary)[number]["key"]
  | (typeof adminNavSecondary)[number]["key"];

export const adminAssistantSuggestions = [
  { id: "explain", label: "Explain suggestions", icon: "info" },
  { id: "examples", label: "Show example results", icon: "visibility" },
] as const;

export const sourceFieldRules: SourceFieldRule[] = [
  {
    id: "1",
    name: "user_uuid_primary",
    dataType: "STRING(64)",
    iconTone: "primary",
  },
  {
    id: "2",
    name: "transaction_amt_raw",
    dataType: "DECIMAL(10,2)",
    iconTone: "tertiary",
  },
  {
    id: "3",
    name: "created_timestamp",
    dataType: "TIMESTAMP_UTC",
    iconTone: "primary",
  },
  {
    id: "4",
    name: "legacy_meta_blob",
    dataType: "JSON",
    iconTone: "error",
  },
];

/** IDs must match backend `/api/rules` BUSINESS_OBJECTS */
export const businessObjectOptions: BusinessObjectOption[] = [
  { id: "MM", label: "Material Master (MM)" },
  { id: "PO", label: "Purchase Order (PO)" },
  { id: "GL Account", label: "GL Account" },
  { id: "BP", label: "Business Partner (BP)" },
];

export const validationToggles: ValidationToggle[] = [
  { id: "duplicates", label: "Remove Duplicate Records", enabled: true },
  { id: "null-keys", label: "Check Null Keys", enabled: true },
  { id: "trim-spaces", label: "Trim Empty Spaces", enabled: true },
];

export const aiRecommendedRules: AiRecommendedRule[] = [
  {
    id: "phone",
    title: "Phone Format Check",
    subtitle: "Regex-based validation",
  },
  {
    id: "tax",
    title: "Tax ID Validation",
    subtitle: "Checksum verification",
  },
  {
    id: "email",
    title: "Email Consistency",
    subtitle: "Whitelist cross-reference",
  },
];
