import type { ValidationIssue } from "@/types";

export function parseNumber(raw: string, field: string): { value: number; error?: string } {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { value: Number.NaN, error: `${field} is required.` };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { value: Number.NaN, error: `${field} must be a valid number.` };
  }
  return { value };
}

export function requirePositive(value: number, field: string): string | null {
  if (!Number.isFinite(value)) return `${field} must be a valid number.`;
  if (value <= 0) return `${field} must be greater than zero.`;
  return null;
}

export function requireNonNegative(value: number, field: string): string | null {
  if (!Number.isFinite(value)) return `${field} must be a valid number.`;
  if (value < 0) return `${field} cannot be negative.`;
  return null;
}

export function requireRange(
  value: number,
  field: string,
  min: number,
  max: number,
): string | null {
  if (!Number.isFinite(value)) return `${field} must be a valid number.`;
  if (value < min || value > max) {
    return `${field} must be between ${min} and ${max}.`;
  }
  return null;
}

export function collectIssues(candidates: Array<string | null>): ValidationIssue[] {
  return candidates
    .filter((message): message is string => Boolean(message))
    .map((message) => ({ field: "form", message }));
}

export function firstError(issues: Array<string | null>): string | null {
  return issues.find((item): item is string => Boolean(item)) ?? null;
}
