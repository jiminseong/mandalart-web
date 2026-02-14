// import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Run intl middleware first to handle routing/locale
  const response = intlMiddleware(request);

  // 2. Initialize Supabase client to manage session/cookies
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         cookiesToSet.forEach(({ name, value, options }) => {
  //           request.cookies.set(name, value);
  //           response.cookies.set(name, value, options);
  //         });
  //       },
  //     },
  //   },
  // );

  // 3. Refresh session if needed
  // This updates the request.cookies (for Server Components) and response.cookies (for User)
  // await supabase.auth.getUser();

  return response;
}

export const config = {
  // Matcher ignoring _next, api, etc.
  matcher: ["/", "/(ko|en)/:path*"],
};
