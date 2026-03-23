import express, { Request, Response } from "express";
import { sanitizeInput, generateId, formatTimestamp } from "./utils";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ INTENTIONAL VULNERABILITY FOR DEMO — Hardcoded API key
const API_KEY = "sk-1234567890abcdef";

// Simulated database interface
interface Database {
  query(sql: string): Promise<unknown>;
}
declare const db: Database;

// ──────────────────────────────────────────────
// ⚠️ VULNERABLE ENDPOINTS (intentional for demo)
// ──────────────────────────────────────────────

// ⚠️ INTENTIONAL VULNERABILITY FOR DEMO — SQL Injection
// Raw string concatenation allows an attacker to manipulate the query.
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const query = "SELECT * FROM users WHERE id = " + req.params.id;
  const result = await db.query(query);
  res.json(result);
});

// ⚠️ INTENTIONAL VULNERABILITY FOR DEMO — Reflected XSS
// User input is rendered directly into HTML without escaping.
app.get("/search", (req: Request, res: Response) => {
  const term = req.query.q as string;
  res.send(`
    <html>
      <body>
        <h1>Search Results</h1>
        <p>You searched for: ${term}</p>
        <p>No results found.</p>
      </body>
    </html>
  `);
});

// ⚠️ INTENTIONAL VULNERABILITY FOR DEMO — Hardcoded secret in header
app.get("/api/external-data", async (_req: Request, res: Response) => {
  const response = await fetch("https://api.example.com/data", {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await response.json();
  res.json(data);
});

// ──────────────────────────────────────────────
// ✅ SECURE ENDPOINTS (for contrast)
// ──────────────────────────────────────────────

// Parameterized query — safe from SQL injection
app.get("/api/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  const result = await db.query("SELECT * FROM products WHERE id = $1");
  res.json(result);
});

// Properly sanitized output — safe from XSS
app.get("/secure-search", (req: Request, res: Response) => {
  const term = sanitizeInput(req.query.q as string);
  res.send(`
    <html>
      <body>
        <h1>Search Results</h1>
        <p>You searched for: ${term}</p>
        <p>No results found.</p>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: formatTimestamp(new Date()),
    requestId: generateId(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
