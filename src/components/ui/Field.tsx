import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  value: number | string;
  unit?: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function NumberField({ label, value, unit, hint, error, onChange, ...props }: NumberFieldProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      <div className="flex items-center gap-2">
        <input
          className="field-input"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {unit ? <span className="w-16 shrink-0 text-xs text-muted">{unit}</span> : null}
      </div>
    </Field>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function SelectField({ label, hint, children, className = "", ...props }: SelectFieldProps) {
  return (
    <Field label={label} hint={hint}>
      <select className={`field-input ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}
