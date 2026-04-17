/**
 * LLM Service
 * Uses OpenAI GPT-4 if API key is available, else falls back to a rich mock.
 */

let openai = null;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
    const OpenAI = require("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI client initialized");
  } else {
    console.log("⚠️  No OpenAI key — using mock LLM (rich responses enabled)");
  }
} catch (e) {
  console.log("⚠️  OpenAI unavailable — using mock LLM");
}

// ─── Mock Response Engine ─────────────────────────────────────────────────────
const MOCK_RESPONSES = {
  greet: [
    "Namaste! 🙏 Main VoiceBridge+ hun — aapki kaise madad kar sakta hun? Aap doctor appointment book kar sakte hain, bank balance check kar sakte hain, ya scholarship ke baare mein pooch sakte hain.",
    "Hello! I'm VoiceBridge+, your voice AI assistant. I can help you book doctor appointments, check bank balance, or guide you through scholarships. What would you like to do today?",
  ],
  doctor_start: [
    "Bilkul! Doctor appointment ke liye, pehle batayein — aap kis **city** mein hain? Mumbai, Delhi, Bangalore, ya koi aur sheher?",
    "Sure! Let's book your doctor appointment. First, which **city** are you in? I can help you find top hospitals nearby.",
  ],
  doctor_city: [
    "Great choice! Ab batayein, aapko kis type ke **specialist** ki zaroorat hai? Jaise: Cardiologist, Dermatologist, Orthopedic, General Physician, ya Pediatrician?",
    "Perfect! Now, what type of **specialist** do you need? Cardiologist, Dermatologist, Orthopedic, General Physician, or Pediatrician?",
  ],
  doctor_spec: [
    "Achha! Last step — aap **kab available** hain? Morning (9-12), Afternoon (12-5), ya Evening (5-8)? Aur preferred date?",
    "Almost done! What **time slot** works best for you? Morning (9-12 AM), Afternoon (12-5 PM), or Evening (5-8 PM)?",
  ],
  doctor_confirm: [
    "✅ **Appointment Confirmed!**\n\n🏥 Apollo Health Centre\n👨‍⚕️ Dr. Rajesh Kumar\n📍 {city}\n🕐 {time} slot\n📅 Tomorrow\n📋 Token: APL-{token}\n\nAppoint reminder SMS bheja ja raha hai aapke registered number par. Kya aur kuch chahiye?",
  ],
  bank_start: [
    "Bank balance check karne ke liye, please apna **account number ke last 4 digits** batayein aur **bank ka naam** confirm karein.",
    "To check your bank balance, please provide your **bank name** and last **4 digits** of your account number for verification.",
  ],
  bank_confirm: [
    "🏦 **Balance Retrieved Successfully**\n\nBank: {bank}\nAccount: XXXX-XXXX-{acc}\nAvailable Balance: **₹{balance}**\nLast Transaction: ₹2,400 (Online Purchase) - Yesterday\n\nAapka balance secure tarike se access kiya gaya. Koi aur help chahiye?",
  ],
  scholarship_start: [
    "Scholarship guidance ke liye, main aapko best options dhundh deta hun! Batayein:\n1. Aap currently **kitne saal** ke hain?\n2. **Class/Stream** kya hai? (10th, 12th, Graduate, etc.)\n3. **Annual family income** approximately?",
    "Great choice investing in education! To find the best scholarships, tell me:\n1. Your **current class/year** of study?\n2. **Category** (General/SC/ST/OBC/Minority)?\n3. **Annual family income** range?",
  ],
  scholarship_results: [
    "🎓 **Top Scholarships for You:**\n\n1. **PM Scholarship Scheme** — ₹25,000/year\n   Deadline: Dec 31 | Apply: scholarships.gov.in\n\n2. **National Merit Scholarship** — ₹12,000/year\n   Deadline: Nov 30 | Apply: nsp.uidai.gov.in\n\n3. **State Merit Scholarship** — ₹8,500/year\n   Deadline: Jan 15 | Apply: state portal\n\nKya main application form fill karne mein help karun? 📝",
  ],
  returning_user: [
    "Arre Priya ji! 👋 Aapko pehchaan liya! Pichli baar aapne Apollo Hospital mein Dr. Sharma ke saath appointment liya tha. **Kya wahi dobara book karein?** Ek second mein ho jaayega!",
    "Welcome back, Priya! 🎉 I remember you — last time you booked with Dr. Sharma at Apollo Mumbai. **Shall I book the same again?** I have all your details saved!",
  ],
  memory_used: [
    "Aapki purani details mil gayi! Seedha confirm karte hain — Dr. Sharma, Apollo Hospital, Mumbai, Morning slot. **Confirm karein?** ✅",
  ],
  fallback: [
    "Main samajh gaya. Kya aap doctor appointment, bank balance, ya scholarship ke baare mein poochna chahte hain? Main inme madad kar sakta hun!",
    "I'm here to help! I can assist with: **Doctor Appointments** 🏥, **Bank Balance** 🏦, or **Scholarship Guidance** 🎓. What would you like?",
  ],
};

function getMockResponse(intent, language = "hinglish", vars = {}) {
  const responses = MOCK_RESPONSES[intent] || MOCK_RESPONSES.fallback;
  let response = responses[language === "english" ? Math.min(1, responses.length - 1) : 0];

  // Replace template vars
  Object.entries(vars).forEach(([key, val]) => {
    response = response.replace(new RegExp(`\\{${key}\\}`, "g"), val);
  });

  return response;
}

// ─── Main LLM Call ────────────────────────────────────────────────────────────
async function generateResponse({ systemPrompt, userMessage, conversationHistory = [], maxTokens = 500 }) {
  if (openai) {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-8), // keep last 8 turns
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return {
      text: response.choices[0].message.content,
      usedRealLLM: true,
      model: "gpt-4o-mini",
    };
  }

  // Mock fallback - intelligent routing
  return {
    text: null, // caller uses getMockResponse
    usedRealLLM: false,
    model: "mock",
  };
}

// ─── Language Detection ───────────────────────────────────────────────────────
function detectLanguage(text) {
  const hindiChars = /[\u0900-\u097F]/;
  const hindiWords = /\b(hai|hain|kya|aap|mujhe|mera|karo|chahiye|nahin|nahi|ek|do|teen|accha|theek|bol|kar|de|le|ja|aa|ho|tha|thi|the|hun|hoon|bhi|aur|ya|ki|ke|ka|se|mein|pe|par|yeh|woh|kaise|kyun|kab|kahan)\b/i;
  const isHindi = hindiChars.test(text) || hindiWords.test(text);
  const hasEnglish = /[a-zA-Z]{3,}/.test(text);
  if (isHindi && hasEnglish) return "hinglish";
  if (isHindi) return "hindi";
  return "english";
}

// ─── Intent Detection ─────────────────────────────────────────────────────────
function detectIntent(text) {
  const lower = text.toLowerCase();
  if (/doctor|appointment|hospital|clinic|specialist|physician|daaktar|appoint/.test(lower)) return "doctor_appointment";
  if (/bank|balance|account|money|rupee|paisa|upi|transaction|khata/.test(lower)) return "bank_balance";
  if (/scholarship|education|college|school|study|padhai|chaatra|grant|fund/.test(lower)) return "scholarship";
  if (/same|wahi|dobara|phir|again|previous|last time|recall/.test(lower)) return "recall_previous";
  if (/hello|hi|namaste|hey|hola|start|begin|help|madad/.test(lower)) return "greet";
  return "general";
}

module.exports = { generateResponse, detectLanguage, detectIntent, getMockResponse };