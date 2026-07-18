import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { getDatabaseUrl } from "../config/env.js";
import { PrismaClient } from "../../generated/prisma/index.js";

const pool = new pg.Pool({ connectionString: getDatabaseUrl() });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
