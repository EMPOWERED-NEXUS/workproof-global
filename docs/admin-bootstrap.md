# Platform admin bootstrap

Public registration **cannot** create `ADMIN` or `ORGANISATION` users (`registerSchema` allows only `WORKER`, with required Terms and Privacy acceptance). Organisation accounts are **invitation-based / administratively provisioned** — they must never be offered through the public register UI.

## Create or promote the first administrator

Run from the repository root against the **target** database (`DATABASE_URL`):

```bash
# Promote an existing verified user
npm run admin:bootstrap -- --email admin@example.com --confirm

# Create a new admin (password required; no default password exists)
npm run admin:bootstrap -- --email admin@example.com --create --password 'ChooseAStrongPass1' --confirm --full-name 'Platform Admin'
```

### Production acknowledgement

If `NODE_ENV=production`, also pass:

```bash
--i-understand-production
```

The script refuses production otherwise.

### Safety properties

- Not invoked by Docker entrypoint or CI deploy
- Requires `--confirm`
- Never embeds a default password
- Creates an audit log (`ADMIN_BOOTSTRAP_CREATED` / `ADMIN_BOOTSTRAP_PROMOTED`)
- Will not promote an unverified existing user (verify email first, or use `--create`)
