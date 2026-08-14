"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RoleSegmentedControl } from "@/components/auth/RoleSegmentedControl";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { registerAccount } from "@/lib/api/auth";
import {
  mockRegisterDefaults,
  registerCopy,
  registerPlaceholders,
  type RegisterFormValues,
} from "@/lib/mock/register";

type RegisterFormProps = {
  initialValues?: RegisterFormValues;
  onSubmit?: (values: RegisterFormValues) => void;
};

export function RegisterForm({
  initialValues = mockRegisterDefaults,
  onSubmit,
}: RegisterFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate(current: RegisterFormValues): string | null {
    if (!current.fullName.trim()) return "Full name is required";
    if (!current.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email.trim())) {
      return "Enter a valid email address";
    }
    if (current.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (current.password !== current.confirmPassword) {
      return "Passwords do not match";
    }
    if (!current.agreeToTerms) {
      return "Please accept the Terms of Service and Privacy Policy";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit?.(values);
    setSubmitting(true);

    try {
      await registerAccount(
        values.email.trim(),
        values.password,
        values.role,
        values.fullName.trim(),
        true,
      );
      setSuccess("Account created. Redirecting to sign in…");
      router.push("/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <TextField
          id="fullName"
          label={registerCopy.fullNameLabel}
          icon="person"
          type="text"
          placeholder={registerPlaceholders.fullName}
          value={values.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          autoComplete="name"
        />

        <TextField
          id="email"
          label={registerCopy.emailLabel}
          icon="mail"
          type="email"
          placeholder={registerPlaceholders.email}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
          autoComplete="email"
        />

        <RoleSegmentedControl
          label={registerCopy.roleLabel}
          value={values.role}
          onChange={(role) => updateField("role", role)}
        />

        <TextField
          id="password"
          label={registerCopy.passwordLabel}
          icon="lock"
          type="password"
          placeholder={registerPlaceholders.password}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
          autoComplete="new-password"
        />

        <TextField
          id="confirmPassword"
          label={registerCopy.confirmPasswordLabel}
          icon="lock"
          type="password"
          placeholder={registerPlaceholders.confirmPassword}
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          required
          autoComplete="new-password"
        />

        <div className="mb-2 mt-1 flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={values.agreeToTerms}
            onChange={(event) =>
              updateField("agreeToTerms", event.target.checked)
            }
            required
            className="h-4 w-4 rounded border-outline-variant bg-surface-container-high text-brand-blue focus:ring-brand-blue focus:ring-offset-background"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {registerCopy.termsAgreeLead}{" "}
            <Link
              href="/legal#terms-of-service"
              className="font-medium text-primary hover:text-primary-fixed"
            >
              {registerCopy.termsOfService}
            </Link>
            {" & "}
            <Link
              href="/legal#privacy-policy"
              className="font-medium text-primary hover:text-primary-fixed"
            >
              {registerCopy.privacyPolicy}
            </Link>
          </p>
        </div>
      </div>

      {error ? (
        <p className="font-body-sm text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="font-body-sm text-body-sm text-status-online" role="status">
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        disabled={submitting || !values.agreeToTerms}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Creating account…" : registerCopy.submitLabel}
      </Button>
    </form>
  );
}
