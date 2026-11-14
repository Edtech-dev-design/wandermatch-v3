// ============================================================================
// VERCEL SERVERLESS / EDGE ADAPTER FOR WANDERMATCH V3.0
// Bridges Vercel (/api/*) <-> Cloudflare Worker Core (worker.js) & Supabase
// ============================================================================
import worker from "../worker.js";

const STAGING_WORKER_ORIGIN = "https://wandermatch-api-staging.vannong20182018.workers.dev";
const PROD_HOSTS = new Set(["wandermatch.vn", "www.wandermatch.vn"]);

function isProductionHost(hostHeader) {
  const cleanHost = String(hostHeader || "").split(":")[0].trim().toLowerCase();
  return PROD_HOSTS.has(cleanHost);
}

async function readRawBodyIfNeeded(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body;
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);
  if (typeof req.on === "function" && !req.readableEnded) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) return Buffer.concat(chunks);
  }
  return undefined;
}

export default async function handler(req, res) {
  const hostHeader = typeof req.headers?.get === "function"
    ? (req.headers.get("x-forwarded-host") || req.headers.get("host") || "")
    : (req.headers?.["x-forwarded-host"] || req.headers?.host || "");

  // Non-production / Vercel Preview routes /api/* directly to Staging Cloudflare Worker (V4.3)
  if (!isProductionHost(hostHeader)) {
    const reqUrl = String(req.url || "/api/v4/health");
    const pathAndQuery = reqUrl.startsWith("http")
      ? (() => { const u = new URL(reqUrl); return u.pathname + u.search; })()
      : (reqUrl.startsWith("/") ? reqUrl : `/${reqUrl}`);
    const targetUrl = `${STAGING_WORKER_ORIGIN}${pathAndQuery}`;

    if (typeof req.url === "string" && typeof req.headers?.get === "function" && !res) {
      const proxyHeaders = new Headers(req.headers);
      proxyHeaders.delete("host");
      proxyHeaders.delete("connection");
      proxyHeaders.delete("content-length");
      return fetch(targetUrl, {
        method: req.method || "GET",
        headers: proxyHeaders,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined
      });
    }

    try {
      const proxyHeaders = new Headers();
      for (const [k, v] of Object.entries(req.headers || {})) {
        const lower = k.toLowerCase();
        if (["host", "connection", "content-length", "transfer-encoding"].includes(lower)) continue;
        if (Array.isArray(v)) proxyHeaders.set(k, v.join(", "));
        else if (typeof v === "string") proxyHeaders.set(k, v);
      }
      const body = await readRawBodyIfNeeded(req);
      const upstreamRes = await fetch(targetUrl, {
        method: req.method || "GET",
        headers: proxyHeaders,
        body
      });
      res.status(upstreamRes.status);
      upstreamRes.headers.forEach((val, key) => {
        const lower = key.toLowerCase();
        if (["content-encoding", "content-length", "transfer-encoding", "connection"].includes(lower)) return;
        res.setHeader(key, val);
      });
      const buf = Buffer.from(await upstreamRes.arrayBuffer());
      return res.send(buf);
    } catch (err) {
      res.status(502).setHeader("Content-Type", "application/json");
      return res.send(JSON.stringify({
        success: false,
        code: "VERCEL_PREVIEW_PROXY_ERROR",
        error: err.message || "Failed to reach Staging Cloudflare Worker"
      }));
    }
  }

  const env = {
    COMPANY_BANK_ID: process.env.COMPANY_BANK_ID || "MB",
    COMPANY_ACCOUNT_NO: process.env.COMPANY_ACCOUNT_NO || "0988888888",
    COMPANY_ACCOUNT_NAME: process.env.COMPANY_ACCOUNT_NAME || "CONG TY TNHH WANDERMATCH VN",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "*",
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
    PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || "",
    ADMIN_EMAILS: process.env.ADMIN_EMAILS || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || "",
    PII_MASTER_KEYS_JSON: process.env.PII_MASTER_KEYS_JSON || "",
    PII_ACTIVE_KEY_VERSION: process.env.PII_ACTIVE_KEY_VERSION || "1",
    PII_BLIND_INDEX_PEPPER: process.env.PII_BLIND_INDEX_PEPPER || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
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
