# Airbnb Voice — Business Travel Booking App

A voice-first accommodation booking experience for business travelers. Search for accommodations, browse results, select a property, and complete a booking entirely hands-free using voice. Text input is a supported fallback.

## Quick Start

### Prerequisites
- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Setup

1. **Clone / Download** the project and navigate to the directory:
   ```bash
   cd airbnb-voice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API key:**
   Create a `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PORT=3001
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```

   This starts both:
   - **Frontend** (Vite): http://localhost:5173
   - **Backend** (Express): http://localhost:3001

5. **Open the app** in your browser at `http://localhost:5173`

## How It Works

### The Flow

1. **Idle Screen** — You see the voice orb. Tap to speak or type your travel needs.
2. **Results Screen** — AI returns 3 accommodation options. Tap to select.
3. **Booking Screen** — Review the booking details and confirm.
4. **Confirmed Screen** — Success! Your booking reference is displayed.

### Voice Interaction

- **Tap the orb** to start speaking
- **Live transcript** updates as you speak
- **AI responds** and speaks the results aloud
- Works on Chrome, Edge, and other browsers supporting Web Speech API

### Text Fallback

At the bottom of the screen, there's a text input field. Type and press "Send" if voice isn't available or preferred.

## Project Structure

```
airbnb-voice/
├── server/
│   └── index.js                    # Express server + Claude API proxy
├── src/
│   ├── App.jsx                     # Main app state management
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── screens/
│       ├── IdleScreen.jsx          # Voice interaction screen
│       ├── ResultsScreen.jsx       # Listings display
│       ├── BookingScreen.jsx       # Booking confirmation
│       └── ConfirmedScreen.jsx     # Success confirmation
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
├── .env                            # API key configuration
└── README.md                       # This file
```

## Architecture

### Frontend (React + Vite)
- **Responsive phone frame** (375px × 812px)
- **4 screens** managed with React state
- **Web Speech API** for voice input/output (browser-native, no third-party)
- **CSS animations** for orb states and transitions

### Backend (Node.js + Express)
- **Single POST endpoint** at `/api/chat`
- **Proxy** to Anthropic Claude API
- **Stateless** — conversation history managed on the frontend
- **CORS enabled** for frontend communication

### AI Model
- **Claude 3.5 Opus** for rich conversational context
- **System prompt** enforces JSON responses for structured flows
- **Fallback** to natural language for flexible interactions

## Features

✅ **Voice-first** — Hands-free booking experience
✅ **Text fallback** — Type if voice isn't available
✅ **Business-focused** — Prioritizes WiFi, workspace, cancellation policy
✅ **Real-time speech recognition** — Live transcript updates
✅ **Text-to-speech** — AI responses spoken aloud
✅ **Responsive design** — Mobile-first, dark theme
✅ **No authentication required** — Open prototype

## Development

### Available Scripts

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend    # Start only Vite frontend
npm run dev:backend     # Start only Express backend
npm run build           # Build for production
npm run preview         # Preview production build
```

### Key Technologies

- **React** 18.2 — UI framework
- **Vite** 5.0 — Frontend bundler
- **Express** 4.18 — Backend server
- **CORS** — Cross-origin requests
- **dotenv** — Environment configuration
- **Web Speech API** — Browser voice (no SDK needed)
- **Web Audio API** — Browser speech synthesis (no SDK needed)

## Customization

### Change the AI Model
Edit `server/index.js` line 82:
```javascript
model: 'claude-opus-4-6',  // Change this to another Claude model
```

### Adjust Voice Settings
Edit `App.jsx` around line 108:
```javascript
utterance.rate = 1.05    // Speech speed (0.5 - 2.0)
utterance.pitch = 1      // Voice pitch (0.5 - 2.0)
utterance.volume = 1     // Volume (0 - 1.0)
```

### Customize Colors
Edit `src/index.css` `:root` section:
```css
--red: #FF385C;     /* Primary accent color */
--green: #639922;   /* Success color */
--bg: #0f0f0f;      /* Background */
```

## Troubleshooting

### "API key not configured"
Make sure `.env` exists with `ANTHROPIC_API_KEY=your_key_here`

### Voice not working
- Check browser supports Web Speech API (Chrome, Edge, Safari)
- Verify microphone permissions are granted
- Check console for errors

### Frontend can't reach backend
- Ensure backend is running on port 3001
- Check `vite.config.js` proxy configuration

### Slow responses
- Check network latency to Anthropic API
- Monitor token usage in Anthropic console
- Consider using `claude-3-sonnet` instead of Opus for faster responses

## Out of Scope

This is a prototype. The following are **not** implemented:
- Real user authentication
- Payment processing
- Database persistence
- Real Airbnb inventory
- Mobile app (this is a mobile-styled web app)
- Accessibility compliance (WCAG)

## License

MIT — Feel free to use and modify for your needs.

---

**Questions?** Check the browser console for error messages and server logs for API errors.
