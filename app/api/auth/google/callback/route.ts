import { NextResponse } from "next/server";
import { getOAuthClient, loadTokens, saveTokens } from "@/lib/google";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    // Google renvoie parfois access_denied si l'utilisateur annule
    return NextResponse.redirect(new URL(`/admin?connected=0&error=${encodeURIComponent(error)}`, url.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/admin?connected=0&error=${encodeURIComponent("missing_code")}`, url.origin));
  }

  try {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    // ✅ important : si refresh_token absent, on garde l'ancien
    const prev = loadTokens();
    const merged = {
      ...(prev ?? {}),
      ...tokens,
      refresh_token: tokens.refresh_token ?? prev?.refresh_token,
    };

    saveTokens(merged);

    return NextResponse.redirect(new URL("/admin?connected=1", url.origin));
  } catch (e) {
    return NextResponse.redirect(new URL(`/admin?connected=0&error=${encodeURIComponent("token_exchange_failed")}`, url.origin));
  }
}
