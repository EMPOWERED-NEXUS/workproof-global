# Evidence policy

Supporting evidence and customer confirmation are different.

- **Customer confirmation** turns a receipt into customer-confirmed portable proof.
- **Evidence** (photos, documents, TikTok/social links, websites) supports the claim but never independently verifies a receipt.

## Visibility

| Value | Who can see it |
|---|---|
| `CUSTOMER_ONLY` (default) | Worker/admin, and the customer while using a valid confirmation token |
| `PUBLIC_PROOF` | Also shown on the public proof page after verification |

Existing and new evidence defaults to `CUSTOMER_ONLY`. Making evidence public requires an explicit opt-in per item.

## Social and web links

- HTTPS only
- Credentials, `javascript:`, `data:`, `file:`, `blob:`, and control characters are rejected
- Platform labels (TikTok, Instagram, Facebook, YouTube, X, LinkedIn, Other website) are inferred from the hostname
- WorkProof stores the normalized HTTPS URL
- WorkProof never fetches, scrapes, or embeds social-media content
- External links open in a new tab with `rel="noopener noreferrer"`

## Disclosure

Public proof and customer confirmation pages disclose:

> Supporting evidence was supplied with this receipt. Evidence supports the work record but does not replace customer confirmation.
