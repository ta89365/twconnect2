// File: apps/web/src/app/services/page.tsx
import ServiceSection, { type ServiceItem } from "@/components/ServiceSection";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { servicesLandingByLang } from "@/lib/queries/servicesLanding";

type Lang = "jp" | "zh" | "en";

/** 語言參數正規化 */
function normalizeLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

/** Sanity 回傳卡片型別 */
type SanityServiceCard = {
  _id: string;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;                     // 有些 GROQ 已直接定義為 imageUrl
  coverImage?: { url?: string | null } | null;  // 若為物件
  coverImageUrl?: string | null;                // 或簡化路徑
  href?: string | null;
  order?: number;
};

/** 取得網址最後一段（例如 /services/xxx => xxx） */
function lastPathSegment(href?: string | null) {
  if (!href) return undefined;
  const txt = href.trim();
  if (!txt) return undefined;
  const path = txt.startsWith("/") ? txt : "/" + txt;
  const segs = path.split("/").filter(Boolean);
  return segs[segs.length - 1];
}

/** slug 別名表 */
const ROUTE_ALIASES: Record<string, string> = {
  "taiwan-market-entry-support": "TaiwanService",
  "market-entry": "TaiwanService",
  "visa-residency-support": "visa-residency",
  "overseas-residence-relocation-support": "overseasRelocation",
  "financial-accounting-advisory": "finance-advisory",
};

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: { lang?: string | string[] } | Promise<{ lang?: string | string[] }>;
}) {
  // 同時支援 Promise 型與物件型 searchParams
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string | string[] }>)
      : ((searchParams ?? {}) as { lang?: string | string[] });

  const lang = normalizeLang(sp);

  // 從 Sanity 取資料
  const rows =
    (await sfetch<SanityServiceCard[]>(servicesLandingByLang, { lang })) ?? [];

  // 正規化卡片
  const items: ServiceItem[] = rows.map((r) => {
    const raw = (r.slug && r.slug.trim()) || lastPathSegment(r.href);
    const seg = raw ? ROUTE_ALIASES[raw] ?? raw : "";
    const base = seg ? `/services/${seg}` : "#";
    const href =
      base === "#"
        ? (console.error("[Services] 卡片缺少 slug 與 href：", r), "#")
        : `${base}?lang=${lang}`;

    // ✅ 縮圖容錯：三種來源都檢查
    const img =
      r.imageUrl ??
      r.coverImage?.url ??
      (r as any).coverImageUrl ??
      null;

    return {
      _id: r._id,
      order: r.order ?? null,
      href,
      imageUrl: img,
      title: r.title ?? "",
      desc: r.excerpt ?? "",
    };
  });

  return (
    <div className="min-h-screen bg-[#1C3D5A] text-white">
      {/* 導覽列 */}
      {await NavigationServer({ lang })}

      {/* 主內容：直接使用首頁同款 ServiceSection，不再重複顯示標題 */}
      <ServiceSection items={items} />

      {/* 頁尾 */}
      {await FooterServer({ lang })}
    </div>
  );
}
