-- Inclusive multichannel confirmation + evidence visibility (additive, reversible).

CREATE TYPE "ConfirmationMethod" AS ENUM ('EMAIL', 'SHARE_LINK', 'IN_PERSON_QR');
CREATE TYPE "EvidenceVisibility" AS ENUM ('CUSTOMER_ONLY', 'PUBLIC_PROOF');

ALTER TABLE "work_receipts"
  ALTER COLUMN "customer_email" DROP NOT NULL,
  ADD COLUMN "confirmation_method" "ConfirmationMethod" NOT NULL DEFAULT 'EMAIL',
  ADD COLUMN "confirmed_method" "ConfirmationMethod";

ALTER TABLE "verification_requests"
  ALTER COLUMN "customer_email" DROP NOT NULL,
  ADD COLUMN "method" "ConfirmationMethod" NOT NULL DEFAULT 'EMAIL';

ALTER TABLE "confirmations"
  ALTER COLUMN "customer_email" DROP NOT NULL,
  ADD COLUMN "method" "ConfirmationMethod" NOT NULL DEFAULT 'EMAIL';

ALTER TABLE "evidence"
  ADD COLUMN "visibility" "EvidenceVisibility" NOT NULL DEFAULT 'CUSTOMER_ONLY',
  ADD COLUMN "link_platform" TEXT;

-- Existing production rows remain EMAIL / CUSTOMER_ONLY via defaults above.
UPDATE "work_receipts"
SET "confirmation_method" = 'EMAIL'
WHERE "confirmation_method" IS NULL;

UPDATE "verification_requests"
SET "method" = 'EMAIL'
WHERE "method" IS NULL;

UPDATE "confirmations"
SET "method" = 'EMAIL'
WHERE "method" IS NULL;

-- Verified receipts: record the historical confirmation channel as EMAIL.
UPDATE "work_receipts"
SET "confirmed_method" = 'EMAIL'
WHERE "status" = 'VERIFIED'
  AND "confirmed_method" IS NULL;
