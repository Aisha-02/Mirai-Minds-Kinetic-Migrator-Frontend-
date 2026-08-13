"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import {
  homePathForRole,
  loginAccount,
  storeAuthSession,
} from "@/lib/api/auth";
import {
  mockSignInDefaults,
  signInCopy,
  signInPlaceholders,
  type SignInFormValues,
} from "@/lib/mock/signin";

type SignInFormProps = {
  initialValues?: SignInFormValues;
  onSubmit?: (values: SignInFormValues) => void;
};

export function SignInForm({
  initialValues = mockSignInDefaults,
  onSubmit,
}: SignInFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SignInFormValues>(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof SignInFormValues>(
    key: K,
    value: SignInFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!values.email.trim() || !values.password) {
      setError("Email and password are required");
      return;
    }

    onSubmit?.(values);
    setSubmitting(true);

    try {
      const { token, user } = await loginAccount(
        values.email.trim(),
        values.password,
      );
      storeAuthSession(token, user);
      setSuccess("Signed in successfully");
      router.push(homePathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <TextField
          id="email"
          label={signInCopy.emailLabel}
          icon="mail"
          type="email"
          placeholder={signInPlaceholders.email}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
          autoComplete="email"
          glowVariant="primary"
        />

        <TextField
          id="password"
          label={signInCopy.passwordLabel}
          icon="lock"
          type={showPassword ? "text" : "password"}
          placeholder={signInPlaceholders.password}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
          autoComplete="current-password"
          glowVariant="primary"
          labelEnd={
            <span className="font-body-sm text-body-sm text-primary">
              {signInCopy.forgotPassword}
            </span>
          }
          endAdornment={
            <button
              type="button"
              className="text-on-surface-variant transition-colors hover:text-on-surface"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                className="text-[20px]"
              />
            </button>
          }
        />
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
        variant="primary"
        className="mt-2"
        disabled={submitting}
      >
        {submitting ? "Signing in…" : signInCopy.submitLabel}
        <Icon name="arrow_forward" className="text-[20px]" />
      </Button>
    </form>
  );
}
