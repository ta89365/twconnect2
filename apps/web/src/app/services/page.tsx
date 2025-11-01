// C:\Users\ta893\twconnect2\apps\web\src\app\services\page.tsx
import ServiceSection, { type ServiceItem } from "@/components/ServiceSection";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { servicesLandingByLang } from "@/lib/queries/servicesLanding";

type Lang = "jp" | "zh" | "en";

function normalizeLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

type SanityServiceCard = {
  _id: string;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  coverImage?: { url?: string | null } | null;
  href?: string | null; // 舊欄位（有些卡片只有這個）
  order?: number;
};

function lastPathSegment(href?: string | null) {
  if (!href) return undefined;
  const txt = href.trim();
  if (!txt) return undefined;
  const path = txt.startsWith("/") ? txt : "/" + txt;
  const segs = path.split("/").filter(Boolean);
  return segs[segs.length - 1];
}

// ★ 靜態路由別名表：Sanity canonical slug（或舊 href 最末段） → 站內實際路由段
const ROUTE_ALIASES: Record<string, string> = {
  // 第一個服務 → 指到靜態路由 /services/TaiwanService
  "taiwan-market-entry-support": "TaiwanService",
  "market-entry": "TaiwanService",

  // 第二個服務 → 簽證／居留支援
  "visa-residency-support": "visa-residency",

  // 第三個服務 → 海外居住／移居支援
  "overseas-residence-relocation-support": "overseasRelocation",

  // ✅ 第四個服務 → 財務・会計アドバイザリー／海外展開支援
  "financial-accounting-advisory": "finance-advisory",
};

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: { lang?: string  };
}) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await searchParams
      : (searchParams as { lang?: string | string[] } | undefined);

  const lang = normalizeLang(spRaw);

  const t = {
    heading: { jp: "サービス内容", zh: "服務內容", en: "Our Services" },
    subheading: {
      jp: "― 専門アドバイザリーチームが台湾進出の第一歩を支援 ―",
      zh: "― 專業顧問團隊支援您踏出進軍臺灣的第一步 ―",
      en: "― Advisors supporting your first step into Taiwan ―",
    },
    ctaText: { jp: "詳細を見る", zh: "詳細資訊", en: "Learn more" },
  };

  // 從 Sanity 取清單（內含 slug 或舊 href）
  const rows = await sfetch<SanityServiceCard[]>(servicesLandingByLang, { lang });

  const items: ServiceItem[] = rows.map((r) => {
    // 取 canonical slug；若無則從舊 href 取最後一段
    const raw = (r.slug && r.slug.trim()) || lastPathSegment(r.href);
    const seg = raw ? (ROUTE_ALIASES[raw] ?? raw) : "";

    const base = seg ? `/services/${seg}` : "#";
    const href =
      base === "#"
        ? (console.error("[Services] 此卡片缺 slug 且無法決定連結：", r), "#")
        : `${base}?lang=${lang}`; // 帶上語言參數

    return {
      ...(r as any),
      href,
    };
  });

  return (
    <div className="min-h-screen bg-[#1C3D5A] text-white">
      {/* 導覽列 */}
      {/** @ts-expect-error Async Server Component */}
      <NavigationServer lang={lang} />

      {/* 內容本體 ... */}

      {/* Footer */}
      {/** @ts-expect-error Async Server Component */}
      <FooterServer lang={lang} />
    </div>
  );
}
