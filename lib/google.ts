import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "google-token.json");
const KV_KEY = "google:oauth_tokens";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export function getBaseUrl(baseUrlOverride?: string) {
  const base =
    baseUrlOverride ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return normalizeBaseUrl(base || "");
}

export function getOAuthClient(baseUrlOverride?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = getBaseUrl(baseUrlOverride);

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error(
      "Missing ENV: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / NEXT_PUBLIC_BASE_URL (or VERCEL_URL)"
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
  "https://www.googleapis.com/auth/calendar.readonly", // ✅ pour freebusy
  "https://www.googleapis.com/auth/calendar.events",   // ✅ pour créer l’event
  "openid",
  "email",
  "profile",
],
  });
}

async function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function saveTokens(tokens: any) {
  if (await hasKV()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, tokens);
    return;
  }

  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf-8");
}

export async function loadTokens() {
  if (await hasKV()) {
    const { kv } = await import("@vercel/kv");
    const t = await kv.get<any>(KV_KEY);
    if (!t || Object.keys(t).length === 0) return null;
    return t;
  }

  if (!fs.existsSync(TOKEN_PATH)) return null;
  try {
    const raw = fs.readFileSync(TOKEN_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function isConnectedToGoogle() {
  const t = await loadTokens();
  return Boolean(t?.access_token || t?.refresh_token);
}

export async function getAuthorizedCalendar(baseUrlOverride?: string) {
  const tokens = await loadTokens();
  if (!tokens) return null;

  const oauth2Client = getOAuthClient(baseUrlOverride);
  oauth2Client.setCredentials(tokens);

  return google.calendar({ version: "v3", auth: oauth2Client });
}
