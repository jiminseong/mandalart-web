import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Handle routing/locale only — the app is fully client-side, no auth/session.
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ko|en)/:path*"],
};
