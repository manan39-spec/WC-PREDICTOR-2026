# PANENKA — WC 2026 Friends Predictor League
## Deployment Guide

---

## ✅ Pre-Deployment Checklist

This application is **production-ready** and fully functional. Before deploying:

- [ ] Verify Firebase project ID and credentials in the HTML (`FIREBASE_CONFIG`)
- [ ] Test login/signup flow locally or in staging
- [ ] Confirm admin password is secure (`ADMIN_PASSWORD` in code)
- [ ] Review database rules are set correctly in Firebase Console
- [ ] Test predictions flow end-to-end

---

## 📋 Files & Structure

```
WC-PREDICTOR-2026/
├── public/
│   └── index.html              # ← Complete application (React, all features)
├── firebase.json               # ← Firebase hosting configuration
├── database.rules.json         # ← Firebase Realtime Database security rules
├── index.html                  # ← Root file (for local development/reference)
├── README.md                   # ← User-facing documentation
├── DEPLOYMENT_GUIDE.md         # ← This file
└── .firebaserc                 # ← Firebase project alias (auto-managed)
```

---

## 🚀 Deployment Steps

### 1. **Prepare Firebase Project**

Ensure you have a Firebase project set up with:
- Realtime Database enabled
- Hosting enabled
- Your database URL matches `FIREBASE_CONFIG.databaseURL` in the HTML

### 2. **Deploy to Firebase Hosting**

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Authenticate with Firebase
firebase login

# Deploy
firebase deploy --only hosting,database

# Or deploy just hosting (if database was already set up)
firebase deploy --only hosting
```

### 3. **Verify Deployment**

- Check your Firebase Hosting URL: `firebase open hosting:site`
- Test login/signup
- Verify admin panel access with password: `Manan007@!`
- Check that data is being stored (predictions sync to Firebase Realtime Database)

---

## 🔐 Security Notes

1. **Admin Password**: Currently set to `Manan007@!`
   - Change in the source code before deploying to production
   - Keep this private—only share with the league organizer
   
2. **Database Rules** (`database.rules.json`):
   - All data under `/wc26/` is public read/write (friends-only league assumption)
   - If you want more restrictive rules (e.g., authentication), update this file and redeploy: `firebase deploy --only database`

3. **Firebase Config**:
   - The API key in the HTML is intended to be public (web client SDK)
   - Restrict it in Firebase Console under Authentication → Settings → Authorized Domains

---

## 📊 Data Structure

Your Realtime Database will contain:

```
wc26/
├── wc26_state                 # Shared state (phase, groups, results, scoring, bonus)
├── wc26_pred:Alice            # Alice's predictions & account
├── wc26_pred:Bob              # Bob's predictions & account
└── ... (one entry per player)
```

**Note**: User passwords are hashed with SHA-256 + per-user salt. Never stored in plain text.

---

## 🎮 First Admin Setup

1. **Login** with any name (e.g., "Admin")
2. **Navigate to Admin panel** and enter password: `Manan007@!`
3. **Groups** → Enter all 12 groups (A–L) with their 4 teams
4. **Phase** → Change from "setup" to "group" to unlock group-stage predictions
5. **Fixtures** → Add knockout fixtures as the tournament progresses
6. **Results** → Enter actual results to calculate scores

---

## 📝 Environment Variables & Secrets

**No environment files needed**. All configuration is:
- **Public**: Firebase credentials in HTML (embedded API key is public by design)
- **Private**: Admin password hardcoded (change before deploying to production)

---

## 🛠️ Local Development

To run locally:

```bash
# Open the HTML file in a browser
open public/index.html

# Or use a local server
python3 -m http.server 8000
# Visit http://localhost:8000/public/index.html
```

---

## 🔄 Updates & Maintenance

### Updating the Code
1. Edit `/workspaces/WC-PREDICTOR-2026/public/index.html` (or `index.html` for reference)
2. Test locally
3. Deploy: `firebase deploy --only hosting`

### Resetting League Data
From the Admin panel → Danger Zone → "Reset entire league"
(Or manually clear localStorage / Firebase Console)

### Archiving Previous Tournament Data
Before starting a new season, export data from Firebase Console:
- Realtime Database → Export JSON
- Save as backup

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not syncing | Check Firebase is initialized; verify network connectivity |
| Admin password wrong | Ensure you're using `Manan007@!` (case-sensitive) |
| Predictions not saving | Check browser localStorage quota; try a different browser |
| Firebase not connecting | Verify Firebase credentials in HTML; check CORS in Firebase Console |
| Remote storage disabled warning | Firebase init failed—check API key & database URL are correct |

---

## 📦 What's Included

✅ **Complete feature set**:
- User authentication (name + password, SHA-256 hashed)
- Group stage predictions (12 winners + 8 third-placed teams)
- Knockout predictions (R32, R16, QF, SF, Final with optional exact scores)
- Bonus questions (text or multiple-choice)
- Live leaderboard with scoring breakdown
- Admin controls (phase management, group setup, results entry, lock predictions)
- Countdown timer to tournament kickoff
- Responsive design (mobile-friendly)
- Real-time data sync via Firebase

✅ **Production-ready**:
- All code in a single HTML file (easy to deploy)
- No build step required
- React + Babel included via CDN
- CSS Grid layouts (responsive)
- Modern JavaScript (ES6+)

---

## 🎯 Next Steps

1. Update admin password in source if needed
2. Deploy via Firebase CLI
3. Share hosting URL with friends
4. Have fun predicting! ⚽🏆
