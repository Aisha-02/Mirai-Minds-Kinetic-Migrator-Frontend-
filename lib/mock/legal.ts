export type LegalDocId =
  | "terms-of-service"
  | "privacy-policy"
  | "gdpr-compliance"
  | "data-security";

export type LegalSection = {
  title: string;
  body: string;
};

export type LegalDocument = {
  id: LegalDocId;
  title: string;
  icon: string;
  sections: LegalSection[];
};

export const legalCopy = {
  logoAlt: "Kinetic Migrator Logo",
  headerTitle: "Kinetic Migrator",
  signInLabel: "Sign In",
  sidebarTitle: "Legal Center",
  lastUpdated: "Last updated Aug 2026",
  pageTitle: "Unified Legal Documentation",
  pageIntro:
    "Placeholder / dummy content for UI review only — not legal advice and not a binding agreement. Replace with final legal copy before production.",
  footerCopyright: "© 2026 Kinetic Migrator Enterprise. All rights reserved.",
  contactLegal: "Contact Legal",
  globalPrivacy: "Global Privacy",
  cookieSettings: "Cookie Settings",
} as const;

export const legalDocuments: LegalDocument[] = [
  {
    id: "terms-of-service",
    title: "Terms of Service",
    icon: "description",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: "By creating an account you acknowledge that you have read this placeholder notice. These sections exist only to demonstrate the registration and legal-center flow. They do not create a contract, license, or waiver.",
      },
      {
        title: "2. User Obligations",
        body: "You are responsible for keeping your credentials confidential and for activity under your account. Do not upload data you are not authorized to process. Use the product only for its intended migration-preview purposes in this environment.",
      },
      {
        title: "3. Acceptable Use",
        body: "Do not attempt to disrupt the service, reverse-engineer protected components, or share access with unauthorized parties. Treat all sample datasets as non-production.",
      },
      {
        title: "4. Limitation of Liability",
        body: "This placeholder states that the software is provided as-is for demonstration. It does not describe real liability caps, indemnities, or warranties. Your organization’s actual legal terms will replace this section.",
      },
      {
        title: "5. Changes to Terms",
        body: "We may replace this dummy text with approved legal copy at any time. Continued use after that replacement will be governed by those real terms, not this placeholder.",
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    icon: "policy",
    sections: [
      {
        title: "1. Data We Process",
        body: "Account details (name, email, role) and files you upload for comparison, validation, and mapping may be stored so the application can run those features. Treat uploads as non-production unless your organization has approved them for this tool.",
      },
      {
        title: "2. Data Processing",
        body: "Uploaded files and generated reports may be processed by application services, including optional AI-assisted analysis. Processing stays within the configured environment for this deployment.",
      },
      {
        title: "3. Retention",
        body: "Records remain available in your workspace until deleted by an authorized user or purged by your administrator’s retention process. This placeholder does not describe a production retention schedule.",
      },
      {
        title: "4. Your Choices",
        body: "You may request account closure or file deletion through your administrator. Cookie and similar preferences can be reviewed from Cookie Settings in the footer.",
      },
    ],
  },
  {
    id: "gdpr-compliance",
    title: "GDPR Compliance",
    icon: "gavel",
    sections: [
      {
        title: "1. Lawful Basis",
        body: "This placeholder assumes processing is necessary to provide the requested migration-preview service to registered users. Replace with your organization’s actual lawful-basis language before production.",
      },
      {
        title: "2. Data Subject Rights",
        body: "Where applicable, users may request access, correction, deletion, or restriction of personal data held in this environment. Submit requests through Contact Legal.",
      },
      {
        title: "3. International Transfers",
        body: "If your deployment stores data outside your region, describe those transfers and safeguards in the production copy. This section is illustrative only.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: "shield",
    sections: [
      {
        title: "1. Access Control",
        body: "Access is gated by authenticated sessions and role (user or admin). Do not share credentials. Administrators should review workspace membership regularly.",
      },
      {
        title: "2. Transmission and Storage",
        body: "Traffic should be served over HTTPS in deployed environments. Files and reports are stored according to the backend configuration for this installation.",
      },
      {
        title: "3. Incident Response",
        body: "Suspected unauthorized access should be reported to your administrator and through Contact Legal. This placeholder does not replace a production incident-response policy.",
      },
    ],
  },
];
