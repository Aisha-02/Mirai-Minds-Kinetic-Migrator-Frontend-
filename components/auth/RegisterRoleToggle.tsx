"use client";

import { registerCopy, type RegisterRole } from "@/lib/mock/register";

type RegisterRoleToggleProps = {
  value: RegisterRole;
  onChange: (role: RegisterRole) => void;
};

const OPTIONS: Array<{ value: RegisterRole; label: string }> = [
  { value: "normal_user", label: registerCopy.roleUserLabel },
  { value: "admin", label: registerCopy.roleAdminLabel },
];

export function RegisterRoleToggle({ value, onChange }: RegisterRoleToggleProps) {
  return (
    <div className="relative flex flex-col gap-1">
      <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
        {registerCopy.roleLabel}
      </p>
      <div className="flex gap-2 rounded-DEFAULT border-b border-outline-variant bg-surface-container-high p-1">
        {OPTIONS.map((option) => (
          <label key={option.value} className="flex-1">
            <input
              type="radio"
              name="role"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <div className="cursor-pointer rounded-DEFAULT py-2 text-center font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant transition-colors duration-200 peer-checked:bg-brand-blue peer-checked:text-white">
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
