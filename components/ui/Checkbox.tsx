import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = {
  id: string;
  label: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">;

export function Checkbox({ id, label, className = "", ...inputProps }: CheckboxProps) {
  return (
    <div className="mb-2 mt-1 flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-outline-variant bg-surface-container-high text-brand-blue focus:ring-brand-blue focus:ring-offset-background ${className}`}
        {...inputProps}
      />
      <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
