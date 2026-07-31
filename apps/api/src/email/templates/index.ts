import { env } from "../../config/env.js";
import { ctaButton, emailLayout, escapeHtml } from "./layout.js";
import type {
  CustomerVerificationPayload,
  DeliveryFailurePayload,
  EmailVerificationPayload,
} from "../types.js";

export function buildEmailVerificationMessage(payload: EmailVerificationPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const link = `${env.WEB_APP_URL.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(payload.rawToken)}`;
  const { html, textFooter } = emailLayout({
    title: "Verify your WorkProof account",
    preheader: "Confirm your email to submit work for customer verification.",
    bodyHtml: `
      <p>Hello ${escapeHtml(payload.fullName)},</p>
      <p>Verify your email address to unlock receipt submission for customer verification. You can still create drafts and complete your profile meanwhile.</p>
      ${ctaButton("Verify email", link)}
      <p style="font-size:14px;color:#5B6575;">This link expires in ${env.EMAIL_VERIFICATION_EXPIRY_HOURS} hours. If you did not create a WorkProof account, ignore this message.</p>
    `,
  });
  const text = [
    `Hello ${payload.fullName},`,
    "",
    "Verify your WorkProof account email:",
    link,
    "",
    `This link expires in ${env.EMAIL_VERIFICATION_EXPIRY_HOURS} hours.`,
    textFooter,
  ].join("\n");
  return { subject: "Verify your WorkProof account", html, text };
}

export function buildCustomerVerificationMessage(payload: CustomerVerificationPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const link = `${env.WEB_APP_URL.replace(/\/$/, "")}/verify/${encodeURIComponent(payload.rawToken)}`;
  const isResend = payload.kind === "CUSTOMER_VERIFICATION_RESEND";
  const { html, textFooter } = emailLayout({
    title: isResend ? "Reminder: verify completed work" : "Verify completed work",
    preheader: `${payload.workerName} asked you to confirm completed work.`,
    bodyHtml: `
      <p>Hello ${escapeHtml(payload.customerName)},</p>
      <p><strong>${escapeHtml(payload.workerName)}</strong> asked you to confirm completed work:</p>
      <ul>
        <li><strong>Service:</strong> ${escapeHtml(payload.serviceTitle)}</li>
        <li><strong>Work date:</strong> ${escapeHtml(payload.workDate)}</li>
      </ul>
      ${ctaButton("Verify this work", link)}
      <p style="font-size:14px;color:#5B6575;">This verification link expires on ${escapeHtml(new Date(payload.expiresAt).toUTCString())} (attempt ${payload.attemptNumber}).</p>
      <p style="font-size:14px;color:#8B2942;"><strong>Fraud warning:</strong> WorkProof will never ask you to send money, passwords, or payment cards by email. Only confirm work you recognise.</p>
      <p style="font-size:13px;color:#5B6575;">No evidence files are attached to this email.</p>
    `,
  });
  const text = [
    `Hello ${payload.customerName},`,
    "",
    `${payload.workerName} asked you to confirm completed work.`,
    `Service: ${payload.serviceTitle}`,
    `Work date: ${payload.workDate}`,
    "",
    `Verify this work: ${link}`,
    "",
    `Expires: ${new Date(payload.expiresAt).toUTCString()} (attempt ${payload.attemptNumber})`,
    "Fraud warning: WorkProof will never ask you for passwords or payments by email.",
    "No evidence files are attached.",
    textFooter,
  ].join("\n");
  return {
    subject: isResend
      ? `Reminder: verify work — ${payload.serviceTitle}`
      : `Verify completed work — ${payload.serviceTitle}`,
    html,
    text,
  };
}

export function buildDeliveryFailureMessage(payload: DeliveryFailurePayload): {
  subject: string;
  html: string;
  text: string;
} {
  const { html, textFooter } = emailLayout({
    title: "Customer verification email failed",
    preheader: "We could not deliver a customer verification email.",
    bodyHtml: `
      <p>We could not deliver the customer verification email for <strong>${escapeHtml(payload.serviceTitle)}</strong> to ${escapeHtml(payload.customerEmail)} after multiple attempts.</p>
      <p>Please check the customer email address and use Resend verification from the receipt page.</p>
    `,
  });
  const text = [
    `We could not deliver the customer verification email for ${payload.serviceTitle}.`,
    `Recipient: ${payload.customerEmail}`,
    "Please check the address and resend from the receipt page.",
    textFooter,
  ].join("\n");
  return { subject: "Customer verification email failed to send", html, text };
}
