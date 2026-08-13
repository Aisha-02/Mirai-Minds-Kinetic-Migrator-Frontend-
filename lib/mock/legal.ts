export type LegalNavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export type LegalSubsection = {
  heading: string;
  body: string;
};

export type LegalSection = {
  id: string;
  title: string;
  intro: string[];
  subsections: LegalSubsection[];
};

export const legalCopy = {
  productName: "Kinetic Migrator",
  signInLabel: "Sign In",
  sideTitle: "Legal Center",
  lastUpdated: "Last updated Oct 2023",
  pageTitle: "Unified Legal Documentation",
  copyright: "© 2024 Kinetic Migrator Enterprise. All rights reserved.",
} as const;

export const legalFooterLinks = [
  { label: "Contact Legal", href: "#" },
  { label: "Global Privacy", href: "#" },
  { label: "Cookie Settings", href: "#" },
] as const;

export const legalNavItems: LegalNavItem[] = [
  {
    id: "terms-of-service",
    label: "Terms of Service",
    icon: "gavel",
    href: "/legal#terms-of-service",
  },
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    icon: "policy",
    href: "/legal#privacy-policy",
  },
  {
    id: "gdpr-compliance",
    label: "GDPR Compliance",
    icon: "verified_user",
    href: "/legal#gdpr-compliance",
  },
  {
    id: "data-security",
    label: "Data Security",
    icon: "shield",
    href: "/legal#data-security",
  },
];

export const legalSections: LegalSection[] = [
  {
    id: "terms-of-service",
    title: "Terms of Service",
    intro: [
      'These Terms of Service ("Terms") govern your access to and use of the Kinetic Migrator Enterprise services, including our various websites, SMS, APIs, email notifications, applications, buttons, and widgets (the "Services").',
    ],
    subsections: [
      {
        heading: "1. User Obligations",
        body: "By accessing or using the Services, you agree to be bound by these Terms. You are responsible for your use of the Services, for any content you post to the Services, and for any consequences thereof. You must use the Services in compliance with all applicable local, state, national, and international laws, rules and regulations.",
      },
      {
        heading: "2. Data Processing",
        body: "The processing of any personal data by Kinetic Migrator is governed by our Privacy Policy and, where applicable, our Data Processing Agreement. You retain all rights and ownership of your data. We process your data solely for the purpose of providing the Services as configured by your administrative users.",
      },
      {
        heading: "3. Intellectual Property",
        body: "All right, title, and interest in and to the Services (excluding Content provided by users) are and will remain the exclusive property of Kinetic Migrator and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.",
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    intro: [
      "This Privacy Policy describes how and when Kinetic Migrator collects, uses, and shares your information when you use our Services.",
    ],
    subsections: [
      {
        heading: "1. Data Collection",
        body: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.",
      },
      {
        heading: "2. Usage of Data",
        body: "We use the information we collect about you to provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.",
      },
    ],
  },
  {
    id: "gdpr-compliance",
    title: "GDPR Compliance",
    intro: [
      "If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Kinetic Migrator aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.",
      "In certain circumstances, you have the following data protection rights: The right to access, update or to delete the information we have on you. The right of rectification. The right to object. The right of restriction. The right to data portability. The right to withdraw consent.",
    ],
    subsections: [],
  },
  {
    id: "data-security",
    title: "Data Security",
    intro: [
      "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
      "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These include end-to-end encryption for data in transit and at rest using AES-256 standards.",
    ],
    subsections: [],
  },
];

export const DEFAULT_LEGAL_SECTION_ID = legalNavItems[0].id;
