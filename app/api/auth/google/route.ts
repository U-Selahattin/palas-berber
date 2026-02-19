import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google";

export const runtime = "nodejs";

function getRequestBaseUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  const host = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;

  return new URL(req.url).origin;
}

export async function GET(req: Request) {
  const baseUrl = getRequestBaseUrl(req);
  const url = getGoogleAuthUrl(baseUrl);
  return NextResponse.redirect(url);
}
