-- Prisma created UNIQUE INDEX (not table CONSTRAINT) for @unique fields.
-- Drop leftover one-to-one indexes so verification/confirmation history is 1:N.
DROP INDEX IF EXISTS "verification_requests_receipt_id_key";
DROP INDEX IF EXISTS "confirmations_receipt_id_key";
