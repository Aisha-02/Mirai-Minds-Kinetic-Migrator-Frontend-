export type SignInFormValues = {
  email: string;
  password: string;
};

export const signInPlaceholders = {
  email: "admin@enterprise.com",
  password: "••••••••",
} as const;

export const signInCopy = {
  subtitle: "Sign in to access Data Migration Console",
  emailLabel: "Email",
  passwordLabel: "Password",
  forgotPassword: "Forgot password?",
  submitLabel: "Sign In",
  footerPrompt: "Don't have an account?",
  registerLabel: "Register",
  logoAlt: "Kinetic Migrator Logo",
} as const;

/** Mock defaults for local UI only — no API connection. */
export const mockSignInDefaults: SignInFormValues = {
  email: "",
  password: "",
};
