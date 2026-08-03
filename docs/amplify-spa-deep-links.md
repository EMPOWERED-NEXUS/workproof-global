# Amplify SPA deep-link rewrites (required for public proof)

## Confirmed production issue

Read-only probes against `https://workproof.empowerednexus.com` showed:

1. `GET /proof/{code}` → `301` to `/proof/{code}/` (Amazon S3 trailing-slash redirect)
2. `GET /proof/{code}/` → **HTTP 404** while still returning `index.html`

That combination makes copied proof links and QR scans unreliable. Many browsers and QR clients treat a 404 as a hard failure even when the body is the SPA shell.

The same pattern affects `/dashboard` and other client-side routes.

## Required Amplify Hosting change

In the Amplify Console for the web app, open **Hosting → Rewrites and redirects** and replace/add the SPA rewrite from:

`deploy/amplify/spa-rewrites.json`

The rewrite must return **status `200`** to `/index.html` for non-file SPA paths. Do **not** rely on S3 custom error documents that keep status `404`.

This repository documents the rule; applying it in Amplify is an operations step outside application code.

## Application mitigations already in code

- Canonical proof URLs use `VITE_PUBLIC_WEB_URL` when configured
- Copy / Share / QR share the same canonical URL
- React Router strips trailing slashes after the SPA loads
- Public proof API calls never enter cookie refresh

## Web build environment

Set Amplify build env:

```text
VITE_PUBLIC_WEB_URL=https://workproof.empowerednexus.com
VITE_API_URL=https://api.workproof.empowerednexus.com/api/v1
```
