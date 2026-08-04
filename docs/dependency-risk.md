# Dependency risk assessment (Wave 0D)

Generated from `npm audit` / `npm audit --omit=dev` without applying breaking fixes.

## High severity

| Package | Workspace | Prod exposure | Exploitability in WorkProof | Immediate mitigation | Upgrade path |
|---------|-----------|---------------|----------------------------|----------------------|--------------|
| `react-router` / `react-router-dom` (GHSA-qwww-vcr4-c8h2) | `apps/web` | **Yes** (browser bundle) | **Low** for this app — advisory targets **RSC mode** CSRF/action execution. WorkProof web uses classic SPA `BrowserRouter`, not React Server Components. | Keep SPA routing; no RSC actions. Monitor advisory. | Planned minor upgrade of `react-router` / `react-router-dom` to ≥8.3.0 after staging regression (not forced in Wave 0D). |

## Moderate severity (summary)

Most remaining findings are in the **Expo / `@expo/config-plugins` toolchain** under `apps/mobile`. These are **development / build-time** exposures for the mobile workspace, not part of the API or web production Docker images.

| Area | Prod API image | Prod web image | Mobile staging |
|------|----------------|----------------|----------------|
| Expo config-plugin chain | Not included | Not included | Build-time only until Wave 3 |
| API runtime deps | No high findings in current audit slice | n/a | n/a |

## Staging decision

- **API + web staging is not blocked** by Expo tooling advisories.
- **Web** should schedule a controlled `react-router` bump after smoke tests.
- Do **not** run `npm audit fix --force`.
