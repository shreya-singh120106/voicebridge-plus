<div align="center">

<br/>

```
██╗   ██╗ ██████╗ ██╗ ██████╗███████╗██████╗ ██████╗ ██╗██████╗  ██████╗ ███████╗    ██╗
██║   ██║██╔═══██╗██║██╔════╝██╔════╝██╔══██╗██╔══██╗██║██╔══██╗██╔════╝ ██╔════╝   ██╔╝
██║   ██║██║   ██║██║██║     █████╗  ██████╔╝██████╔╝██║██║  ██║██║  ███╗█████╗    ██╔╝ 
╚██╗ ██╔╝██║   ██║██║██║     ██╔══╝  ██╔══██╗██╔══██╗██║██║  ██║██║   ██║██╔══╝   ██╔╝  
 ╚████╔╝ ╚██████╔╝██║╚██████╗███████╗██████╔╝██║  ██║██║██████╔╝╚██████╔╝███████╗██╔╝   
  ╚═══╝   ╚═════╝ ╚═╝ ╚═════╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝ ╚══════╝╚═╝   
```

### **Voice AI Agent for Accessibility & Task Automation**
*Bridging the gap between people and essential services — in their own language.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-00e5ff?style=for-the-badge)](LICENSE)

<br/>

[🚀 Live Demo](#-demo-walkthrough) · [📖 Docs](#-setup-instructions) · [🏗️ Architecture](#-architecture) · [🌍 Features](#-features)

<br/>

</div>

---

## 🌍 The Problem

Over **400 million people** in India alone struggle to access essential services — healthcare, banking, government schemes — due to:

- 📵 Low digital literacy and complex app interfaces
- 🌐 Language barriers (Hindi, regional languages vs English-only UIs)
- 📋 Multi-step processes that require reading & typing
- 🧩 No memory — having to repeat the same information every single time

**People miss doctor appointments. They miss scholarship deadlines. They don't know their account balance.**

Not because the services don't exist — but because the **interface is broken for them.**

---

## 💡 The Solution

**VoiceBridge+** is a voice-first AI agent that lets anyone interact with essential services through **natural conversation** — in Hindi, English, or Hinglish.

No forms. No menus. No typing. Just **talk.**

```
User:  "Doctor appointment chahiye"
AI:    "Bilkul! Aap kis city mein hain?"
User:  "Mumbai"
AI:    "Kaun se specialist chahiye?"
User:  "Heart doctor"
AI:    "✅ Dr. Rajesh Kumar — Apollo Hospital, Mumbai | Token: APL-4821"
```

The AI **remembers** you, **speaks your language**, and **completes tasks** — not just answers questions.

---

## ✨ Features

### 🎙️ Voice Interaction
- One-tap mic button to start/stop recording
- Real-time speech-to-text via Web Speech API
- Optional text-to-speech for AI responses
- Live voice waveform animation while listening
- Supports Chrome, Safari, Edge, and Android browsers

### 🤖 Agent Action Mode *(The WOW Feature)*
The AI doesn't just answer — it **completes tasks** step by step.

| Task | Steps | What Happens |
|------|-------|--------------|
| 🏥 Doctor Appointment | 4 steps | City → Specialist → Time Slot → Confirmed Booking |
| 🏦 Bank Balance | 3 steps | Bank Name → Account Digits → Balance Retrieved |
| 🎓 Scholarship Guidance | 4 steps | Level → Category → Income → Matched Scholarships |

Each flow maintains full **session state** — users never need to repeat themselves mid-conversation.

### 🧠 Memory & Personalization *(Powered by Vector DB)*
- Past interactions stored as semantic embeddings (Qdrant / in-memory)
- Similarity search retrieves relevant context before every response
- Returning users get **instant recognition** — skipping steps they've done before

```
# First visit
User: "Book a doctor appointment"
AI:   → Asks city, specialist, time (full flow, 4 steps)

# Return visit  
User: "Same doctor book kar do"
AI:   → "I remember you! Dr. Sharma, Apollo Mumbai — confirm? ✅" (1 step)
```

### 🌐 Multilingual Intelligence
- Auto-detects Hindi, English, and Hinglish (code-switching)
- Responds in the **same language and style** the user uses
- Supports Devanagari script rendering in UI
- No language selection needed — just talk naturally

### 💬 Conversational Intelligence
- Intent detection: task / query / help / recall
- Handles vague or incomplete inputs gracefully
- Multi-turn context across the full conversation
- Warm, accessible tone — designed for low-literacy users

### 🎭 Demo Mode
- Pre-loaded demo user "Priya" with rich memory history
- Instant showcase of returning user personalization
- 5 curated demo scenarios for live presentations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │  Mic UI  │──▶│ Web Speech   │──▶│  Chat Interface      │    │
│  │ (Click)  │   │ API (STT)    │   │  (Bubbles + State)   │    │
│  └──────────┘   └──────────────┘   └──────────────────────┘    │
│         │               │                      ▲               │
│         └───────────────┴──── POST /api/chat ──┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  BACKEND (Express) │
                    │                   │
                    │  ┌─────────────┐  │
                    │  │  Language   │  │
                    │  │  Detector   │  │
                    │  └──────┬──────┘  │
                    │         │         │
                    │  ┌──────▼──────┐  │
                    │  │   Intent    │  │
                    │  │ Classifier  │  │
                    │  └──────┬──────┘  │
                    │         │         │
          ┌─────────┴──┐      │      ┌──┴──────────┐
          │  Vector DB │◀─────┤      │Task Manager │
          │  (Qdrant / │      │      │(State Machine│
          │  in-memory)│      │      │  Workflows)  │
          └─────────┬──┘      │      └──────┬───────┘
                    │         │             │
                    └─────────▼─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   LLM Handler     │
                    │  (OpenAI / Mock)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  JSON Response    │
                    │  + Metadata       │
                    └───────────────────┘
```

### Data Flow
1. **User speaks** → Web Speech API transcribes to text
2. **Text sent** to `POST /api/chat` with `sessionId` + `userId`
3. **Language detected** (Hindi / English / Hinglish)
4. **Intent classified** (doctor / bank / scholarship / greet / recall)
5. **Memory retrieved** via vector similarity search (top 3 relevant memories)
6. **Task state machine** advances the conversation flow
7. **LLM generates** context-aware response (OpenAI or rich mock)
8. **Response stored** as embedding for future recall
9. **Frontend displays** response + optional TTS playback

---

## 🗂️ Project Structure

```
voicebridge-plus/
│
├── 📁 backend/
│   ├── server.js                   # Express server, middleware, routes
│   ├── package.json
│   ├── .env.example
│   │
│   ├── 📁 routes/
│   │   ├── chat.js                 # POST /api/chat — main conversation endpoint
│   │   ├── memory.js               # GET/POST /api/memory — store & search
│   │   └── demo.js                 # GET /api/demo — scenarios & status
│   │
│   └── 📁 services/
│       ├── llmService.js           # OpenAI + mock LLM, language/intent detection
│       ├── taskManager.js          # Multi-step workflow state machine
│       └── vectorMemory.js         # In-memory vector DB (Qdrant-compatible)
│
├── 📁 frontend/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   │
│   └── 📁 src/
│       ├── 📁 app/
│       │   ├── layout.js           # Root layout, fonts, metadata
│       │   ├── page.js             # Main app page
│       │   └── globals.css         # Design system, animations, tokens
│       │
│       ├── 📁 components/
│       │   ├── ChatInterface.js    # Full chat UI with bubbles & input
│       │   ├── MicButton.js        # Animated mic with states
│       │   ├── WaveformVisualizer.js # Real-time voice waveform
│       │   ├── MessageBubble.js    # User/AI chat bubbles with markdown
│       │   ├── QuickActions.js     # Shortcut chips for demo
│       │   ├── MemoryPanel.js      # Live memory viewer sidebar
│       │   ├── DemoPanel.js        # Hackathon demo scenario launcher
│       │   └── StatusBar.js        # Language, intent, memory indicators
│       │
│       └── 📁 hooks/
│           ├── useVoiceRecorder.js  # Web Speech API hook
│           └── useSpeech.js         # TTS hook
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React | UI framework, routing, SSR |
| **Styling** | Tailwind CSS | Utility-first design system |
| **Voice Input** | Web Speech API | Browser-native STT, no API key |
| **Voice Output** | Speech Synthesis API | Browser-native TTS |
| **Backend** | Node.js + Express | REST API, middleware, session mgmt |
| **AI / LLM** | OpenAI GPT-4o-mini | Intent, context, response generation |
| **Vector DB** | Qdrant (in-memory fallback) | Semantic memory storage & retrieval |
| **Security** | Helmet + Rate Limiting | Production-grade protection |

> **No API keys required to run.** The app uses rich mock LLM responses and in-memory vector storage when OpenAI / Qdrant keys are not provided.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) OpenAI API key for real AI responses
- (Optional) Qdrant instance for persistent vector memory

