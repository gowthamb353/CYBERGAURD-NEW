# Cyber Guardian: Learn. Detect. Defend.

**Cyber Guardian** is an interactive, full-stack cybersecurity training platform designed like a modern cyber-defense game. Operatives advance through high-stakes simulated missions, hone analytical reflexes against deceptive lures, assemble impenetrable cryptographic blocks, and receive real-time tactical guidance from a multilingual AI Cyber Coach powered by Google Gemini.

---

## 🛡️ Core Features & Game Modes

1. **Phish or Legit (Phishing Hunter Mission)**
   - Fast-paced swipeable card interface (Swipe Right = Safe, Swipe Left = Threat, or touch buttons).
   - 10 simulated emails, SMS, and invoices per round.
   - Live combo multiplier for correct decision streaks.
   - Instant tactical feedback explaining the threat vector or authenticity indicator.

2. **Red Flag Hunt (Scam Detector Mission)**
   - Interactive message telemetry inspector.
   - Tap suspicious anomalies directly in the email (lookalike sender domains, artificial urgency, malware links, remote access prompts).
   - Found red flags highlight in real time with detailed analytical breakdowns.

3. **Password Fortress (Password Guardian Mission)**
   - Modular cipher construction system using abstract cryptographic building blocks (entropy salts, special symbols, high-entropy tokens).
   - Live brute-force "Crack Time" meter ranging from seconds to millions of centuries.
   - **Zero-Credential Risk:** Real passwords are never accepted, typed, or stored.

4. **Social Engineering Defense (Scam Chat)**
   - Branching simulated chat encounters with executive impersonators and urgent gift card fraud traps.
   - Enforce protocol and out-of-band verification policies to neutralize human manipulation.

5. **AI Cyber Coach (Powered by Gemini 3.8 Flash)**
   - Tactical cybersecurity adviser with quick action prompts: 💡 *Give me a hint*, ❓ *Explain this concept*, 🛡️ *Daily safety rule*.
   - **Strict Anti-Spoiler Protocol:** Never reveals answers during active challenges; provides analytical reasoning cues only.
   - Multilingual replies across all 7 supported languages.
   - Rate-limited server-side to 20 requests per user per 10 minutes.

6. **Full Multilingual Localization (7 Languages)**
   - English, Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Spanish (Español), French (Français), and Arabic (العربية).
   - Automatic Right-to-Left (`dir="rtl"`) layout adaptation for Arabic.
   - High-fidelity Noto typography fallbacks.

7. **Gamification & Command Leaderboards**
   - Sequential mission progression with locked and completed states.
   - Persistent day streaks (active today vs 24h reset).
   - Level progression formula derived from total XP.
   - Global Command and Academy/College leaderboards (sanitized to display only operative name, avatar, level, and XP).
   - Server-awarded honor badges: *First Mission*, *Phishing Hunter*, *Scam Detector*, *Password Master*, *Privacy Protector*, and *Cyber Guardian*.

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and fill in your keys:
```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="your-gemini-api-key"

# JWT_SECRET: Secret key for signing user authentication tokens.
JWT_SECRET="cyber_guardian_secret_key_2026"

# MONGODB_URI: MongoDB Atlas connection string (optional - in-memory storage fallback included)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cyberguardian?retryWrites=true&w=majority"

# PORT: Server port (defaults to 3000)
PORT=3000
```

> **Note on Storage:** If `MONGODB_URI` is not provided or Atlas is unreachable, the system automatically runs on its built-in high-performance in-memory cyber store with pre-seeded demo operatives and challenges.

### 3. Create MongoDB Atlas Cluster (Optional)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. In **Database Access**, create a database user and note the password.
3. In **Network Access**, add IP `0.0.0.0/0` (allow from anywhere).
4. Click **Connect** > **Drivers** > Copy the connection string into `MONGODB_URI` in `.env`.

### 4. Run the Seed Script
Seed the 5 mission categories, all challenge scenarios across 7 languages, and the badge matrix:
```bash
npm run seed
```

### 5. Start the Application
To run the full-stack server (Express backend + Vite frontend on port 3000):
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔑 Default Demo Operative Account
- **Email:** `guardian@cyber.shield`
- **Password:** `CyberGuardian2026!`
- Or commission a new operative via the **Create Account** button.

---

## 🔒 Security Architecture
- Answers and explanations are validated server-side only (`correctAnswer` and `explanation` are stripped from `GET /api/challenges`).
- JWT tokens with bcrypt salt hashing for credentials.
- Express rate limiting for authentication and AI Coach endpoints.
- No user emails are exposed on leaderboards.
- Sanitized centralized error handling with zero client stack traces.
