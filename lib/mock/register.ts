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
  roleLabel: "Role",
  roleAdminLabel: "Admin",
  roleUserLabel: "User",
  termsPrefix: "I agree to the",
  termsOfService: "Terms of Service",
  privacyPolicy: "Privacy Policy",
  termsHref: "/legal#terms-of-service",
  privacyHref: "/legal#privacy-policy",
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
