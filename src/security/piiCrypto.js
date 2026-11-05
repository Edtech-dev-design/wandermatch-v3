// ============================================================================
// WANDERMATCH V4.0 – ISOLATED PII ENCRYPTION & KEY ROTATION SERVICE
// WebCrypto AES-256-GCM Envelope Encryption + HMAC-SHA256 Blind Index
// ============================================================================

const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64Url(bytes) {
  const bin = Array.from(new Uint8Array(bytes), b => String.fromCharCode(b)).join("");
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(str) {
  const padded = String(str).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function parseMasterKeys(env = {}) {
  const defaultKeys = {
    "1": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "2": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210"
  };
  let parsed = defaultKeys;
  if (env && env.PII_MASTER_KEYS_JSON) {
    try {
      parsed = typeof env.PII_MASTER_KEYS_JSON === "string"
        ? JSON.parse(env.PII_MASTER_KEYS_JSON)
        : env.PII_MASTER_KEYS_JSON;
    } catch {
      parsed = defaultKeys;
    }
  }
  const activeVersion = Number(env?.PII_ACTIVE_KEY_VERSION || 1);
  return { keys: parsed, activeVersion };
}

async function importAesKeyFromMaterial(rawMaterial) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(String(rawMaterial)));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptPiiValue(plaintext, env = {}, explicitKeyVersion = null) {
  const clean = String(plaintext ?? "").trim();
  if (!clean) throw new Error("PII plaintext cannot be empty.");
  const { keys, activeVersion } = parseMasterKeys(env);
  const version = Number(explicitKeyVersion || activeVersion || 1);
  const keyMaterial = keys[String(version)];
  if (!keyMaterial) {
    throw new Error(`PII_KEY_NOT_FOUND: Key version ${version} is not configured.`);
  }
  const aesKey = await importAesKeyFromMaterial(keyMaterial);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    enc.encode(clean)
  );
  return {
    ciphertext: `v${version}:${toBase64Url(iv)}:${toBase64Url(cipherBuf)}`,
    keyVersion: version
  };
}

export async function decryptPiiValue(ciphertextStr, env = {}) {
  const raw = String(ciphertextStr || "");
  const parts = raw.split(":");
  if (parts.length !== 3 || !parts[0].startsWith("v")) {
    throw new Error("INVALID_PII_CIPHERTEXT_FORMAT");
  }
  const version = Number(parts[0].slice(1));
  const iv = fromBase64Url(parts[1]);
  const cipherBytes = fromBase64Url(parts[2]);

  const { keys } = parseMasterKeys(env);
  const keyMaterial = keys[String(version)];
  if (!keyMaterial) {
    throw new Error(`PII_KEY_NOT_FOUND: Cannot decrypt key version ${version}.`);
  }
  const aesKey = await importAesKeyFromMaterial(keyMaterial);
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    cipherBytes
  );
  return {
    plaintext: dec.decode(plainBuf),
    keyVersion: version
  };
}

export async function computeCccdBlindIndex(cccdPlaintext, env = {}) {
  const normalized = String(cccdPlaintext || "").replace(/\D+/g, "");
  if (normalized.length < 9 || normalized.length > 12) {
    throw new Error("INVALID_CCCD: CCCD/CMND must be 9 to 12 digits.");
  }
  const pepper = String(env?.PII_BLIND_INDEX_PEPPER || "wandermatch-v4-default-blind-index-pepper-2026");
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", hmacKey, enc.encode(normalized));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function rotatePiiRecordKeyVersion(piiRow, env = {}, targetVersion = 2) {
  const decCccd = await decryptPiiValue(piiRow.cccd_ciphertext, env);
  const decBank = await decryptPiiValue(piiRow.refund_bank_account_ciphertext, env);

  const reEncCccd = await encryptPiiValue(decCccd.plaintext, env, targetVersion);
  const reEncBank = await encryptPiiValue(decBank.plaintext, env, targetVersion);

  return {
    ...piiRow,
    cccd_ciphertext: reEncCccd.ciphertext,
    cccd_key_version: reEncCccd.keyVersion,
    refund_bank_account_ciphertext: reEncBank.ciphertext,
    bank_key_version: reEncBank.keyVersion,
    updated_at: new Date().toISOString()
  };
}

export function extractLast4Digits(value) {
  const digits = String(value || "").replace(/\D+/g, "");
  if (digits.length < 4) throw new Error("VALUE_TOO_SHORT_FOR_LAST4");
  return digits.slice(-4);
}
