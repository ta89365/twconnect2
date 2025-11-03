// apps/web/src/app/api/nav-debug/route.ts
import { NextResponse } from "next/server";
import { sfetch } from "@/lib/sanity/fetch";
import {
  servicesNavChildrenQuery,
  cnInvestmentNavChildrenQuery,
} from "@/lib/queries/navChildren.groq";

type Lang = "jp" | "zh" | "zh-cn" | "en";

function normalizeLang(v?: string | null): Lang {
  const k = String(v ?? "").toLowerCase();
  if (k === "jp" || k === "zh" || k === "en") return k as Lang;
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh-cn";
  return "jp";
}

export const revalidate = 0; // 關閉快取，方便即時除錯

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lang = normalizeLang(url.searchParams.get("lang"));
    // only = services | cn | both(預設)
    const onlyRaw = (url.searchParams.get("only") || "").toLowerCase().trim();
    const only: "services" | "cn" | "both" =
      onlyRaw === "services" ? "services" : onlyRaw === "cn" ? "cn" : "both";

    const needServices = only === "services" || only === "both";
    const needCn = only === "cn" || only === "both";

    const [services, cnInvestment] = await Promise.all([
      needServices ? sfetch(servicesNavChildrenQuery, { lang }) : Promise.resolve(null),
      needCn ? sfetch(cnInvestmentNavChildrenQuery, { lang }) : Promise.resolve(null),
    ]);

    return NextResponse.json(
      {
        ok: true,
        hint: {
          howToUse:
            "/api/nav-debug?lang=zh  或  /api/nav-debug?only=services&lang=jp  或  /api/nav-debug?only=cn&lang=zh-cn",
          note: "如果 label 出現備援詞，表示對應文件的標題欄位為空或欄位名不匹配，請回 Sanity 檢查。",
        },
        query: { lang, only },
        result: {
          services, // 來源：_type == "service"
          cnInvestment, // 來源：四個中資相關 doc
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}