### 1. Clone the repository

```bash
git clone https://github.com/shreya-singh120106/voicebridge-plus.git
cd voicebridge-plus
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — OpenAI key is optional, app works without it
```

```bash
# Start the backend server
npm run dev
# Server runs at http://localhost:5000
```

### 3. Set up the Frontend

```bash
# In a new terminal
cd frontend
npm install

# Copy environment file
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000 (default, no changes needed)
```

```bash
# Start the frontend
npm run dev
# App runs at http://localhost:3000
```

### 4. Open and explore

```
http://localhost:3000
```

That's it. No database setup, no API keys required to see the full demo. 🎉

---

### Optional: Real OpenAI Integration

Edit `backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
```

Restart the backend. All responses now use GPT-4o-mini with full context awareness.

### Optional: Real Qdrant Integration

```bash
# Run Qdrant locally via Docker
docker run -p 6333:6333 qdrant/qdrant
```

Edit `backend/.env`:
```env
QDRANT_URL=http://localhost:6333
```

Then update `vectorMemory.js` to use the `@qdrant/js-client-rest` package — the service interface is identical, making the swap a drop-in replacement.

---

## 🎬 Demo Walkthrough

### Scenario 1 — New User Books a Doctor (Full Flow)
```
You:  "I need to book a doctor appointment"
AI:   "Which city are you in?"
You:  "Mumbai"
AI:   "What type of specialist do you need?"
You:  "Cardiologist"
AI:   "Morning, Afternoon, or Evening slot?"
You:  "Morning"
AI:   "✅ Appointment Confirmed! Dr. Rajesh Kumar | Apollo Hospital, Mumbai | 9AM | Token: APL-7423"
```

