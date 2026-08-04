import type { Prisma } from "../../generated/prisma/index.js";

/**
 * Allocate the next receipt number using a PostgreSQL sequence.
 * Format: WPG-YYYY-000001
 */
export async function allocateReceiptNumber(
  tx: Prisma.TransactionClient,
  year = new Date().getFullYear(),
): Promise<string> {
  const rows = await tx.$queryRaw<Array<{ nextval: bigint | number | string }>>`
    SELECT nextval('receipt_number_seq') AS nextval
  `;
  const raw = rows[0]?.nextval ?? 0;
  const sequence = typeof raw === "bigint" ? Number(raw) : Number(raw);
  return `WPG-${year}-${String(sequence).padStart(6, "0")}`;
}
