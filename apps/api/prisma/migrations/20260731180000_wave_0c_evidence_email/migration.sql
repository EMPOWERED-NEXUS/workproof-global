-- Wave 0C: private evidence storage metadata + email verification + durable email outbox
-- Local migration only — do not apply to production from this workspace.

-- Storage / email enums
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'SUPABASE');
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED');
CREATE TYPE "EmailJobType" AS ENUM (
  'EMAIL_VERIFICATION',
  'CUSTOMER_VERIFICATION',
  'CUSTOMER_VERIFICATION_RESEND',
  'DELIVERY_FAILURE_NOTICE'
);

-- User email verification
ALTER TABLE "users" ADD COLUMN "email_verified_at" TIMESTAMP(3);

-- Expand evidence (retain legacy url for migration safety; stop writing storage URLs into it)
ALTER TABLE "evidence"
  ADD COLUMN "storage_provider" "StorageProvider",
  ADD COLUMN "storage_bucket" TEXT,
  ADD COLUMN "storage_key" TEXT,
  ADD COLUMN "external_url" TEXT,
  ADD COLUMN "safe_filename" TEXT,
  ADD COLUMN "checksum_sha256" TEXT,
  ADD COLUMN "uploaded_by_id" UUID,
  ADD COLUMN "uploaded_at" TIMESTAMP(3),
  ADD COLUMN "deleted_at" TIMESTAMP(3),
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Migrate LINK rows to externalUrl; mark file rows as local with key derived from path
UPDATE "evidence"
SET
  "external_url" = "url",
  "storage_provider" = NULL,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "type" = 'LINK';

UPDATE "evidence"
SET
  "storage_provider" = 'LOCAL',
  "storage_key" = CASE
    WHEN "url" LIKE '/uploads/%' THEN substring("url" from 10)
    ELSE "url"
  END,
  "safe_filename" = COALESCE("original_filename", "url"),
  "uploaded_at" = "created_at",
  "updated_at" = CURRENT_TIMESTAMP
WHERE "type" <> 'LINK';

-- Make legacy url nullable (canonical identity is storageKey / externalUrl)
ALTER TABLE "evidence" ALTER COLUMN "url" DROP NOT NULL;

ALTER TABLE "evidence"
  ADD CONSTRAINT "evidence_uploaded_by_id_fkey"
  FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "evidence_storage_key_idx" ON "evidence"("storage_key");
CREATE INDEX "evidence_uploaded_by_id_idx" ON "evidence"("uploaded_by_id");
CREATE INDEX "evidence_deleted_at_idx" ON "evidence"("deleted_at");
-- Partial unique index (non-null storage keys only); not expressible as Prisma @@unique
CREATE UNIQUE INDEX "evidence_storage_key_unique" ON "evidence"("storage_key") WHERE "storage_key" IS NOT NULL;

-- Email verification tokens (hash only)
CREATE TABLE "email_verification_tokens" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "invalidated_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "requested_ip" TEXT,
  CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");
CREATE INDEX "email_verification_tokens_token_hash_idx" ON "email_verification_tokens"("token_hash");
CREATE INDEX "email_verification_tokens_user_id_used_at_idx" ON "email_verification_tokens"("user_id", "used_at");
CREATE INDEX "email_verification_tokens_expires_at_idx" ON "email_verification_tokens"("expires_at");

ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Durable email outbox
CREATE TABLE "email_outbox" (
  "id" UUID NOT NULL,
  "type" "EmailJobType" NOT NULL,
  "recipient_email" TEXT NOT NULL,
  "recipient_name" TEXT,
  "encrypted_payload" TEXT,
  "status" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "max_attempts" INTEGER NOT NULL DEFAULT 8,
  "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "claimed_at" TIMESTAMP(3),
  "sent_at" TIMESTAMP(3),
  "failed_at" TIMESTAMP(3),
  "provider_message_id" TEXT,
  "last_error_code" TEXT,
  "last_error_message_sanitised" TEXT,
  "related_user_id" UUID,
  "related_receipt_id" UUID,
  "related_verification_request_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "email_outbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "email_outbox_status_next_attempt_at_idx" ON "email_outbox"("status", "next_attempt_at");
CREATE INDEX "email_outbox_related_receipt_id_idx" ON "email_outbox"("related_receipt_id");
CREATE INDEX "email_outbox_related_user_id_idx" ON "email_outbox"("related_user_id");
CREATE INDEX "email_outbox_type_status_idx" ON "email_outbox"("type", "status");
