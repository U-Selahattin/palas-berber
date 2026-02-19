// app/api/auth/google/callback/route.ts
import { NextResponse } from "next/server";
import { getOAuthClient, loadTokens, saveTokens } from "@/lib/google";

export const runtime = "nodejs";

function getRequestBaseUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  const host = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;

  return new URL(req.url).origin;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const baseUrl = getRequestBaseUrl(req);

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin?connected=0&error=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/admin?connected=0&error=${encodeURIComponent("missing_code")}`, baseUrl)
    );
  }

  try {
    const oauth2Client = getOAuthClient(baseUrl);
    const { tokens } = await oauth2Client.getToken(code);

    // garde refresh_token si Google ne le renvoie pas
    const prev = await loadTokens();
    const merged = {
      ...(prev ?? {}),
      ...tokens,
      refresh_token: tokens.refresh_token ?? prev?.refresh_token,
    };

    await saveTokens(merged);

    return NextResponse.redirect(new URL("/admin?connected=1", baseUrl));
  } catch (e) {
    return NextResponse.redirect(
      new URL(`/admin?connected=0&error=${encodeURIComponent("token_exchange_failed")}`, baseUrl)
    );
  }
}
