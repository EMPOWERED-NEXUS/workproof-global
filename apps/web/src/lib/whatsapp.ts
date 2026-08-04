import {
  buildShareConfirmationMessage,
  buildWhatsAppShareUrl,
  e164PhoneSchema,
} from '@workproof/shared';

export function validateLocalWhatsAppPhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = e164PhoneSchema.safeParse(trimmed);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid phone number.');
  }
  return parsed.data;
}

export function openWhatsAppShare(params: {
  customerName: string;
  workerName: string;
  confirmationUrl: string;
  phoneE164?: string | null;
}): string {
  const message = buildShareConfirmationMessage({
    customerName: params.customerName,
    workerName: params.workerName,
    confirmationUrl: params.confirmationUrl,
  });
  const url = buildWhatsAppShareUrl({
    phoneE164: params.phoneE164,
    message,
  });
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}
