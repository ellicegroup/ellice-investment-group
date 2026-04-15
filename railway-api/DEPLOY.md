# Deploy the Ellice Investor API to Railway

## What you need on your Mac

- The `api` folder containing `main.py` and `requirements.txt`
- The `ellice_fund.db` SQLite database file

---

## Step 1 — Prepare the folder on your Mac

Open **Terminal** and run:

```bash
# Go to the api folder (adjust path if needed)
cd ~/Desktop/"Ellice Growth Fund"/"Investor Portal Database"/api

# Copy the database into the api folder
cp ../"ellice_fund.db" .

# Copy railway.toml into the api folder
# (download it from this repo or paste the contents below)
```

Create a file called `railway.toml` in that folder with this content:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

---

## Step 2 — Install Railway CLI

```bash
# Option A — Homebrew (recommended)
brew install railway

# Option B — npm
npm install -g @railway/cli
```

---

## Step 3 — Login to Railway

```bash
railway login
# Opens your browser → sign in with GitHub or email
```

---

## Step 4 — Deploy

```bash
# Still inside the api folder:
railway init
# → "Create new project"
# → Name it: ellice-investor-api

railway up
# Uploads everything including ellice_fund.db and deploys
```

---

## Step 5 — Set environment variables in Railway

Go to **railway.app → your project → Variables** and add:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | (any long random string, e.g. `openssl rand -hex 32`) |
| `ADMIN_TOKEN` | (any secret string for admin endpoints) |
| `DB_PATH` | `./ellice_fund.db` |
| `GOOGLE_SHEETS_API_KEY` | (your Sheets API key, if main.py uses it) |
| `ALLOWED_ORIGINS` | `https://www.elliceinvestmentgroup.com,https://elliceinvestmentgroup.com` |

---

## Step 6 — Get your public URL

In Railway → your service → **Settings → Domains**  
Click "Generate Domain" → you get something like:  
`https://ellice-investor-api.up.railway.app`

---

## Step 7 — Wire it to the website

In **Vercel** → your project → **Settings → Environment Variables** add:

| Key | Value |
|-----|-------|
| `INVESTOR_API_URL` | `https://ellice-investor-api.up.railway.app` |

Then **Redeploy** on Vercel. Done — the investor portal now pulls real quarterly data from your SQLite database.

---

## Step 8 — Set the live NAV (optional)

Once deployed, call this endpoint to set the current gross NAV:

```bash
curl -X POST https://ellice-investor-api.up.railway.app/admin/set-live-nav \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"egf1_gross_nav": 114468.91}'
```

---

## Troubleshooting

**"module not found"** → make sure `requirements.txt` lists all dependencies  
**"database not found"** → check that `ellice_fund.db` was copied into the api folder before `railway up`  
**CORS errors in browser** → make sure `ALLOWED_ORIGINS` includes your Vercel domain
