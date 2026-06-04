# PANENKA — World Cup 2026 Friends Predictor League

**The friends' FIFA World Cup 2026 prediction league.** Named after Antonín Panenka — the chipped penalty heard around the world, 1976. Same energy here: bold picks, big points, eternal bragging rights.

---

## 🎮 What Is This?

A web-based prediction league where friends predict outcomes of the FIFA World Cup 2026 (USA/Canada/Mexico) and earn points for correct calls.

**Features**:
- ⚽ **Group stage**: Pick 12 group winners + 8 advancing third-placed teams
- 🏆 **Knockouts**: Predict every match (R32 → R16 → QF → SF → Final) with optional exact scores
- 🎯 **Bonus questions**: Answer curator questions throughout the tournament
- 📊 **Live leaderboard**: Real-time scores and rankings
- 🔐 **Secure**: Password-protected accounts, data synced to Firebase
- 📱 **Responsive**: Works on phone, tablet, desktop

---

## 🚀 Getting Started

### For Players
1. Visit the deployed URL (provided by the league organizer)
2. Sign up with your name and password
3. Make your group stage predictions
4. Lock in your knockouts as each phase begins
5. Answer bonus questions when they appear
6. Check the leaderboard to track your ranking

### For the Admin (League Organizer)

1. **Deploy** the app to Firebase Hosting (see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))
2. **Setup groups**: Admin panel → Groups → Enter all 12 groups
3. **Manage phases**:
   - **Setup** → **Group** (enable group predictions)
   - **Group** → **R32** (add Round of 32 fixtures)
   - **R32** → **R16** → **QF** → **SF** → **Final**
4. **Enter results** as matches finish
5. **Add bonus questions** anytime
6. **Manage players**: Reset passwords, remove inactive players

---

## 📋 Tournament Structure (WC 2026)

- **12 Groups** (A–L) with 4 teams each = 48 teams total
- **Top 2 + Best 8 thirds** advance = 32 teams to knockout
- **Knockout**: R32 (16) → R16 (8) → QF (4) → SF (2) → Final (1)

---

## 🎯 Scoring Rules

| Prediction | Points |
|-----------|--------|
| Correct group winner | 1 |
| Correct 3rd-placed team | 1 |
| Correct R32 winner | 2 |
| Correct R16/QF/SF/Final winner | 3 |
| Correct R16+ exact score | +3 |
| Correct bonus question | 4 |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (via CDN)
- **Backend**: Firebase Realtime Database
- **Hosting**: Firebase Hosting
- **Auth**: SHA-256 hashed passwords (no external auth needed)
- **Single file**: `public/index.html` — the entire app

---

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Firebase setup
- Deployment steps
- Security configuration
- Troubleshooting

---

## 🎨 Design

Built with a bold, modern dark aesthetic inspired by tournament branding. Fully responsive, works on mobile.

---

## 📄 Files

- `public/index.html` — **Full application** (React + styles + logic)
- `firebase.json` — Hosting & database configuration
- `database.rules.json` — Firebase Realtime Database security rules
- `DEPLOYMENT_GUIDE.md` — Step-by-step deployment instructions

---

## 🔐 Security

- Passwords hashed with SHA-256 + per-user salt
- Firebase Realtime Database with permissive rules (friends-only assumption)
- Admin password protected
- All data persisted to Firebase + local browser storage

---

## ⚽ Named After

**Antonín Panenka** — Czech footballer who, in the 1976 European Championship final, chipped the ball down the middle during a penalty shootout while West German goalkeeper Sepp Maier dived. Czechoslovakia won the trophy.

**That's the energy we're going for**: Bold. Confident. Audacious.

---

## 📣 Questions?

Contact the league admin (whoever set this up for your group).

---

**Good luck, and may your predictions be bold.** ⚽🏆