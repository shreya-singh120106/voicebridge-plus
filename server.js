const express = require("express");
const cors = require("cors");
const { QdrantClient } = require("@qdrant/js-client-rest");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Qdrant Setup
const qdrant = new QdrantClient({
  url: "http://localhost:6333", // make sure Qdrant is running
});

const COLLECTION = "voice_memory";

// ✅ Create collection (runs once)
async function initQdrant() {
  try {
    await qdrant.getCollection(COLLECTION);
  } catch {
    await qdrant.createCollection(COLLECTION, {
      vectors: {
        size: 3, // dummy vector size (simple demo)
        distance: "Cosine",
      },
    });
    console.log("✅ Qdrant collection created");
  }
}

initQdrant();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is working with Qdrant 🚀");
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received" });
  }

  try {
    // 🧠 STORE in Qdrant
    await qdrant.upsert(COLLECTION, {
      points: [
        {
          id: Date.now(),
          vector: [Math.random(), Math.random(), Math.random()],
          payload: { message },
        },
      ],
    });

    // 🧠 FETCH past memory
    const past = await qdrant.scroll(COLLECTION, {
      limit: 5,
    });

    const memoryContext = past.points
      .map((p) => p.payload.message)
      .join(", ");

    let reply = "";
    const msg = message.toLowerCase();

    // 🎯 Smart contextual logic
    if (msg.includes("doctor") || msg.includes("appointment")) {
      reply = "🏥 Which city do you prefer?";
    } 
    else if (msg.includes("delhi")) {
      reply = "📍 Doctor available in Delhi at 5 PM. Confirm booking?";
    } 
    else if (msg.includes("kolkata")) {
      reply = "📍 Doctor available in Kolkata at 6 PM. Confirm booking?";
    } 
    else if (msg.includes("yes")) {
      reply = "✅ Appointment booked successfully!";
    } 
    else if (msg.includes("language") || msg.includes("hindi")) {
      reply = "🌐 Language switched to Hindi (demo)";
    }
    else if (msg.includes("same doctor")) {
      reply = "🔁 Booking repeated using your past request.";
    } 
    else {
      reply = `🤖 Based on your previous requests (${memoryContext}), I can help you with services like doctor booking, banking, or government support.`;
    }

    res.json({
      reply,
      memoryUsed: past.points.length > 1,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "❌ Error connecting to memory system",
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});