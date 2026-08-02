# WorkProof Global — UX Finalization Audit

**Branch:** `release-v1-ux-finalization`  
**Date:** 2026-07-31  
**Scope:** Public web + API pilot readiness (not public mobile store release)

---

## 1. Route inventory (web)

| Path | Auth | Purpose |
|------|------|---------|
| `/` | Public | Landing — worker CTAs, how verification works |
| `/login` | Public | Cookie session sign-in |
| `/register` | Public | Worker registration + Terms/Privacy acceptance |
| `/forgot-password` | Public | Password reset request |
| `/reset-password` | Public | Password reset with token |
| `/verify-email` | Public | Account email verification |
| `/verify/:token` | Public | Customer verification respond flow |
| `/proof/:verificationCode` | Public | Portable proof page (+ QR when valid) |
| `/workers/:profileSlug` | Public | Public worker profile |
| `/privacy` `/terms` `/evidence-policy` `/dispute-policy` `/support` | Public | Legal / support (EmpowerEd Nexus Ltd) |
| `/dashboard` | Authenticated | Role-aware home (worker onboarding checklist) |
| `/receipts` `/receipts/new` `/receipts/:id` | WORKER | Receipt portfolio, create, detail lifecycle |
| `/profile` | WORKER | Public profile editing |
| `/organisation` | ORGANISATION | Invitation-based programme overview |
| `/admin` | ADMIN | Users, receipts, disputes + confirm dialogs |
| `*` | Public | 404 |

Organisation and Admin accounts are **not** created via public registration.

---

## 2. API actions available (high level)

| Area | Endpoints (under `/api/v1`) |
|------|-----------------------------|
| Auth / sessions | register, login, refresh, logout, logout-all, me, sessions list/revoke |
| Password | forgot-password, reset-password |
| Email verify | email-verification-status, resend-email-verification, verify-email |
| Profile | GET/PATCH profile; public GET workers/:slug |
| Receipts | CRUD-ish create/list/get/patch/delete; submit; resend-verification; verification-delivery; archive/unarchive; events |
| Evidence | POST file/link, authorized download, DELETE |
| Customer verify | GET verification/:token; POST respond |
| Public proof | GET public/receipts/:code |
| Dashboards | worker; organisation (scoped) |
| Admin | users list + status; receipts list + revoke; disputes list + resolve |

---

## 3. Unfinished / deferred features

| Item | Status |
|------|--------|
| PDF export of proof | Not implemented |
| Organisation members / invites / worker assignment UI | API shell + invitation posture only |
| Self-serve account deletion | Support email request only |
| Web consuming `@workproof/shared` | Web still duplicates types |
| Offline / PWA | Not in scope for pilot |
| Antivirus/malware scanning on uploads | Recommended ops control; not in-app yet |
| Mobile worker parity | Internal Expo preview shell — not a public download product |
| AWS staging cutover | Next ops milestone after local Wave 0 readiness |

---

## 4. Accessibility / responsive / legal risks

| Risk | Notes |
|------|-------|
| Legal copy | Pilot-oriented; pages state local legal review before unrestricted commercial launch |
| Consent | Registration requires Terms + Privacy checkboxes; API enforces acceptance |
| Responsive nav | Dedicated mobile menu (`aria-expanded`) ≤860px |
| Focus / dialogs | Confirm dialogs use `role="dialog"`, Escape, restore focus; busy disables actions |
| Contrast / SR | Improved labels and live regions; full a11y audit still recommended pre-scale |
| Public proof states | Invalid/revoked/disputed must never read as valid (UI banners + `proofValidity`) |

---

## 5. Actions completed this wave (UX finalization)

- Landing CTA clarity: “Create your work profile” / “How verification works” (no public “Verify a receipt” CTA)
- Registration consent + invitation-only organisation messaging
- Worker onboarding checklist on dashboard
- Receipts filter/search/sort toolbar
- Receipt detail: edit drafts, file/link evidence, events, archive, resend verification, confirm dialogs
- Admin Suspend / Revoke / Resolve with confirmation dialogs and busy-disabled controls
- Legal pages with EmpowerEd Nexus Ltd + `support@empowerednexus.com`
- Public proof QR for valid proofs; copy/share helpers
- Playwright E2E suite for public + mocked authenticated paths (`apps/web/e2e`)

---

## 6. Launch posture

| Surface | Posture |
|---------|---------|
| **Web + API** | Launch target for controlled pilot after staging deploy + smoke |
| **Mobile** | Internal preview shell only — no public store / download claims |
| **Organisations** | Invitation / admin-provisioned — not public self-registration |
