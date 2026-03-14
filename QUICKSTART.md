# 🚀 Quick Start — 5 Minutes

## 1️⃣ Get API Key (2 min)
```
👉 https://console.anthropic.com/api/keys
✓ Create new key
✓ Copy it
```

## 2️⃣ Configure (1 min)
Open `.env` and replace:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here-xxxxxxxxxx
```

## 3️⃣ Install (30 sec)
```bash
npm install
```

## 4️⃣ Run (30 sec)
```bash
npm run dev
```

## 5️⃣ Test (1 min)
Open: http://localhost:5173

**Click the red orb** and say:
> "I need a hotel in New York for 3 nights, midtown, under $250"

🎉 **Done!** The app will find listings, you can book, and see confirmation.

---

## Quick Commands

| Command | Does |
|---------|------|
| `npm run dev` | Start frontend + backend |
| `npm run dev:frontend` | Just Vite (port 5173) |
| `npm run dev:backend` | Just Express (port 3001) |
| `npm run build` | Build for production |

---

## What to Expect

**Step 1** — Idle screen with red orb
- **Tap** to speak
- Or click a **quick chip** (NY, Chicago, SF)
- Or **type** at bottom

**Step 2** — Results screen
- AI finds 3 listings
- **Tap** "Select this option"

**Step 3** — Booking screen
- Review details
- **Tap** "Confirm booking"

**Step 4** — Success! ✓
- Booking reference shown
- AI speaks confirmation

---

## If Something's Wrong

| Error | Fix |
|-------|-----|
| `API key not configured` | Add correct key to `.env` |
| Voice not working | Use Chrome/Edge, check mic permission |
| Can't connect | Restart with `npm run dev` |
| Port in use | Kill other Node process or change PORT in `.env` |

---

## Pro Tips

- 🎤 Speak naturally: "I need a hotel..." (not "search for hotel")
- 📝 Or just **type** using the text box at bottom
- 🔊 Volume up to hear AI responses
- ⚡ Quick chips work instantly without voice
- 🔄 Click "New search" to start over

---

## Files to Know

- **`.env`** — Your API key goes here
- **`server/index.js`** — Backend/API
- **`src/App.jsx`** — Main app logic
- **`src/index.css`** — All styling
- **`src/screens/`** — 4 screen components

---

## Next Steps

✅ App is fully functional!

Want to customize?
- Change model: `server/index.js` line 82
- Change colors: `src/index.css` `:root` section
- Change voice speed: `src/App.jsx` line 121

---

**Everything is ready. Just add your API key and run!**

Questions? Check `README.md` or `SETUP.md` for more details.
