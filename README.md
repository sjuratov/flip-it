# 🔄 Flip It!

A fun party guessing game for 2–4 players. One player holds the phone on their forehead (screen facing outward) while the others describe the phrase shown on screen. Tilt down for correct, tilt up to pass!

Works in any browser, installable on iOS and Android as a PWA — no app store needed.

## 🎮 How to Play

1. **Choose categories** — pick one or more from 15 available categories
2. **Set the timer** — 30 seconds, 1 minute, 2 minutes, or 3 minutes
3. **Place the phone on your forehead** — screen facing outward so others can see
4. **Other players describe the phrase** — without saying the actual words!
5. **Guessed correctly?** Tilt the phone **down** ✅
6. **Want to skip?** Tilt the phone **up** ❌
7. **When time's up** — see your score and all the phrases you got right or wrong

## 📂 Categories

| | Category | | Category |
|---|---|---|---|
| 🐾 | Animals | 🎮 | Video Games |
| ⚽ | Sport | 📚 | Books & Stories |
| 🎵 | Music | 🦸 | Superheroes & Cartoons |
| 🎬 | Movies & TV | 🔬 | Science & Nature |
| 🍕 | Food & Drink | 💼 | Jobs & Professions |
| 🌍 | Geography | 🎉 | Holidays & Celebrations |
| 🏠 | Everyday Life | 🌊 | Travel & Adventure |
| 😂 | Funny & Silly | | |

100 phrases per category — **1,500 phrases** in total!

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment (GitHub Pages)

The app auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

**One-time setup** in your GitHub repo:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

Your game will be live at `https://<username>.github.io/flip-it/`

**Installing on mobile:**
- **iOS**: Open in Safari → tap Share → **Add to Home Screen**
- **Android**: Open in Chrome → tap **Install** prompt (or menu → Install app)

Once installed, the app works **fully offline** — no internet needed after first visit.

## 🛠 Tech Stack

- **React 19** + **TypeScript** — UI and game logic
- **Vite** — fast dev server and bundler
- **PWA** (vite-plugin-pwa) — installable, offline-capable
- **Device Orientation API** — tilt detection on mobile
- Desktop fallback with ✓ / ✗ buttons

## ✨ Features

- 🌙☀️ Dark and light theme with system preference detection
- 📱 Installable as a PWA on iOS and Android
- 🔄 Tilt controls with iOS permission handling
- ⏱️ Configurable round timer
- 🎯 Results screen with color-coded answers and category labels
- 🎲 Randomized phrase order each round
- 💾 Theme preference saved to localStorage

## 📁 Project Structure

```
src/
├── App.tsx                  # Screen state machine
├── types.ts                 # TypeScript interfaces
├── main.tsx                 # Entry point
├── data/                    # Category & phrase data (1,500 phrases)
├── hooks/
│   ├── useTheme.tsx         # Dark/light theme context
│   ├── useTilt.ts           # Device orientation tilt detection
│   └── useTimer.ts          # Countdown timer
├── screens/
│   ├── HomeScreen.tsx       # Landing page
│   ├── SetupScreen.tsx      # Category & timer selection
│   ├── ReadyScreen.tsx      # Countdown before round
│   ├── GameplayScreen.tsx   # Main game loop
│   ├── ResultsScreen.tsx    # Score & phrase review
│   └── ThemeToggle.tsx      # Dark/light mode toggle
└── styles/
    └── global.css           # Theme variables & base styles
```

## 📄 License

MIT

