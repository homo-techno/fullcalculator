import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redirectMap from "../redirect-map.json";

const slugToCategory = redirectMap as Record<string, string>;

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only handle single-segment paths (old flat calculator URLs)
  if (path.startsWith("/_next") || path.startsWith("/api") || path.includes(".")) {
    return NextResponse.next();
  }

  const slug = path.replace(/^\//, "").replace(/\/$/, "");

  // Skip if path has multiple segments (already nested or category page)
  if (slug.includes("/")) {
    return NextResponse.next();
  }

  const categorySlug = slugToCategory[slug];
  if (categorySlug) {
    const url = new URL(`/${categorySlug}/${slug}`, request.url);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and internal Next.js routes
    "/((?!_next/static|_next/image|favicon.ico|icon.png).*)",
  ],
};
