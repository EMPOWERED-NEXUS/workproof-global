import { env } from "../../config/env.js";
import { ConsoleEmailProvider } from "./console.provider.js";
import { TransactionalEmailProvider } from "./transactional.provider.js";
import type { EmailProvider } from "../types.js";

let cached: EmailProvider | null = null;
let consoleSingleton: ConsoleEmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cached) return cached;
  if (env.EMAIL_PROVIDER === "transactional") {
    cached = new TransactionalEmailProvider();
  } else {
    consoleSingleton = new ConsoleEmailProvider();
    cached = consoleSingleton;
  }
  return cached;
}

export function getConsoleEmailProviderForTests(): ConsoleEmailProvider | null {
  getEmailProvider();
  return consoleSingleton;
}

export function resetEmailProviderForTests(): void {
  cached = null;
  consoleSingleton = null;
}
