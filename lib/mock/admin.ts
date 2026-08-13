export type SourceFieldIconTone = "primary" | "tertiary" | "error";

export type BusinessObjectOption = {
  id: string;
  label: string;
};

export const adminCopy = {
  workspaceTitle: "Kinetic Workspace",
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
  addCustomRuleLabel: "Add Custom Rule",
  aiRulesTitle: "AI Recommended Rules",
  customRulesTitle: "Custom Rules",
  allRulesTitle: "Validation Rules",
  assistantTitle: "AI Migration Assistant",
  assistantSubtitle: "Powered by Kinetic Intelligence",
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

/** Fallback when `/api/rules/business-objects` is unavailable */
export const businessObjectOptions: BusinessObjectOption[] = [
  { id: "MM", label: "Material Master (MM)" },
  { id: "PO", label: "Purchase Order (PO)" },
  { id: "GL Account", label: "GL Account" },
  { id: "BP", label: "Business Partner (BP)" },
];
