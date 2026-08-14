import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "brand" | "primary";

type ButtonProps = {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  brand:
    "bg-brand-blue text-white shadow-primary hover:bg-primary-fixed hover:shadow-card-hover",
  primary:
    "bg-primary-container text-on-primary-container shadow-primary hover:bg-primary-fixed hover:shadow-card-hover",
};

export function Button({
  children,
  fullWidth = false,
  variant = "brand",
  className = "",
  type = "button",
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 rounded-DEFAULT py-3 font-headline-sm text-headline-sm font-semibold transition-colors duration-200 ${
        variantClasses[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
