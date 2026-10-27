# BANKAI.OS // Retro PWA Music Player 📼

Bankai is a modern music player application featuring a **Midnight Retro OS / Cyberpunk CRT** aesthetic, inspired by the Poolsuite design philosophy. It runs entirely locally and offline as a Progressive Web App (PWA).

---

## 📸 UI Preview

### 🖥️ Desktop Version
![Desktop Version](screenshots/desktop-version.png)

### 📱 Mobile Version
<p align="center">
  <img src="screenshots/mobile-version.png" alt="Mobile Version" width="360" />
</p>

---

## ✨ Key Features

- **Midnight Retro OS Aesthetic**: 80s/90s UI design with 3D bevels, CRT scanlines, pixel font (`VT323`), and a high-contrast palette of *Cyber Neon Orange* (`#FF7A59`) and *Electric Aqua* (`#00D2FF`).
- **100% Offline & Local**: Stores audio files locally in the browser using IndexedDB via `idb`. No server or internet dependency required.
- **PWA Ready**: Installable on desktop or mobile devices with a custom retro installer dialog.
- **Spotify-style Controls**: Quick volume control (`+` / `-` / Mute), toggle repeat, shuffle, and a scrubber slider with a retro audio visualizer.
- **Media Session API**: Deeply integrated with OS system media controls and lockscreen.
- **Automatic Metadata Extraction**: Automatically parses title, artist, and cover art from local MP3/FLAC/WAV files using `music-metadata-browser`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 + `@vitejs/plugin-react`
- **PWA**: `vite-plugin-pwa` + Workbox
- **Styling**: Tailwind CSS v4 + `@fontsource/vt323` + `@fontsource/geist-mono`
- **Animations**: Framer Motion
- **Local DB**: IndexedDB (`idb`)
- **Metadata Parser**: `music-metadata-browser`
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm, pnpm, or yarn

### Installation & Development

```bash
# Enter the bankai directory
cd bankai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the local URL displayed in your terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
```

The production assets and PWA service worker will be generated in the `dist/` folder.

---

## 📁 Directory Structure

```text
bankai/
├── public/              # Static assets & PWA manifest
├── screenshots/         # UI documentation (Desktop & Mobile)
├── src/
│   ├── assets/          # Icons & graphic assets
│   ├── components/      # Retro UI components (Sidebar, MiniPlayer, FullScreenPlayer, etc.)
│   ├── hooks/           # Custom hooks (usePWAInstall, useMediaSession)
│   ├── lib/             # Local IndexedDB configuration
│   ├── store/           # AudioContext & State Management
│   ├── App.tsx          # Main view & state routing
│   ├── index.css        # 3D bevels, scanlines, & Retro styling
│   └── main.tsx         # App entry point
├── package.json
└── vite.config.ts
```
