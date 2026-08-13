import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type TextFieldProps = {
  id: string;
  label: string;
  icon: string;
  endAdornment?: ReactNode;
  labelEnd?: ReactNode;
  glowVariant?: "brand" | "primary";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function TextField({
  id,
  label,
  icon,
  endAdornment,
  labelEnd,
  glowVariant = "brand",
  className = "",
  ...inputProps
}: TextFieldProps) {
  const glowClass =
    glowVariant === "primary" ? "glow-input-primary" : "glow-input";

  return (
    <div className="relative flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label
          className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider"
          htmlFor={id}
        >
          {label}
        </label>
        {labelEnd}
      </div>
      <div
        className={`relative flex items-center rounded-DEFAULT border-b border-outline-variant bg-surface-container-high transition-colors duration-200 ${glowClass}`}
      >
        <Icon
          name={icon}
          className="absolute left-3 text-[20px] text-on-surface-variant"
        />
        <input
          id={id}
          className={`w-full border-none bg-transparent py-2.5 pl-10 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0 ${
            endAdornment ? "pr-10" : "pr-3"
          } ${className}`}
          {...inputProps}
        />
        {endAdornment ? (
          <div className="absolute right-3 flex items-center">{endAdornment}</div>
        ) : null}
      </div>
    </div>
  );
}
