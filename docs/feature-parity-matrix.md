# WorkProof Global — Feature Parity Matrix

**Branch:** `release-v1-web-mobile`  
**Date:** 2026-07-31  

Legend: **Done** · **Partial** · **API only** · **Missing** · **N/A**

---

## 1. Web feature matrix

| Feature | Status | Evidence / notes | Finding |
|---------|--------|------------------|---------|
| Landing | Done | `LandingPage.tsx` | WEB-P2-001 CTA confusion |
| Registration | Done | `RegisterPage.tsx` + API | AUTH-P1-002 no email verify |
| Login | Done | Cookie session via `credentials: 'include'` | |
| Forgot password | Missing | No routes/API | AUTH-P1-001 |
| Password reset | Missing | | AUTH-P1-001 |
| Email verification | Missing | | AUTH-P1-002 |
| Worker dashboard | Done | `DashboardPage.tsx` + `/dashboard/worker` | |
| Receipt list | Partial | Lists items; no status/search filters in UI | WEB-P1-002 |
| Receipt filtering | API only | Query schema supports filters; UI does not | WEB-P1-002 |
| Receipt creation | Done | `NewReceiptPage.tsx` | |
| Receipt editing | Missing UI | API `PATCH` exists; detail page does not edit fields | WEB-P1-002 |
| Draft deletion | API only | `api.deleteReceipt` unused in UI | WEB-P1-002 |
| File evidence | API only | Multer route exists; web has no file upload | WEB-P1-001 |
| Link evidence | Partial | `window.prompt` UX only | WEB-P1-001 |
| Evidence removal | API only | No UI | WEB-P1-001 |
| Receipt submission | Done | Shows shareable verify link | EMAIL-P0-001 |
| Verification resend | Partial | Re-submit path only; no dedicated resend | LIFE-P2-003 |
| Receipt history | Missing | Audit logs not exposed to worker UI | LIFE-P2-002 |
| Public proof | Done | `ProofPage.tsx` | PROOF-P0-001 state rules |
| QR code | Missing | | WEB-P1-005 |
| PDF export | Missing | | WEB-P1-005 |
| Profile editing | Done | `ProfilePage.tsx` | |
| Organisation management | Partial | Read-only dashboard; no members/edit | DATA-P1-001 |
| Worker assignment | Missing | Explicitly noted in API org dashboard | DATA-P1-001 |
| Admin actions | Partial | Lists only; no suspend/revoke/resolve UI | WEB-P1-003 |
| Disputes (customer) | Done | Via verify respond | |
| Disputes (admin resolve) | API only | | WEB-P1-003 |
| Account settings | Missing | Beyond profile | AUTH-P1-003 |
| Account deletion | Missing | | AUTH-P1-003 |
| Privacy / Terms | Partial | Stub copy | DATA-P1-004 |
| Error states | Partial | Alerts on many pages | |
| Empty states | Partial | Receipts empty state present | |
| Loading states | Partial | Text loading lines | |
| Offline / PWA | Missing | | WEB-P2-003 |
| Responsive navigation | Partial | Flex wrap; no dedicated mobile nav | WEB-P2-004 |

### Web accessibility snapshot

| Check | Status | Notes |
|-------|--------|-------|
| Keyboard support | Partial | Native controls; pills focusable |
| Focus states | Partial | `:focus-visible` gold outline in CSS |
| Form labels | Partial | Labels wrap inputs on forms |
| Contrast | Partial | Navy/cream/emerald generally OK; gold on cream needs check |
| Screen-reader labels | Partial | Main nav `aria-label`; limited elsewhere |
| Semantic headings | Partial | Mostly h1/h2 present |
| Status announcements | Partial | `role="alert"` on Alert |
| Validation messages | Partial | Server errors shown; client validation minimal |
| Touch targets | Partial | Buttons padded; some ghost buttons small |

---

## 2. Mobile parity vs web/API

| Capability | Web | API | Mobile | Gap severity |
|------------|-----|-----|--------|--------------|
| Auth register/login | Done | Done (cookie) | Placeholder | P0 |
| Bearer + SecureStore | N/A | Missing Bearer | Missing | P0 |
| Session restore | Cookie `/auth/me` | Cookie only | Missing | P0 |
| Worker dashboard | Done | Done | Placeholder | P0 |
| Receipts list/create | Done | Done | Placeholder | P0 |
| Evidence camera/gallery/docs | Partial (web file missing) | File+link | Missing | P0/P1 |
| Profile | Done | Done | Placeholder | P0 |
| Verification links | Done | Done | Missing deep link | P1 |
| Public proof | Done | Done | Missing | P1 |
| QR scanning | Missing | N/A | Missing | P1 |
| Offline drafts / retry queue | Missing | N/A | Missing | P1 |
| Network detection | N/A | N/A | Health check on welcome only | P2 |
| API env handling | `VITE_API_URL` | — | `EXPO_PUBLIC_API_URL` (good pattern) | — |
| Android package | N/A | N/A | `com.empowerednexus.workproof` | — |
| Permissions (camera/files) | N/A | N/A | Not declared for capture | P1 |
| Icon / splash | Favicon SVG | — | Present (navy splash) + leftover Expo assets | P1 |
| EAS / channels | N/A | N/A | Missing `eas.json` | P1 |
| Production API URL | Env | Env | Example only uses LAN IP placeholder | P1 |

---

## 3. Receipt lifecycle coverage

| Transition / rule | API | Web UI | Mobile | Tests |
|-------------------|-----|--------|--------|-------|
| Create DRAFT | Yes | Yes | No | Yes |
| Edit DRAFT / CORRECTION_REQUESTED | Yes | No | No | Lock test only |
| Add/remove evidence | Yes | Link add only | No | No |
| Submit → PENDING | Yes | Yes | No | Yes |
| Customer confirm → VERIFIED | Yes | Yes | N/A | Yes |
| Correction requested | Yes | Via verify | N/A | No |
| Resubmit after correction | Partial (broken confirm) | Same | No | No — LIFE-P0-001 |
| Dispute | Yes | Via verify | N/A | No |
| Admin revoke | Yes | No | No | No |
| Admin resolve dispute | Yes | No | No | No |
| Archive | Yes (permissive) | No | No | No |
| Public proof privacy | Yes | Yes | No | Yes (contact hidden) |
| Integrity hash / lock | Yes | Display limited | No | Indirect |

---

## 4. Organisation & admin

| Feature | API | Web | Notes |
|---------|-----|-----|-------|
| Org registration | Yes | Yes | Creates org shell |
| Org dashboard | Leaky aggregates | Displays note + lists | SEC-P0-002 |
| Members / invites | No | No | DATA-P1-001 |
| Worker assignment | No | No | |
| Admin user list | Yes | Yes | |
| Admin suspend/activate | Yes | No | WEB-P1-003 |
| Admin receipt list | Yes | Yes | |
| Admin revoke | Yes | No | |
| Admin disputes | Yes | List only | |

---

## 5. Cross-platform synchronization assessment

| Concern | Assessment |
|---------|------------|
| Shared contracts | `@workproof/shared` used by API + mobile; **web duplicates types** |
| Auth mechanism | Web cookies ≠ mobile needs Bearer — **desynced** |
| Feature depth | Web MVP > API complete-ish ≫ Mobile shell |
| Env strategy | Separate env examples; mobile correctly avoids hardcoded LAN IP in source |
| Release trains | No CI to keep platforms in sync |

**Verdict:** Not synchronized for a joint web+mobile production launch. Web+API can approach a limited pilot after P0 fixes; mobile requires a full worker MVP implementation pass.
