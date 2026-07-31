import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "../types.js";

/** Local/test provider — never prints raw tokens. */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";
  readonly sent: Array<{ to: string; subject: string; messageId: string }> = [];

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    const messageId = `console-${randomUUID()}`;
    this.sent.push({ to: input.to, subject: input.subject, messageId });
    if (env.NODE_ENV !== "test") {
      const redactedText = input.text.replace(/[a-f0-9]{48,}/gi, "[REDACTED_TOKEN]");
      console.info("[email:console]", {
        to: input.to,
        subject: input.subject,
        messageId,
        preview: redactedText.slice(0, 160),
      });
    }
    return { provider: this.name, messageId };
  }
}
