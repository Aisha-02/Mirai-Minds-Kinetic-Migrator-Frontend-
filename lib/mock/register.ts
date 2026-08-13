export type RegisterRole = "admin" | "normal_user";

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RegisterRole;
  agreeToTerms: boolean;
};

export const registerPlaceholders = {
  fullName: "Jane Doe",
  email: "jane.doe@enterprise.com",
  password: "••••••••",
  confirmPassword: "••••••••",
} as const;

export const registerCopy = {
  title: "Create Account",
  subtitle: "Register to start your migration journey",
  fullNameLabel: "Full Name",
  emailLabel: "Email Address",
  passwordLabel: "Password",
  confirmPasswordLabel: "Confirm Password",
  roleLabel: "Account Role",
  roleAdminLabel: "Admin — rules & configuration",
  roleUserLabel: "Normal User — staging & comparisons",
  termsPrefix: "I accept the Terms and Conditions",
  termsOfService: "Terms of Service",
  privacyPolicy: "Privacy Policy",
  termsHeading: "Terms and Conditions",
  termsDisclaimer:
    "Placeholder / dummy content for UI review only — not legal advice and not a binding agreement. Replace with final legal copy before production.",
  submitLabel: "Create Account",
  footerPrompt: "Already have an account?",
  signInLabel: "Sign In",
  logoAlt: "Kinetic Migrator Logo",
} as const;

/** Mock defaults for local UI only — no API connection. */
export const mockRegisterDefaults: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "normal_user",
  agreeToTerms: false,
};

/** Dummy T&C copy for the registration page — replace before production. */
export const placeholderTermsSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account you acknowledge that you have read this placeholder notice. These sections exist only to demonstrate the registration flow. They do not create a contract, license, or waiver.",
  },
  {
    title: "2. User Responsibilities",
    body: "You are responsible for keeping your credentials confidential and for activity under your account. Do not upload data you are not authorized to process. Use the product only for its intended migration-preview purposes in this environment.",
  },
  {
    title: "3. Data Usage",
    body: "Files and metadata you submit may be stored, processed, and displayed so the application can run validation, mapping, and comparison features. Treat all sample datasets as non-production. Do not upload regulated or live customer data unless your organization has approved it for this tool.",
  },
  {
    title: "4. Limitation of Liability",
    body: "This placeholder states that the software is provided as-is for demonstration. It does not describe real liability caps, indemnities, or warranties. Your organization’s actual legal terms will replace this section.",
  },
  {
    title: "5. Changes to Terms",
    body: "We may replace this dummy text with approved legal copy at any time. Continued use after that replacement will be governed by those real terms, not this placeholder.",
  },
] as const;
