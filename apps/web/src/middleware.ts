import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // 如果網址裡已經有 lang，就尊重使用者選擇，不再改動
  if (url.searchParams.has("lang")) {
    return NextResponse.next();
  }

  // 使用 twconnects.jp 網域，一律預設成日文
  if (host.endsWith("twconnects.jp")) {
    url.searchParams.set("lang", "jp");
    return NextResponse.redirect(url);
  }

  // 使用 twconnects.com 網域，一律預設成英文
  if (host.endsWith("twconnects.com")) {
    url.searchParams.set("lang", "en");
    return NextResponse.redirect(url);
  }

  // 其他情況照原本邏輯走
  return NextResponse.next();
}
