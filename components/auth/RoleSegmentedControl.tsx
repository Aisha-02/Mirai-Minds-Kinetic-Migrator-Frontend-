import type { RegisterRole } from "@/lib/mock/register";

type RoleSegmentedControlProps = {
  value: RegisterRole;
  onChange: (role: RegisterRole) => void;
  label: string;
};

const OPTIONS: { value: RegisterRole; label: string }[] = [
  { value: "normal_user", label: "User" },
  { value: "admin", label: "Admin" },
];

export function RoleSegmentedControl({
  value,
  onChange,
  label,
}: RoleSegmentedControlProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
        {label}
      </legend>
      <div
        className="grid grid-cols-2 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high p-0.5"
        role="radiogroup"
        aria-label={label}
      >
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-md py-1.5 text-center font-body-sm text-body-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                selected
                  ? "bg-primary text-on-primary shadow-primary"
                  : "text-on-surface-variant hover:bg-ink/5 hover:text-on-surface"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