### Scenario 2 — Returning User with Memory (1-step Magic ✨)
```
You:  "Same doctor book kar do"
AI:   "Arre Priya ji! I remember you — Dr. Sharma, Apollo Mumbai, Morning slot. Confirm? ✅"
You:  "Haan"
AI:   "✅ Done! Token: APL-2891. SMS sent."
```

### Scenario 3 — Hinglish Bank Balance
```
You:  "Mera bank balance check karo"
AI:   "Bank ka naam batayein — SBI, HDFC, ICICI?"
You:  "HDFC"
AI:   "Account ke last 4 digits?"
You:  "4521"
AI:   "🏦 HDFC Bank | Account XXXX-4521 | Balance: ₹1,23,450.00"
```

### Scenario 4 — Scholarship Guidance
```
You:  "Tell me about scholarships for college students"
AI:   "What's your current level? 10th, 12th, UG, or PG?"
You:  "UG first year"
AI:   "Category? General, SC, ST, OBC, Minority?"
You:  "OBC"
AI:   "🎓 Top 3 Scholarships Found: PM Scholarship (₹25,000/yr), National Merit (₹12,000/yr), State Merit (₹8,500/yr)"
```

### Launching the Demo Panel
Click **"Demo Mode"** in the top-right to instantly trigger any pre-built scenario with a single click — perfect for live hackathon presentations.

---

## 🔌 API Reference

### `POST /api/chat`
Main conversation endpoint.

```json
// Request
{
  "message": "Book doctor appointment",
  "sessionId": "uuid-string",
  "userId": "demo_user"
}

// Response
{
  "success": true,
  "response": "Which city are you in?",
  "metadata": {
    "language": "english",
    "intent": "doctor_appointment",
    "memoriesUsed": 2,
    "usedMemory": true,
    "isReturningUser": true,
    "responseTimeMs": 145
  }
}
```

### `GET /api/memory/search?query=doctor&userId=demo_user`
Semantic memory search.

### `POST /api/memory/store`
Store new memory embedding.

### `GET /api/demo/scenarios`
Returns all demo scenarios for the frontend panel.

### `GET /api/demo/status`
Returns system health, memory stats, and feature flags.

### `GET /health`
Basic health check.

---

## 🔮 Future Scope

| Feature | Description |
|--------|-------------|
| **📱 WhatsApp Integration** | Deploy as WhatsApp bot via Twilio — reach users without smartphones |
| **🌏 More Languages** | Bengali, Tamil, Telugu, Marathi, Kannada support |
| **🔊 Real Voice Calls** | Vapi integration for actual phone call automation |
| **🏥 Live API Integration** | Connect to real hospital booking, NSDL, NSP APIs |
| **🔐 Auth & Profiles** | Aadhaar-linked persistent user profiles |
| **📊 Analytics Dashboard** | Usage analytics, task completion rates, language distribution |
| **🤝 NGO Integration** | Partnership APIs for ASHA workers, Anganwadi centers |
| **♿ Screen Reader** | Full ARIA accessibility support |
| **📲 PWA / Native App** | Offline-capable Progressive Web App |
| **🏛️ Government API Layer** | Direct DigiLocker, UMANG, e-Sanjeevani integration |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for accessibility — dedicated to the 400M+ Indians underserved by existing digital infrastructure
- Inspired by the work of ASHA workers, Anganwadi centers, and rural healthcare volunteers
- Voice AI powered by the Web Speech API and OpenAI
- Vector memory architecture inspired by Qdrant's semantic search patterns

---

<div align="center">

**Made with ❤️ for people who deserve better technology**

*If this project helped you, please give it a ⭐ on GitHub*

</div>
