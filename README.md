# PANENKA — World Cup 2026 Friends Predictor League

**The friends' FIFA World Cup 2026 prediction league.** Named after Antonín Panenka — the chipped penalty heard around the world, 1976. Same energy here: bold picks, big points, eternal bragging rights.

---

## What Is This?

A web-based prediction league where friends predict outcomes of the FIFA World Cup 2026 (USA/Canada/Mexico) and earn points for correct calls.

**Features**:

- Group stage: 12 group winners + 8 advancing third-placed teams
- Knockouts: R32 → R16 → QF → SF → Final (optional exact scores)
- Bonus questions
- Live leaderboard across all players
- Password-protected player accounts
- **Multi-device sync** via Vercel API + JSON store (15 friends, any state)

---

## Getting Started

### For Players

1. Visit the Vercel URL from your league admin
2. Sign in with your assigned name (see `data/users.json`) and your password
3. Make predictions each phase; leaderboard updates automatically

### For the Admin (You)

1. Edit `data/users.json` with real friend names
2. Set `ADMIN_PASSWORD` in `index.html`
3. Deploy to Vercel with **Upstash Redis** linked — see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. Use **Admin** tab to run phases, enter results, manage players

---

## Tech Stack

- **Frontend**: React 18 (CDN) in `index.html`
- **Storage**: `data/store.json` (seed) + `/api/store` (runtime)
- **Production DB**: Upstash Redis via Vercel (JSON blob `wc26:entries`)
- **Hosting**: Vercel
- **Auth**: SHA-256 + per-user salt; admin gate via `ADMIN_PASSWORD`

---

## Project Files

| File | Role |
|------|------|
| `index.html` | Entire app |
| `api/store.js` | Shared storage API |
| `data/users.json` | 15-player roster template |
| `data/store.json` | Local dev / empty seed |
| `vercel.json` | Routing |

---

## Deployment

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for Vercel KV setup and sharing the link with friends.
