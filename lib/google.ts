import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "google-token.json");

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error("ENV manquantes: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / NEXT_PUBLIC_BASE_URL");
  }

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${baseUrl}/api/auth/google/callback`
  );
}

export function getGoogleAuthUrl() {
  const oauth2Client = getOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
  "https://www.googleapis.com/auth/calendar", // ✅ lecture + écriture + freebusy
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
    // si fichier vide ou {}
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

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(tokens);

  return google.calendar({ version: "v3", auth: oauth2Client });
}
