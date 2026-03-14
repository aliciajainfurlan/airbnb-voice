# Airbnb Voice — Complete Setup Guide

## Step-by-Step Setup

### 1. Get an API Key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy it (you'll need it in the next step)

### 2. Configure Environment
1. Open `airbnb-voice/.env` in a text editor
2. Replace `your_key_here` with your actual API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxx
   PORT=3001
   ```
3. Save the file

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the App
```bash
npm run dev
```

You'll see output like:
```
✓ Server running on http://localhost:3001
  ➜ Local:   http://localhost:5173
```

### 5. Open in Browser
Click the link or go to: **http://localhost:5173**

## Testing the App

### Test Flow (2 minutes)

1. **Click the red orb** and say: *"I need a hotel in New York for 3 nights under $250"*
   - The orb will show waveforms while listening
   - AI will return 3 listings and read them aloud

2. **Tap "Select this option"** on any listing
   - Booking details screen appears
   - AI reads the booking summary

3. **Click "Confirm booking"**
   - Success screen shows your booking reference
   - AI confirms and speaks the reference

4. **Click "+ Add to calendar"**
   - Button confirms the action

### Testing Without Speaking
Click any of the **3 quick chips** at the bottom of the idle screen:
- 🗽 New York City
- 🌆 Chicago
- 🌉 San Francisco

These trigger pre-written searches without needing voice.

Or use the **text input** at the bottom to type your search.

## Troubleshooting

### Issue: "API key not configured"
- Check `.env` file exists in the root directory
- Verify the key starts with `sk-ant-`
- Restart the dev server

### Issue: Voice isn't working
- Use Chrome, Edge, or Safari (best voice support)
- Check if microphone is allowed (browser permission)
- Try typing instead using the text input at the bottom

### Issue: Blank screen / white page
- Check browser console (F12 → Console tab)
- Ensure backend is running (you should see "Server running on...")
- Try refreshing the page

### Issue: Backend won't start
- Ensure Node.js is installed: `node --version`
- Check port 3001 isn't already in use
- Delete `node_modules` and reinstall: `npm install`

## File Structure

```
airbnb-voice/
├── server/
│   └── index.js              # Backend API server
├── src/
│   ├── App.jsx               # Main app + state management
│   ├── index.css             # All styling
│   ├── main.jsx              # React entry point
│   └── screens/
│       ├── IdleScreen.jsx    # Voice input screen
│       ├── ResultsScreen.jsx # Show listings
│       ├── BookingScreen.jsx # Confirm details
│       └── ConfirmedScreen.jsx # Success screen
├── index.html                # HTML template
├── vite.config.js            # Frontend config
├── .env                      # API key (you create this)
└── package.json              # Dependencies
```

## Key Features Implemented

✅ **Voice Recognition** — Tap orb to speak
✅ **Live Transcript** — See what you're saying in real-time
✅ **Text-to-Speech** — AI reads responses aloud
✅ **4 Screen Flow** — Idle → Results → Booking → Confirmed
✅ **Animations** — Pulsing orb, sliding cards, pop-in checkmark
✅ **Error Handling** — Toast notifications with auto-dismiss
✅ **Text Fallback** — Type if voice isn't available
✅ **Responsive Design** — Mobile phone frame centered on desktop

## Architecture

### Frontend (React)
- Single-page app with 4 screens
- Voice input via Web Speech API (browser native)
- Speech output via Web Speech Synthesis API (browser native)
- All conversation history sent with each API request

### Backend (Express)
- Single `/api/chat` endpoint
- Proxies requests to Anthropic Claude API
- System prompt enforces JSON structure for flows
- Fallback to natural text for flexibility

## Customizing

### Change the Model
Edit `server/index.js`, line 82:
```javascript
model: 'claude-opus-4-6',  // Use a different Claude model
```

Options:
- `claude-opus-4-6` (most capable, highest cost)
- `claude-sonnet-4-6` (balanced, recommended)
- `claude-haiku-4-5-20251001` (fastest, cheapest)

### Change Voice Speed
Edit `src/App.jsx`, around line 111:
```javascript
utterance.rate = 1.05  // 0.5 = slow, 2.0 = fast
```

### Change Colors
Edit `src/index.css`, `:root` section at the top.

## Next Steps

- Read `README.md` for detailed feature documentation
- Check browser console for any errors
- Review `server/index.js` for API endpoint details
- Explore `src/screens/` for individual screen implementations

## Support

- **Browser console** (F12): Check for JavaScript errors
- **Network tab** (F12): View API requests to backend
- **Server logs**: Terminal output from `npm run dev`

---

**You're all set!** The app is fully functional end-to-end. Enjoy booking! 🎉
