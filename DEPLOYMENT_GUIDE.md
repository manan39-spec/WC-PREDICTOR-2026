# Deployment Guide — PANENKA WC26 (Vercel)

This app is a static React page plus a small API so **all 15 friends sync predictions across devices**. Data lives in one shared JSON store (not in the browser alone).

---

## What you need

1. A [Vercel](https://vercel.com) account (you already host here)
2. **Vercel KV** (free tier) for production — serverless functions cannot write to files on disk in production
3. Names in `data/users.json` updated to your real friends before you share the link

---

## 1. Set up the player roster

Edit `data/users.json`:

- Replace `"Friend 1"` … `"Friend 15"` with each person’s **exact login name** (case-sensitive)
- Set `admin.displayName` to your name if you want

Passwords are **not** stored in this file. Each player chooses a password on first signup; hashes live in the shared store under `wc26_pred:TheirName`.

---

## 2. Enable Vercel KV (required for multi-device sync)

1. Open your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. **Storage** → **Create Database** → **KV**
3. Link it to this project

Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. The API at `/api/store` reads/writes one key: `wc26:entries`.

Without KV, production deploys only serve the app; writes from friends will not persist across devices.

---

## 3. Deploy

```bash
npm install
npx vercel          # first time: link project
npx vercel --prod   # production
```

Or connect the GitHub repo in Vercel and deploy on push.

**Project layout:**


| Path              | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `index.html`      | Full app (React via CDN)                               |
| `api/store.js`    | Shared read/write API                                  |
| `data/store.json` | Seed / local-dev store (git)                           |
| `data/users.json` | Roster template (static, served at `/data/users.json`) |
| `vercel.json`     | SPA fallback to `index.html`                           |


---

## 4. Admin password

In `index.html`, set `ADMIN_PASSWORD` to a strong secret only you know. Friends never need this; they use their own name + password.

```javascript
const ADMIN_PASSWORD = "your-secret-here";
```

Redeploy after changing it.

---

## 5. Share with friends

Send the Vercel URL (e.g. `https://your-app.vercel.app`).

Each friend:

1. Opens the link on phone or laptop
2. Enters their name **exactly** as in `users.json`
3. Creates a password (first time) or signs in
4. Makes predictions — data syncs every ~30 seconds and on save

You (admin):

1. Sign in as a player (optional) or stay logged out
2. Open **Admin** → enter `ADMIN_PASSWORD`
3. Control phases, results, groups, bonus questions, reset passwords

---

## Local development

```bash
npm install
npx vercel dev
```

With `vercel dev`, the API writes to `data/store.json` on disk when KV is not configured. For production-like testing, link KV to a preview deployment.

---

## Data model (shared store)

All keys live in one JSON object (`wc26:entries` in KV):


| Key               | Content                                                       |
| ----------------- | ------------------------------------------------------------- |
| `wc26_state`      | Tournament phase, groups, fixtures, official results, scoring |
| `wc26_pred:Alice` | Alice’s predictions + `passwordHash` + `salt`                 |


Admin wipe (Danger Zone) clears all keys starting with `wc26_`.

---

## Troubleshooting


| Issue                              | Fix                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| “Shared storage is offline” banner | Deploy with `api/store.js`; run `vercel dev` or production, not raw `file://`         |
| Friends see different scores       | Enable Vercel KV; confirm `/api/store?health=1` returns `{ ok: true, storage: "kv" }` |
| Name not found / wrong account     | Name must match `users.json` exactly                                                  |
| Forgot password                    | Admin → Players → reset password                                                      |


---

## Migrating from Firebase

Firebase files were removed. Export old data from Firebase Console if needed, then re-enter or script-import into the new store via POST `/api/store`.