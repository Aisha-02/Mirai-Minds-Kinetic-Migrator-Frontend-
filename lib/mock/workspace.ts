export type NavItem = {
  label: string;
  icon: string;
  href: string;
  key: "upload" | "display" | "validate" | "reports" | "help" | "logs";
};

export const workspaceCopy = {
  workspaceTitle: "Kinetic Workspace",
  enterpriseId: "Enterprise ID: 8821",
  productName: "Kinetic Migrator",
  logoAlt: "Kinetic Migrator New Logo",
  avatarAlt: "User avatar",
} as const;

export const workspaceNavPrimary: NavItem[] = [
  { key: "upload", label: "Upload", icon: "upload_file", href: "/staging" },
  { key: "display", label: "Display", icon: "visibility", href: "/preview" },
  { key: "validate", label: "Validate", icon: "rule", href: "/validation" },
  { key: "reports", label: "Reports", icon: "assessment", href: "/reports" },
];

export const workspaceNavSecondary: NavItem[] = [
  { key: "help", label: "Help", icon: "help", href: "#" },
  { key: "logs", label: "Logs", icon: "history", href: "#" },
];

export type WorkspaceNavKey = NavItem["key"];
