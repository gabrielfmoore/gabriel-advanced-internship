import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function redirectWithAuthError(origin: string, auth: string, message?: string) {
  const params = new URLSearchParams({ auth });
  if (message) {
    params.set("auth_message", message);
  }
  return NextResponse.redirect(`${origin}/?${params}`);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (oauthError) {
    return redirectWithAuthError(origin, oauthError, errorDescription ?? undefined);
  }

  if (!code) {
    return redirectWithAuthError(origin, "cancelled");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithAuthError(origin, "exchange_failed", error.message);
  }

  const next = searchParams.get("next");
  const redirectPath = next?.startsWith("/") ? next : "/for-you";

  return NextResponse.redirect(`${origin}${redirectPath}`);
}
