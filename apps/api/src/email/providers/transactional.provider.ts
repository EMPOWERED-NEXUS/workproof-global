import { env } from "../../config/env.js";
import { AppError } from "../../lib/errors.js";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "../types.js";

/**
 * Neutral HTTP transactional email adapter (Resend-compatible JSON shape).
 * Configured only via API environment variables.
 */
export class TransactionalEmailProvider implements EmailProvider {
  readonly name = "transactional";

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    if (!env.EMAIL_API_URL || !env.EMAIL_API_KEY) {
      throw AppError.badRequest("Transactional email provider is not configured.");
    }

    const response = await fetch(env.EMAIL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo ?? env.EMAIL_REPLY_TO,
      }),
    });

    if (!response.ok) {
      throw new Error(`EMAIL_PROVIDER_${response.status}`);
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return {
      provider: this.name,
      messageId: data.id ?? `txn-${Date.now()}`,
    };
  }
}
