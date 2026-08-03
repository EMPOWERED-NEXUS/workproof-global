import { describe, expect, it } from "vitest";
import {
  formatDuration,
  hasAtMostTwoDecimals,
  receiptCreateSchema,
  resolveDurationInput,
} from "@workproof/shared";

describe("flexible work duration", () => {
  it("formats singular and plural labels without minute conversion", () => {
    expect(formatDuration(1, "HOUR")).toBe("1 hour");
    expect(formatDuration(2.5, "HOUR")).toBe("2.5 hours");
    expect(formatDuration(3, "DAY")).toBe("3 days");
    expect(formatDuration(2, "WEEK")).toBe("2 weeks");
    expect(formatDuration(6, "MONTH")).toBe("6 months");
    expect(formatDuration(45, "MINUTE")).toBe("45 minutes");
  });

  it("rejects invalid precision and non-positive values", () => {
    expect(hasAtMostTwoDecimals(2.5)).toBe(true);
    expect(hasAtMostTwoDecimals(2.555)).toBe(false);
    expect(receiptCreateSchema.safeParse({
      customerName: "Ada",
      customerEmail: "ada@example.test",
      serviceTitle: "Fence",
      description: "Built a wooden fence with posts",
      workDate: "2026-08-01",
      durationValue: 2.555,
      durationUnit: "HOUR",
    }).success).toBe(false);
    expect(receiptCreateSchema.safeParse({
      customerName: "Ada",
      customerEmail: "ada@example.test",
      serviceTitle: "Fence",
      description: "Built a wooden fence with posts",
      workDate: "2026-08-01",
      durationValue: 0,
      durationUnit: "HOUR",
    }).success).toBe(false);
  });

  it("accepts hours days weeks months and legacy minutes", () => {
    for (const [durationValue, durationUnit] of [
      [2.5, "HOUR"],
      [3, "DAY"],
      [2, "WEEK"],
      [6, "MONTH"],
    ] as const) {
      const parsed = receiptCreateSchema.safeParse({
        customerName: "Ada",
        customerEmail: "ada@example.test",
        serviceTitle: "Fence",
        description: "Built a wooden fence with posts",
        workDate: "2026-08-01",
        durationValue,
        durationUnit,
      });
      expect(parsed.success).toBe(true);
    }

    const legacy = resolveDurationInput({ durationMinutes: 45 });
    expect(legacy).toEqual({
      durationValue: 45,
      durationUnit: "MINUTE",
      durationMinutes: 45,
    });
  });

  it("keeps legacy minutes column only for minute units", () => {
    expect(resolveDurationInput({ durationValue: 2.5, durationUnit: "HOUR" })).toEqual({
      durationValue: 2.5,
      durationUnit: "HOUR",
      durationMinutes: null,
    });
    expect(resolveDurationInput({ durationValue: 90, durationUnit: "MINUTE" })).toEqual({
      durationValue: 90,
      durationUnit: "MINUTE",
      durationMinutes: 90,
    });
  });
});
