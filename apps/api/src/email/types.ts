export interface SendEmailInput {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  provider: string;
  messageId: string;
}

export interface EmailProvider {
  readonly name: string;
  sendEmail(input: SendEmailInput): Promise<SendEmailResult>;
}

export interface EmailVerificationPayload {
  kind: "EMAIL_VERIFICATION";
  rawToken: string;
  userId: string;
  fullName: string;
}

export interface CustomerVerificationPayload {
  kind: "CUSTOMER_VERIFICATION" | "CUSTOMER_VERIFICATION_RESEND";
  rawToken: string;
  receiptId: string;
  workerName: string;
  serviceTitle: string;
  workDate: string;
  customerName: string;
  expiresAt: string;
  attemptNumber: number;
}

export interface DeliveryFailurePayload {
  kind: "DELIVERY_FAILURE_NOTICE";
  receiptId: string;
  serviceTitle: string;
  customerEmail: string;
}

export interface PasswordResetPayload {
  kind: "PASSWORD_RESET";
  rawToken: string;
  userId: string;
  fullName: string;
  expiresAt: string;
}

export type EmailPayload =
  | EmailVerificationPayload
  | CustomerVerificationPayload
  | DeliveryFailurePayload
  | PasswordResetPayload;
