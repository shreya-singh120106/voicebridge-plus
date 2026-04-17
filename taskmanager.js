/**
 * TaskManager
 * Manages multi-step task flows (doctor, bank, scholarship) with session state.
 * Each session is a state machine with clear transitions.
 */

const { v4: uuidv4 } = require("uuid");

// ─── Session Store ────────────────────────────────────────────────────────────
const sessions = new Map();

// ─── Task Flow Definitions ────────────────────────────────────────────────────
const TASK_FLOWS = {
  doctor_appointment: {
    steps: ["city", "specialization", "time_slot", "confirm"],
    fields: {},
  },
  bank_balance: {
    steps: ["bank_name", "account_digits", "confirm"],
    fields: {},
  },
  scholarship: {
    steps: ["education_level", "category", "income", "results"],
    fields: {},
  },
};

// ─── Simulated API Calls ──────────────────────────────────────────────────────
function simulateDoctorBooking(fields) {
  const doctors = {
    cardiologist: ["Dr. Rajesh Kumar", "Dr. Ananya Sharma", "Dr. Vivek Menon"],
    dermatologist: ["Dr. Priya Nair", "Dr. Suresh Iyer", "Dr. Kavya Reddy"],
    orthopedic: ["Dr. Amit Joshi", "Dr. Rekha Patel", "Dr. Sanjay Gupta"],
    general: ["Dr. Meera Das", "Dr. Arjun Singh", "Dr. Fatima Khan"],
    pediatric: ["Dr. Sunita Rao", "Dr. Rohit Verma", "Dr. Leela Krishnan"],
  };

  const hospitals = {
    mumbai: "Apollo Hospital, Bandra",
    delhi: "Max Healthcare, Saket",
    bangalore: "Manipal Hospital, Whitefield",
    chennai: "Apollo Hospitals, Greams Road",
    hyderabad: "Care Hospitals, Banjara Hills",
    default: "City General Hospital",
  };

  const spec = (fields.specialization || "general").toLowerCase();
  const city = (fields.city || "default").toLowerCase();
  const docList = doctors[spec] || doctors.general;
  const hospital = hospitals[city] || hospitals.default;
  const doctor = docList[Math.floor(Math.random() * docList.length)];
  const token = Math.floor(1000 + Math.random() * 9000);

  return { doctor, hospital, token, city: fields.city, time: fields.time_slot };
}

function simulateBankBalance(fields) {
  const balances = {
    "sbi": { name: "State Bank of India", balance: "₹45,230.50" },
    "hdfc": { name: "HDFC Bank", balance: "₹1,23,450.00" },
    "icici": { name: "ICICI Bank", balance: "₹67,890.25" },
    "axis": { name: "Axis Bank", balance: "₹34,120.75" },
    "pnb": { name: "Punjab National Bank", balance: "₹28,650.00" },
  };
  const key = (fields.bank_name || "").toLowerCase().split(" ")[0];
  const bankData = balances[key] || { name: fields.bank_name || "Your Bank", balance: "₹52,340.00" };
  return { ...bankData, accountLast4: fields.account_digits || "XXXX" };
}

// ─── Session Management ───────────────────────────────────────────────────────
function getOrCreateSession(sessionId, userId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      userId: userId || "anonymous",
      currentTask: null,
      taskStep: 0,
      taskFields: {},
      conversationHistory: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
  }
  const session = sessions.get(sessionId);
  session.lastActivity = new Date().toISOString();
  return session;
}

function startTask(session, taskType) {
  session.currentTask = taskType;
  session.taskStep = 0;
  session.taskFields = {};
}

function advanceTask(session, fieldValue) {
  const task = TASK_FLOWS[session.currentTask];
  if (!task) return null;

  const currentStep = task.steps[session.taskStep];
  if (currentStep && currentStep !== "confirm" && currentStep !== "results") {
    session.taskFields[currentStep] = fieldValue;
  }
  session.taskStep++;
  return session.taskFields;
}

function completeTask(session) {
  const taskType = session.currentTask;
  const fields = session.taskFields;
  let result = null;

  if (taskType === "doctor_appointment") {
    result = simulateDoctorBooking(fields);
  } else if (taskType === "bank_balance") {
    result = simulateBankBalance(fields);
  } else if (taskType === "scholarship") {
    result = { type: "scholarship_results" };
  }

  // Reset task state
  session.currentTask = null;
  session.taskStep = 0;
  session.taskFields = {};

  return result;
}

function isTaskActive(session) {
  return !!session.currentTask;
}

function getCurrentStep(session) {
  if (!session.currentTask) return null;
  const task = TASK_FLOWS[session.currentTask];
  return task?.steps[session.taskStep] || null;
}

function addToHistory(session, role, content) {
  session.conversationHistory.push({ role, content });
  // Keep last 20 messages
  if (session.conversationHistory.length > 20) {
    session.conversationHistory = session.conversationHistory.slice(-20);
  }
}

function clearSession(sessionId) {
  sessions.delete(sessionId);
}

// Cleanup old sessions every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, session] of sessions.entries()) {
    if (new Date(session.lastActivity).getTime() < cutoff) {
      sessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

module.exports = {
  getOrCreateSession,
  startTask,
  advanceTask,
  completeTask,
  isTaskActive,
  getCurrentStep,
  addToHistory,
  clearSession,
};