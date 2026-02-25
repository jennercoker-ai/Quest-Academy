# Deploy to Railway

Your app is ready for Railway (`railway.toml` is configured). The Railway CLI is installed as a dev dependency.

## One-time setup (do this once)

1. **Log in to Railway** (opens browser):
   ```bash
   npx railway login
   ```

2. **Link this project** to a new or existing Railway project:
   ```bash
   npx railway link
   ```
   - Choose **Create new project** (or pick an existing one).
   - Choose **Add new service** if creating a new project.

## Deploy

From the project root:

```bash
npm run deploy
```

Or:

```bash
npx railway up --detach
```

After the first successful deploy, set any env vars (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Railway dashboard: **Project → your service → Variables**.
