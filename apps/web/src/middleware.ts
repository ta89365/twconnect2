import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 只在「頁面」上跑 middleware，排除靜態資源與 Next.js 內部路徑
export const config = {
  matcher: [
    "/((?!_next|api|.*\\..*).*)",
  ],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // 已經有 lang 就不動
  if (url.searchParams.has("lang")) {
    return NextResponse.next();
  }

  // 依網域預設語言，只針對頁面做 redirect
  if (host.endsWith("twconnects.jp")) {
    url.searchParams.set("lang", "jp");
    return NextResponse.redirect(url);
  }

  if (host.endsWith("twconnects.com")) {
    url.searchParams.set("lang", "en");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
