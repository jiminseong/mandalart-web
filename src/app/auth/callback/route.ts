import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  // Check if this is a password recovery request (from Supabase verify endpoint)
  if (token && type === "recovery") {
    const supabase = await createClient();
    // Verify the token and set the session
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (!error) {
      // Redirect to password reset page
      return NextResponse.redirect(`${origin}/ko/reset-password`);
    } else {
      console.error("Recovery token verification failed:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=invalid_recovery_token`);
    }
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Check if this is a password recovery callback (hash-based)
  const hash = new URL(request.url).hash;
  if (hash && hash.includes("type=recovery")) {
    // Extract access_token from hash
    const hashParams = new URLSearchParams(hash.substring(1));
    const accessToken = hashParams.get("access_token");
    if (accessToken) {
      return NextResponse.redirect(`${origin}/ko/reset-password#access_token=${accessToken}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
