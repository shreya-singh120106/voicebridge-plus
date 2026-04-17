/**
 * VectorMemoryService
 * Simulates Qdrant vector database with in-memory cosine similarity search.
 * Drop-in replace with actual Qdrant client when deploying to production.
 */

const { v4: uuidv4 } = require("uuid");

// ─── Simple TF-IDF style embedding (no API key needed) ───────────────────────
function createEmbedding(text) {
  const words = text.toLowerCase().split(/\s+/);
  const vocab = [
    "doctor", "appointment", "hospital", "city", "specialist", "time", "date",
    "bank", "balance", "account", "money", "transfer", "upi",
    "scholarship", "education", "college", "application", "form",
    "hindi", "english", "hinglish", "help", "same", "again", "previous",
    "mumbai", "delhi", "bangalore", "chennai", "hyderabad",
    "morning", "afternoon", "evening", "tomorrow", "today",
    "name", "phone", "address", "confirm", "cancel", "book",
    "orthopedic", "cardiologist", "dermatologist", "general", "pediatric",
    "user", "remember", "memory", "context", "last",
  ];

  const vec = vocab.map((word) => {
    const count = words.filter((w) => w.includes(word) || word.includes(w)).length;
    return count / (words.length || 1);
  });

  // Normalize
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / magnitude);
}

function cosineSimilarity(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

// ─── In-Memory Store ──────────────────────────────────────────────────────────
class VectorMemoryService {
  constructor() {
    this.collections = {};
    this._initDemoData();
  }

  _initDemoData() {
    const DEMO_COLLECTION = "user_memory";
    this.collections[DEMO_COLLECTION] = [];

    const demoMemories = [
      {
        userId: "demo_user",
        type: "task_completion",
        content: "User booked appointment with Dr. Sharma (Cardiologist) at Apollo Hospital, Mumbai on 10 AM slot.",
        metadata: {
          task: "doctor_appointment",
          doctor: "Dr. Sharma",
          specialization: "Cardiologist",
          hospital: "Apollo Hospital",
          city: "Mumbai",
          time: "10 AM",
          date: "last Tuesday",
        },
      },
      {
        userId: "demo_user",
        type: "preference",
        content: "User prefers morning appointments and Apollo Hospital in Mumbai.",
        metadata: {
          preference: "morning_appointments",
          preferredHospital: "Apollo Hospital",
          preferredCity: "Mumbai",
        },
      },
      {
        userId: "demo_user",
        type: "profile",
        content: "User name is Priya. She speaks Hinglish. Age 28. Interested in health and scholarship applications.",
        metadata: {
          name: "Priya",
          language: "hinglish",
          age: 28,
          interests: ["health", "scholarship"],
        },
      },
      {
        userId: "demo_user",
        type: "task_completion",
        content: "User received bank balance of Rs. 45,230 for State Bank account ending 4521.",
        metadata: {
          task: "bank_balance",
          bank: "State Bank",
          accountLast4: "4521",
          balance: "45,230",
        },
      },
    ];

    demoMemories.forEach((mem) => this._insert(DEMO_COLLECTION, mem));
    console.log(`✅ Demo memory loaded: ${demoMemories.length} memories`);
  }

  _insert(collection, data) {
    if (!this.collections[collection]) {
      this.collections[collection] = [];
    }
    const embedding = createEmbedding(data.content);
    this.collections[collection].push({
      id: uuidv4(),
      embedding,
      payload: data,
      createdAt: new Date().toISOString(),
    });
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  createCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return { success: true, collection: name };
  }

  insert(collection, data) {
    this._insert(collection, data);
    return {
      success: true,
      id: this.collections[collection].at(-1).id,
    };
  }

  search(collection, query, limit = 3, userId = null) {
    if (!this.collections[collection] || this.collections[collection].length === 0) {
      return [];
    }

    const queryEmbedding = createEmbedding(query);

    let results = this.collections[collection]
      .filter((item) => !userId || item.payload.userId === userId)
      .map((item) => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding),
      }))
      .filter((item) => item.score > 0.01)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results.map((r) => ({
      id: r.id,
      score: r.score,
      payload: r.payload,
    }));
  }

  getAll(collection, userId = null) {
    if (!this.collections[collection]) return [];
    const items = userId
      ? this.collections[collection].filter((i) => i.payload.userId === userId)
      : this.collections[collection];
    return items.map((i) => ({ id: i.id, payload: i.payload }));
  }

  getStats() {
    const stats = {};
    Object.keys(this.collections).forEach((col) => {
      stats[col] = this.collections[col].length;
    });
    return stats;
  }
}

// Singleton instance
const vectorMemory = new VectorMemoryService();
module.exports = vectorMemory;