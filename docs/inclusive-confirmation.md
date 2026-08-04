# Inclusive multichannel receipt confirmation

WorkProof supports three customer confirmation channels. Evidence is never a substitute for confirmation.

## Channels

| Method | Customer email | Lifetime | Worker tools |
|---|---|---|---|
| `EMAIL` | Required | `VERIFICATION_TOKEN_EXPIRY_HOURS` (default 72h) | Existing outbox email |
| `SHARE_LINK` | Not required | `SHARE_LINK_TOKEN_EXPIRY_HOURS` (default 72h) | Copy link, Open WhatsApp |
| `IN_PERSON_QR` | Not required | `IN_PERSON_QR_TOKEN_EXPIRY_MINUTES` (default 10m) | Short-lived QR, open on device |

Email is not limited to Gmail. Any working email address is accepted.

## Assurance labels on public proof

- EMAIL → “Customer confirmed through an email link”
- SHARE_LINK → “Customer confirmed through a secure share link”
- IN_PERSON_QR → “Customer confirmed in person”

For SHARE_LINK and IN_PERSON_QR, public proof also states that WorkProof records the confirmation action but does not independently verify ownership of the customer’s phone or messaging account.

Do not describe a manually shared link as verified WhatsApp identity or verified phone ownership.

## WhatsApp behaviour

- Opening WhatsApp is an explicit browser action by the worker
- The API never calls WhatsApp servers
- Optional phone numbers are validated as E.164 in the browser only
- Phone numbers are not submitted to or stored by WorkProof
- Universal link format: `https://wa.me/<digits>?text=<url-encoded-message>`

## Tokens

- Cryptographically random
- Only SHA-256 hashes are stored
- One-time use, explicit expiry, regeneration revokes unused prior tokens
- Concurrent confirmation is claim-safe
- Raw tokens are not logged

## Customer account

Customers do not need a WorkProof account for any channel.

## Future phase (out of scope here)

Optional WhatsApp Business OTP verification may be added later as a separate higher-assurance channel. It is not part of this release.

## Production migration notes

Migration: `20260803220000_inclusive_confirmation`

1. Deploy API that understands nullable `customer_email` and new enums.
2. Apply the additive migration (defaults existing rows to `EMAIL` / `CUSTOMER_ONLY`).
3. Deploy web with `VITE_PUBLIC_WEB_URL` set.
4. Rollback: stop writing new methods; columns/enums are additive and safe to leave in place.
