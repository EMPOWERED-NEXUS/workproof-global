-- CreateEnum
CREATE TYPE "ReceiptEventActorType" AS ENUM ('WORKER', 'CUSTOMER', 'ADMIN', 'SYSTEM');

-- AlterTable WorkReceipt
ALTER TABLE "work_receipts" ADD COLUMN "integrity_version" INTEGER;
ALTER TABLE "work_receipts" ADD COLUMN "archived_at" TIMESTAMP(3);
ALTER TABLE "work_receipts" ADD COLUMN "revoked_at" TIMESTAMP(3);
ALTER TABLE "work_receipts" ADD COLUMN "revoked_by_id" UUID;
ALTER TABLE "work_receipts" ADD COLUMN "revocation_reason" TEXT;

-- Migrate legacy ARCHIVED status rows to archivedAt + restored lifecycle status
UPDATE "work_receipts"
SET
  "archived_at" = COALESCE("archived_at", "updated_at"),
  "status" = CASE
    WHEN "verification_code" IS NOT NULL THEN 'VERIFIED'::"ReceiptStatus"
    WHEN "submitted_at" IS NOT NULL THEN 'PENDING_VERIFICATION'::"ReceiptStatus"
    ELSE 'DRAFT'::"ReceiptStatus"
  END
WHERE "status" = 'ARCHIVED';

-- CreateIndex
CREATE INDEX "work_receipts_archived_at_idx" ON "work_receipts"("archived_at");

-- AddForeignKey
ALTER TABLE "work_receipts" ADD CONSTRAINT "work_receipts_revoked_by_id_fkey" FOREIGN KEY ("revoked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- VerificationRequest: drop one-per-receipt uniqueness, add attempt fields
ALTER TABLE "verification_requests" DROP CONSTRAINT IF EXISTS "verification_requests_receipt_id_key";
DROP INDEX IF EXISTS "verification_requests_receipt_id_key";
ALTER TABLE "verification_requests" ADD COLUMN IF NOT EXISTS "attempt_number" INTEGER;
ALTER TABLE "verification_requests" ADD COLUMN "claimed_at" TIMESTAMP(3);
ALTER TABLE "verification_requests" ADD COLUMN "invalidated_at" TIMESTAMP(3);
ALTER TABLE "verification_requests" ADD COLUMN "result" "ConfirmationDecision";

UPDATE "verification_requests" SET "attempt_number" = 1 WHERE "attempt_number" IS NULL;
ALTER TABLE "verification_requests" ALTER COLUMN "attempt_number" SET NOT NULL;

CREATE INDEX "verification_requests_receipt_id_attempt_number_idx" ON "verification_requests"("receipt_id", "attempt_number");
CREATE INDEX "verification_requests_receipt_id_created_at_idx" ON "verification_requests"("receipt_id", "created_at");
CREATE INDEX "verification_requests_expires_at_idx" ON "verification_requests"("expires_at");

-- Confirmation: one-to-many
ALTER TABLE "confirmations" DROP CONSTRAINT IF EXISTS "confirmations_receipt_id_key";
DROP INDEX IF EXISTS "confirmations_receipt_id_key";
ALTER TABLE "confirmations" ADD COLUMN IF NOT EXISTS "verification_request_id" UUID;
ALTER TABLE "confirmations" ADD COLUMN IF NOT EXISTS "attempt_number" INTEGER;

UPDATE "confirmations" SET "attempt_number" = 1 WHERE "attempt_number" IS NULL;
ALTER TABLE "confirmations" ALTER COLUMN "attempt_number" SET NOT NULL;

CREATE INDEX "confirmations_receipt_id_confirmed_at_idx" ON "confirmations"("receipt_id", "confirmed_at");
CREATE INDEX "confirmations_receipt_id_attempt_number_idx" ON "confirmations"("receipt_id", "attempt_number");

ALTER TABLE "confirmations" ADD CONSTRAINT "confirmations_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "verification_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Dispute resolver
ALTER TABLE "disputes" ADD COLUMN "resolved_by_id" UUID;
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ReceiptEvent
CREATE TABLE "receipt_events" (
    "id" UUID NOT NULL,
    "receipt_id" UUID NOT NULL,
    "actor_id" UUID,
    "actor_type" "ReceiptEventActorType" NOT NULL,
    "event_type" TEXT NOT NULL,
    "from_status" "ReceiptStatus",
    "to_status" "ReceiptStatus",
    "public_summary" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "receipt_events_receipt_id_created_at_idx" ON "receipt_events"("receipt_id", "created_at");
CREATE INDEX "receipt_events_event_type_idx" ON "receipt_events"("event_type");

ALTER TABLE "receipt_events" ADD CONSTRAINT "receipt_events_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "work_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "receipt_events" ADD CONSTRAINT "receipt_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Database-safe receipt number sequence (readable WPG-YYYY-######)
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq;
