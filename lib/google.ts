// lib/google.ts
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "google-token.json");

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export function getOAuthClient(baseUrlOverride?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // IMPORTANT : sur Vercel, NEXT_PUBLIC_BASE_URL doit être l'URL du site (https://xxx.vercel.app)
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl = normalizeBaseUrl(baseUrlOverride || envBaseUrl || "");

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error(
      "ENV manquantes: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / NEXT_PUBLIC_BASE_URL"
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

export function saveTokens(tokens: any) {
  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf-8");
}

export function loadTokens() {
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

export function isConnectedToGoogle() {
  return !!loadTokens();
}

export function getAuthorizedCalendar() {
  const tokens = loadTokens();
  if (!tokens) return null;

  const oauth2Client = getOAuthClient(); // ✅ utilise NEXT_PUBLIC_BASE_URL
  oauth2Client.setCredentials(tokens);

  return google.calendar({ version: "v3", auth: oauth2Client });
}
