import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  routeKeyForSlug,
  slugs,
  type Locale,
} from "@/i18n/config";

/** Picks the best supported locale from the Accept-Language header. */
function preferredLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return {
        lang: tag.trim().toLowerCase().split("-")[0],
        q: q ? Number.parseFloat(q.slice(2)) : 1,
        index,
      };
    })
    .filter((entry) => entry.lang && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  const match = ranked.find((entry) => isLocale(entry.lang));
  return match ? (match.lang as Locale) : defaultLocale;
}

function redirectTo(request: NextRequest, pathname: string, status: 307 | 308) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url, status);
  if (status === 307) response.headers.set("Vary", "Accept-Language");
  return response;
}

/**
 * Locale routing:
 * - "/" and any path without a locale prefix redirect to the visitor's
 *   browser language, falling back to English.
 * - A page slug from the other language is mapped to its equivalent
 *   ("/fr/schools" to "/fr/ecoles", "/schools" to "/fr/ecoles" for French).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const [first, second, ...rest] = segments;

  if (isLocale(first)) {
    if (second) {
      const key = routeKeyForSlug(second);
      if (key && slugs[key][first] !== second) {
        return redirectTo(request, ["", first, slugs[key][first], ...rest].join("/"), 308);
      }
    }
    return NextResponse.next();
  }

  const locale = preferredLocale(request.headers.get("accept-language"));
  if (!first) return redirectTo(request, `/${locale}`, 307);

  const key = routeKeyForSlug(first);
  const mapped = key ? [slugs[key][locale], second, ...rest] : segments;
  return redirectTo(request, ["", locale, ...mapped.filter(Boolean)].join("/"), 307);
}

export const config = {
  // Skip Next internals and any request for a file (anything with a dot).
  matcher: ["/((?!_next|.*[.].*).*)"],
};
