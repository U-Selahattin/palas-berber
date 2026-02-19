// lib/google.ts
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "google-token.json");
const UPSTASH_KEY = "google:oauth_tokens";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function getBaseUrlFromEnv() {
  // priorité : NEXT_PUBLIC_BASE_URL -> VERCEL_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) return normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "";
}

export function getOAuthClient(baseUrlOverride?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const baseUrl = normalizeBaseUrl(baseUrlOverride || getBaseUrlFromEnv());
  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error(
      "ENV manquantes: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / NEXT_PUBLIC_BASE_URL (ou VERCEL_URL)"
    );
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthUrl(baseUrlOverride?: string) {
  const oauth2Client = getOAuthClient(baseUrlOverride);

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "openid",
      "email",
      "profile",
    ],
  });
}

/* ---------------------------
   Storage helpers
--------------------------- */

function hasUpstash() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashGet() {
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  return redis.get<any>(UPSTASH_KEY);
}

async function upstashSet(tokens: any) {
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  await redis.set(UPSTASH_KEY, tokens);
}

/* ---------------------------
   Public API
--------------------------- */

export async function saveTokens(tokens: any) {
  if (hasUpstash()) {
    await upstashSet(tokens);
    return;
  }

  // local fallback
  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf-8");
}

export async function loadTokens() {
  if (hasUpstash()) {
    const t = await upstashGet();
    if (!t || Object.keys(t).length === 0) return null;
    return t;
  }

  // local fallback
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const raw = fs.readFileSync(TOKEN_PATH, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function isConnectedToGoogle() {
  return Boolean(await loadTokens());
}

export async function getAuthorizedCalendar() {
  const tokens = await loadTokens();
  if (!tokens) return null;

  // redirectUri pas important ici, mais OAuth client doit être construit correctement
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(tokens);

  return google.calendar({ version: "v3", auth: oauth2Client });
}
