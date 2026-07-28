import type { NextFunction, Request, Response } from "express";
import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateQuery } from "../src/middleware/validate.js";

describe("validateQuery middleware", () => {
  it("stores parsed values on req.validated without assigning to req.query", () => {
    const schema = z.object({
      status: z.enum(["VERIFIED"]).optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    });

    let queryAssignAttempted = false;
    const rawQuery = { status: "VERIFIED", page: "1", limit: "10" };

    const req = {
      validated: undefined,
      get query() {
        return rawQuery;
      },
      set query(_value: unknown) {
        queryAssignAttempted = true;
      },
    } as unknown as Request;

    const next = vi.fn() as NextFunction;
    validateQuery(schema)(req, {} as Response, next);

    expect(queryAssignAttempted).toBe(false);
    expect(req.query).toBe(rawQuery);
    expect(req.validated?.query).toEqual({
      status: "VERIFIED",
      page: 1,
      limit: 10,
    });
    expect(next).toHaveBeenCalledOnce();
  });
});
