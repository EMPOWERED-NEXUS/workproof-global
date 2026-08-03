# Duration model and public proof sharing

## Flexible work duration

Receipts store:

- `durationValue` — positive decimal, max two fractional digits
- `durationUnit` — `MINUTE | HOUR | DAY | WEEK | MONTH`

Legacy `durationMinutes` remains for compatibility. Migration backfills existing minute values as `durationValue` + `MINUTE`.

Display always uses the stored unit (`2.5 hours`, `6 months`). Months are not converted into minutes for display.

New receipt forms default the unit to **hours**.

## Canonical public proof URL

```text
https://workproof.empowerednexus.com/proof/{publicCode}
```

Generated from `VITE_PUBLIC_WEB_URL` (fallback: current origin). Copy, native share, and QR encode the identical URL. Public proof routes do not require authentication and do not attempt session refresh.
