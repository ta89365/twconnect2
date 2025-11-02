// File: apps/web/src/app/services/page.tsx
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
  href?: string | null; // 舊欄位
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

// Sanity canonical slug（或舊 href 最末段） → 站內實際路由段
const ROUTE_ALIASES: Record<string, string> = {
  "taiwan-market-entry-support": "TaiwanService",
  "market-entry": "TaiwanService", // ← 已加引號
  "visa-residency-support": "visa-residency",
  "overseas-residence-relocation-support": "overseasRelocation",
  "financial-accounting-advisory": "finance-advisory",
};

export const revalidate = 60;

export default async function ServicesPage({
  // Next 15 之後 searchParams 需 await
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const sp = await searchParams;
  const lang = normalizeLang(sp);

  const t = {
    heading: { jp: "サービス内容", zh: "服務內容", en: "Our Services" },
    subheading: {
      jp: "― 専門アドバイザリーチームが台湾進出の第一歩を支援 ―",
      zh: "― 專業顧問團隊支援您踏出進軍臺灣的第一步 ―",
      en: "― Advisors supporting your first step into Taiwan ―",
    },
    ctaText: { jp: "詳細を見る", zh: "詳細資訊", en: "Learn more" },
  };

  // 取資料並加上預設空陣列，避免 null/undefined 導致 map 崩潰
  const rows =
    (await sfetch<SanityServiceCard[]>(servicesLandingByLang, { lang })) ?? [];

  const items: ServiceItem[] = rows.map((r) => {
    const raw = (r.slug && r.slug.trim()) || lastPathSegment(r.href);
    const seg = raw ? ROUTE_ALIASES[raw] ?? raw : "";
    const base = seg ? `/services/${seg}` : "#";
    const href =
      base === "#"
        ? (console.error("[Services] 卡片缺少 slug 與 href：", r), "#")
        : `${base}?lang=${lang}`;

    return {
      ...(r as any),
      href,
    };
  });

  return (
    <div className="min-h-screen bg-[#1C3D5A] text-white">
      {/** @ts-expect-error Async Server Component */}
      <NavigationServer lang={lang} />

      <main className="mx-auto max-w-[1200px] px-4 py-12">
        <h1 className="text-3xl font-semibold">{t.heading[lang]}</h1>
        <p className="mt-2 opacity-80">{t.subheading[lang]}</p>

        {/* 把服務卡片實際渲染出來 */}
        <div className="mt-8">
          <ServiceSection items={items} ctaText={t.ctaText[lang]} />
        </div>
      </main>

      {/** @ts-expect-error Async Server Component */}
      <FooterServer lang={lang} />
    </div>
  );
}
