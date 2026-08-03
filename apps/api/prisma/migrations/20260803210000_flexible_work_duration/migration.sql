-- Flexible work duration: value + unit, with safe backfill from duration_minutes.

CREATE TYPE "DurationUnit" AS ENUM ('MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH');

ALTER TABLE "work_receipts"
  ADD COLUMN "duration_value" DECIMAL(10,2),
  ADD COLUMN "duration_unit" "DurationUnit";

-- Backfill existing minute-based durations without destroying data.
UPDATE "work_receipts"
SET
  "duration_value" = "duration_minutes"::decimal,
  "duration_unit" = 'MINUTE'
WHERE "duration_minutes" IS NOT NULL
  AND "duration_value" IS NULL;
