"use client";

import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 I am your Voice AI Assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memoryUsed, setMemoryUsed] = useState(false);
  const [listening, setListening] = useState(false);

  const chatRef = useRef();

  // ✅ Initialize Vapi
  const vapi = useRef(null);

  useEffect(() => {
    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);

    // 🎤 When user speaks
    vapi.current.on("speech-start", () => {
      setListening(true);
    });

    // 🎤 When speech ends
    vapi.current.on("speech-end", () => {
      setListening(false);
    });

    // 🤖 When AI responds
    vapi.current.on("message", (msg) => {
      if (msg.type === "assistant") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: msg.text }
        ]);
      }
    });
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎤 Start Vapi call
  const startVoice = () => {
    vapi.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  };

  // 💬 Send text message (backend)
  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", text: data.reply }
      ]);

      setMemoryUsed(data.memoryUsed);

    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: "❌ Sorry, I couldn't connect. Please try again."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4 text-white">

      <div className="glass-card glass-hover w-full max-w-xl rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-extrabold gradient-text">
            🎤 Voice Accessibility AI
          </h1>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="status-dot"></div>
            AI Ready
          </div>
        </div>

        <p className="text-center text-gray-300 text-sm mb-4">
          Voice-first AI helping users access healthcare, banking & public services.
        </p>

        {/* CHAT */}
        <div className="h-80 overflow-y-auto space-y-2 mb-4 pr-2 chat-scroll">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } message-enter`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow-md ${
                  m.role === "user"
                    ? "bubble-user text-white"
                    : "bubble-ai"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing */}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <span>🤖</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatRef}></div>
        </div>

        {/* MEMORY */}
        <div className="text-xs text-center text-gray-400 mb-3">
          {memoryUsed
            ? "🧠 Personalizing based on your past requests"
            : "🧠 Learning your preferences"}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 items-center">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request..."
            className="flex-1 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none border border-white/20 input-glow"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 px-4 rounded-xl hover:scale-105 hover:bg-blue-600"
          >
            Send
          </button>

          {/* 🎤 VAPI BUTTON */}
          <button
            onClick={startVoice}
            className={`px-4 rounded-xl transition transform hover:scale-105 ${
              listening ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          >
            🎤
          </button>
        </div>

        {/* VOICE WAVE */}
        {listening && (
          <div className="flex gap-1 mt-3 justify-center">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {["Book Doctor", "Bank Help", "Govt Services"].map((item) => (
            <button
              key={item}
              onClick={() => setInput(item)}
              className="chip px-3 py-1 text-sm rounded-lg"
            >
              {item}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}