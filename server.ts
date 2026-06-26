import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const LEADS_FILE = path.join(__dirname, "leads.json");

// Ensure leads file exists
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
}

// Helper to read leads
const readLeads = () => {
  try {
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading leads file:", error);
    return [];
  }
};

// Helper to write leads
const writeLeads = (leads: any) => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error("Error writing leads file:", error);
  }
};

// --- API ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Submit lead capture form
app.post("/api/leads", (req, res) => {
  const { name, phone, email, carType, service, description } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  const leads = readLeads();
  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    phone,
    email: email || "",
    carType: carType || "Sedan",
    service: service || "General Detailing",
    description: description || "",
    status: "new",
    createdAt: new Date().toISOString(),
  };

  leads.unshift(newLead); // Add new lead to the top
  writeLeads(leads);

  res.status(201).json({ success: true, lead: newLead });
});

// 3. Retrieve leads (Admin view - secured with passcode check)
app.get("/api/leads", (req, res) => {
  const passcode = req.query.passcode;
  const adminPasscode = process.env.ADMIN_PASSCODE || "1234"; // Default simple admin passcode

  if (passcode !== adminPasscode) {
    return res.status(401).json({ error: "Unauthorized. Invalid passcode." });
  }

  const leads = readLeads();
  res.json({ success: true, leads });
});

// 4. Update lead status (e.g., mark as contacted or archive)
app.patch("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const passcode = req.query.passcode;
  const adminPasscode = process.env.ADMIN_PASSCODE || "1234";

  if (passcode !== adminPasscode) {
    return res.status(401).json({ error: "Unauthorized. Invalid passcode." });
  }

  const leads = readLeads();
  const leadIndex = leads.findIndex((l: any) => l.id === id);

  if (leadIndex === -1) {
    return res.status(404).json({ error: "Lead not found." });
  }

  leads[leadIndex].status = status || "contacted";
  writeLeads(leads);

  res.json({ success: true, lead: leads[leadIndex] });
});

// 5. Delete a lead
app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const passcode = req.query.passcode;
  const adminPasscode = process.env.ADMIN_PASSCODE || "1234";

  if (passcode !== adminPasscode) {
    return res.status(401).json({ error: "Unauthorized. Invalid passcode." });
  }

  const leads = readLeads();
  const filteredLeads = leads.filter((l: any) => l.id !== id);

  if (leads.length === filteredLeads.length) {
    return res.status(404).json({ error: "Lead not found." });
  }

  writeLeads(filteredLeads);
  res.json({ success: true, message: "Lead successfully removed." });
});

// 6. AI Detailing Consultation Advisor Endpoint
app.post("/api/advisor", async (req, res) => {
  const { year, make, model, service, paintCondition, interiorCondition, description } = req.body;

  if (!make || !model) {
    return res.status(400).json({ error: "Vehicle make and model are required for analysis." });
  }

  try {
    const vehicleStr = `${year || ""} ${make} ${model}`.trim();
    const prompt = `You are the master detailing consultant at JC's Detailing, a premium high-end car detailing service known for pristine restorations and gold-standard care.
Analyze the following customer vehicle details and provide a highly personalized, encouraging, and authoritative detailing advice report:

Vehicle: ${vehicleStr}
Selected Interest: ${service || "General Detail / Unknown"}
Paint Condition (exterior): ${paintCondition || "Not specified"}
Interior Condition: ${interiorCondition || "Not specified"}
Customer's specific notes/issues: ${description || "None provided"}

Recommend a concrete detailing package (e.g. Signature Interior Restoration, Ceramic Paint Correction, Ultimate Full Detail, or Express Renewal). Outline specific treatment steps needed for this specific vehicle and issues (e.g., if there are food stains, emphasize hot water extraction; if paint is swirly, emphasize paint correction/polishing). Give an honest, realistic estimated price range and professional tips to keep their vehicle looking brand new after detailing.

Format your response exactly according to the requested JSON schema. Maintain a premium, high-converting tone that inspires absolute trust.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["carAnalysis", "conditionScore", "treatments", "recommendedPackage", "estimatedPriceRange", "proTips"],
          properties: {
            carAnalysis: {
              type: Type.STRING,
              description: "A summary of the vehicle condition assessment, written in a warm, premium, high-converting tone.",
            },
            conditionScore: {
              type: Type.INTEGER,
              description: "An estimated score out of 100 (e.g. 100 is showroom condition, 30 is highly neglected) representing the estimated initial condition of the car based on the inputs.",
            },
            treatments: {
              type: Type.ARRAY,
              description: "List of 3 specific technical treatments needed for their car based on their described issues.",
              items: {
                type: Type.OBJECT,
                required: ["name", "reason", "time"],
                properties: {
                  name: { type: Type.STRING, description: "Name of the technical treatment (e.g., 'Dual-Action Leather Cleansing & Conditioning')" },
                  reason: { type: Type.STRING, description: "A highly specific, custom reason why this car needs this treatment based on user inputs." },
                  time: { type: Type.STRING, description: "Estimated time duration of this treatment step (e.g., '1-2 hours')" },
                },
              },
            },
            recommendedPackage: {
              type: Type.STRING,
              description: "The name of the main recommended package from JC's Detailing (e.g., 'Signature Interior Restoration')",
            },
            estimatedPriceRange: {
              type: Type.STRING,
              description: "An appropriate, high-end estimated price range (e.g., '$280 - $350')",
            },
            proTips: {
              type: Type.ARRAY,
              description: "3 highly tailored pro care tips for keeping their specific vehicle in prime condition.",
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });

    const reportText = response.text;
    if (!reportText) {
      throw new Error("Empty response from Gemini.");
    }

    const reportJson = JSON.parse(reportText.trim());
    res.json({ success: true, report: reportJson });
  } catch (error: any) {
    console.error("Gemini Advisor API Error:", error);
    res.status(500).json({
      error: "Could not generate AI detailing advice at this moment.",
      details: error.message,
    });
  }
});

// --- VITE MIDDLEWARE SETUP ---

// Start server function to handle Vite dev server injection or production build static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
