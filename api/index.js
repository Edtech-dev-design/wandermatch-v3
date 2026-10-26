// ============================================================================
// VERCEL SERVERLESS / EDGE ADAPTER FOR WANDERMATCH V3.0
// Bridges Vercel (/api/*) <-> Cloudflare Worker Core (worker.js) & Supabase
// ============================================================================
import worker from "../worker.js";

export default async function handler(req, res) {
  const env = {
    COMPANY_BANK_ID: process.env.COMPANY_BANK_ID || "MB",
    COMPANY_ACCOUNT_NO: process.env.COMPANY_ACCOUNT_NO || "0988888888",
    COMPANY_ACCOUNT_NAME: process.env.COMPANY_ACCOUNT_NAME || "CONG TY TNHH WANDERMATCH VN",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "*",
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || "wandermatch-default-256-bit-secret-key"
  };

  // If invoked in an Edge-compatible environment where req is a standard Request
  if (typeof req.url === "string" && typeof req.headers?.get === "function" && !res) {
    return worker.fetch(req, env);
  }

  // Standard Vercel Node.js (req, res) Serverless Function bridge
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const fullUrl = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers || {})) {
      if (Array.isArray(v)) headers.set(k, v.join(", "));
      else if (typeof v === "string") headers.set(k, v);
    }

    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (typeof req.body === "string") {
        body = req.body;
      } else if (req.body && typeof req.body === "object") {
        body = JSON.stringify(req.body);
      }
    }

    const webRequest = new Request(fullUrl, {
      method: req.method || "GET",
      headers,
      body
    });

    const webResponse = await worker.fetch(webRequest, env);
    res.status(webResponse.status);
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });
    const text = await webResponse.text();
    return res.send(text);
  } catch (err) {
    res.status(500).setHeader("Content-Type", "application/json");
    return res.send(JSON.stringify({ error: err.message || "Vercel API Internal Error" }));
  }
}
