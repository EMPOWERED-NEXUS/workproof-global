import { z } from "zod";

export const DURATION_UNITS = ["MINUTE", "HOUR", "DAY", "WEEK", "MONTH"] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

const UNIT_LABELS: Record<DurationUnit, [singular: string, plural: string]> = {
  MINUTE: ["minute", "minutes"],
  HOUR: ["hour", "hours"],
  DAY: ["day", "days"],
  WEEK: ["week", "weeks"],
  MONTH: ["month", "months"],
};

/** Positive finite number with at most two decimal places. */
export function hasAtMostTwoDecimals(value: number): boolean {
  if (!Number.isFinite(value)) return false;
  return Math.abs(Math.round(value * 100) - value * 100) < 1e-8;
}

export const durationValueSchema = z
  .number()
  .positive("Duration must be greater than zero.")
  .max(999_999, "Duration is too large.")
  .refine(hasAtMostTwoDecimals, { message: "Duration may have at most two decimal places." });

export const durationUnitSchema = z.enum(DURATION_UNITS);

export function formatDuration(value: number, unit: DurationUnit): string {
  const rounded = Math.round(value * 100) / 100;
  const display = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  const [singular, plural] = UNIT_LABELS[unit];
  const label = rounded === 1 ? singular : plural;
  return `${display} ${label}`;
}

/**
 * Resolve create/update duration fields.
 * Prefers durationValue+durationUnit; accepts legacy durationMinutes.
 */
export function resolveDurationInput(input: {
  durationValue?: number | null;
  durationUnit?: DurationUnit | null;
  durationMinutes?: number | null;
}): { durationValue: number | null; durationUnit: DurationUnit | null; durationMinutes: number | null } {
  const hasValue = input.durationValue != null;
  const hasUnit = input.durationUnit != null;
  if (hasValue !== hasUnit) {
    throw new Error("Duration value and unit must be provided together.");
  }
  if (hasValue && hasUnit) {
    const durationValue = input.durationValue as number;
    const durationUnit = input.durationUnit as DurationUnit;
    return {
      durationValue,
      durationUnit,
      // Keep legacy minutes column only when the unit is minutes.
      durationMinutes: durationUnit === "MINUTE" ? Math.round(durationValue) : null,
    };
  }
  if (input.durationMinutes != null) {
    return {
      durationValue: input.durationMinutes,
      durationUnit: "MINUTE",
      durationMinutes: input.durationMinutes,
    };
  }
  return { durationValue: null, durationUnit: null, durationMinutes: null };
}
