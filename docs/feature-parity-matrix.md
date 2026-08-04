# WorkProof Global — Feature Parity Matrix

**Branch:** `release-v1-ux-finalization`  
**Date:** 2026-07-31  

Legend: **Done** · **Partial** · **API only** · **Missing** · **N/A**

---

## 1. Web feature matrix

| Feature | Status | Evidence / notes |
|---------|--------|------------------|
| Landing | Done | Worker CTAs; how verification works (no public verify CTA) |
| Registration | Done | Worker-only + Terms/Privacy acceptance |
| Login | Done | Cookie session via `credentials: 'include'` |
| Forgot password | Done | `/forgot-password` + API outbox email |
| Password reset | Done | `/reset-password` + API |
| Email verification | Done | Required before receipt **submission**; drafts allowed |
| Worker dashboard | Done | Stats + onboarding checklist |
| Receipt list | Done | List with empty/error/loading states |
| Receipt filtering | Done | Search, status, sort toolbar |
| Receipt creation | Done | `NewReceiptPage.tsx` |
| Receipt editing | Done | Draft / correction fields on detail page |
| Draft deletion | Done | Confirm dialog on detail page |
| File evidence | Done | Upload + authorized download UI |
| Link evidence | Done | Form (not prompt-only) |
| Evidence removal | Done | Confirm dialog |
| Receipt submission | Done | Customer verification email path |
| Verification resend | Done | Dedicated resend + delivery status |
| Receipt history | Done | Events timeline on detail page |
| Archive / unarchive | Done | `archivedAt` (status unchanged) |
| Public proof | Done | `proofValidity` banners |
| QR code | Done | Valid proofs only |
| PDF export | Missing | Post-pilot |
| Profile editing | Done | `ProfilePage.tsx` |
| Organisation management | Partial | Invitation-based overview; no members/edit |
| Worker assignment | Missing | Programme model later |
| Admin actions | Done | Suspend/activate, revoke, resolve + confirm dialogs |
| Disputes (customer) | Done | Via verify respond |
| Disputes (admin resolve) | Done | Admin UI + API |
| Account settings | Partial | Profile + email verify; no session UI in web |
| Account deletion | Partial | Support email request (no self-serve) |
| Privacy / Terms | Done | Pilot legal pages + operator/support contact |
| Error / empty / loading | Done | Shared UI patterns on key pages |
| Offline / PWA | Missing | Out of pilot scope |
| Responsive navigation | Done | Mobile menu with `aria-expanded` |
| Playwright E2E | Done | `apps/web/e2e` (mocked auth) |

### Web accessibility snapshot

| Check | Status | Notes |
|-------|--------|-------|
| Keyboard support | Partial | Native controls; dialogs Escape/focus restore |
| Focus states | Partial | `:focus-visible` in CSS |
| Form labels | Done | Labels wrap inputs; consent checkboxes labelled |
| Contrast | Partial | Navy/cream/emerald; gold accents need spot-check |
| Screen-reader labels | Partial | Main nav, skip link, live regions, dialogs |
| Semantic headings | Done | Page h1 + section h2 pattern |
| Status announcements | Done | Alerts + live regions on admin/detail |
| Validation messages | Done | Client consent + server errors |
| Touch targets | Partial | Nav/actions sized; continue spot-check |

---

## 2. Mobile parity vs web/API

| Capability | Web | API | Mobile | Gap severity |
|------------|-----|-----|--------|--------------|
| Auth register/login | Done | Done (cookie + Bearer mobile) | Shell / preview | P0 for public mobile |
| Bearer + SecureStore | N/A | Done for `X-Client-Platform: mobile` | Partial / shell | P0 |
| Session restore | Cookie `/auth/me` | Done | Shell | P0 |
| Worker dashboard | Done | Done | Shell | P0 |
| Receipts list/create | Done | Done | Shell | P0 |
| Evidence camera/gallery/docs | Done (web file/link) | File+link | Shell | P0/P1 |
| Profile | Done | Done | Shell | P0 |
| Verification links | Done | Done | Deep link later | P1 |
| Public proof | Done | Done | Later | P1 |
| QR | Done (web display) | N/A | Scan later | P1 |
| Offline drafts / retry | Missing | N/A | Missing | P1 |
| Production API URL | Env | Env | Preview env only | P1 |

**Posture:** Mobile is an **internal preview shell**. Joint public web+mobile store launch is **not** the current target.

---

## 3. Receipt lifecycle coverage

| Transition / rule | API | Web UI | Mobile | Tests |
|-------------------|-----|--------|--------|-------|
| Create DRAFT | Yes | Yes | No | Yes (API) |
| Edit DRAFT / CORRECTION_REQUESTED | Yes | Yes | No | Yes |
| Add/remove evidence | Yes | Yes | No | Yes (API) |
| Submit → PENDING | Yes | Yes | No | Yes |
| Customer confirm → VERIFIED | Yes | Yes | N/A | Yes |
| Correction requested | Yes | Via verify | N/A | Yes |
| Resubmit after correction | Yes | Yes | No | Yes |
| Dispute | Yes | Via verify | N/A | Yes |
| Admin revoke | Yes | Yes | No | API + E2E mock |
| Admin resolve dispute | Yes | Yes | No | API + UI |
| Archive | Yes | Yes | No | API |
| Public proof privacy | Yes | Yes | No | Yes |
| Integrity hash / lock | Yes | Displayed | No | Indirect |

---

## 4. Organisation & admin

| Feature | API | Web | Notes |
|---------|-----|-----|-------|
| Org public self-registration | No | No | Invitation / admin provision only |
| Org dashboard | Scoped | Invitation messaging | No platform-wide leak |
| Members / invites | No | No | Deferred |
| Worker assignment | No | No | Deferred |
| Admin user list | Yes | Yes | |
| Admin suspend/activate | Yes | Yes + confirm | |
| Admin receipt list | Yes | Yes | |
| Admin revoke | Yes | Yes + confirm | |
| Admin disputes | Yes | Resolve UI | |

---

## 5. Wave 0 status (accurate)

| Wave | Status |
|------|--------|
| 0A Auth / sessions / CI hygiene | Done |
| 0B Lifecycle / proofValidity / archive | Done |
| 0C Evidence storage + email verify + outbox | Done |
| 0D Password reset, admin bootstrap, Docker, staging smoke docs | Done |
| UX finalization (this wave) | Done locally — E2E + legal/org UX polish |

**Verdict:** Web + API are the pilot launch track. Mobile parity is later. Staging on AWS and legal review remain before unrestricted public launch.
