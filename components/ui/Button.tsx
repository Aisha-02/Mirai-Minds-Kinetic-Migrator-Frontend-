import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "brand" | "primary";

type ButtonProps = {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  brand:
    "bg-brand-blue text-white shadow-[0_0_10px_rgba(0,143,211,0.2)] hover:bg-opacity-90",
  primary:
    "bg-primary-container text-white shadow-[0_0_10px_rgba(32,152,221,0.2)] hover:bg-primary",
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
