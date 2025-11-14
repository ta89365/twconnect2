// File: apps/web/src/app/services/page.tsx

import Image from "next/image";
import Link from "next/link";

import type { ServiceItem } from "@/components/ServiceSection";
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

/** 和 ServiceSection 對齊的後端 row 型別 */
type RawServiceRow = ServiceItem & {
  slug?: string | null;
  excerpt?: string | null;
  coverImage?: { url?: string | null } | null;
  coverImageUrl?: string | null;
};

/** 連結是否直接略過處理 */
function isBypassLink(href?: string | null): boolean {
  const s = String(href ?? "").trim().toLowerCase();
  if (!s) return true;
  return (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("mailto:") ||
    s.startsWith("tel:") ||
    s.startsWith("#")
  );
}

/** 加上 ?lang 查詢參數 */
function addLangQuery(href: string, lang: Lang): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

const copyDict: Record<
  Lang,
  { heading: string; subheading: string; cta: string }
> = {
  jp: {
    heading: "サービス内容",
    subheading:
      "― 専門アドバイザリーチームが台湾進出や国際ビジネス展開の第一歩を支援 ―",
    cta: "詳細を見る",
  },
  zh: {
    heading: "服務內容",
    subheading:
      "— 專業顧問團隊支援您邁出進軍臺灣與國際業務拓展的第一步 —",
    cta: "了解方案",
  },
  en: {
    heading: "Services",
    subheading:
      "— Our advisory team supports your first steps into Taiwan and global expansion —",
    cta: "Learn More",
  },
};

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?:
    | { lang?: string | string[] }
    | Promise<{ lang?: string | string[] }>;
}) {
  // 同時支援 Promise 型與物件型 searchParams
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string | string[] }>)
      : ((searchParams ?? {}) as { lang?: string | string[] });

  const lang = normalizeLang(sp);
  const copy = copyDict[lang];

  // 從 Sanity 取資料：直接用和 ServiceSection 對齊的型別
  const rows =
    (await sfetch<RawServiceRow[]>(servicesLandingByLang, { lang })) ?? [];

  // 正規化卡片資料
  const items: ServiceItem[] = rows.map((r) => {
    // 圖片容錯，三種來源
    const img =
      r.imageUrl ??
      r.coverImage?.url ??
      r.coverImageUrl ??
      null;

    // 說明文字優先用 desc，沒有再退回 excerpt
    const desc = r.desc ?? r.excerpt ?? "";

    return {
      _id: r._id,
      order: r.order ?? null,
      href: r.href,
      imageUrl: img,
      title: r.title ?? "",
      desc,
    };
  });

  // 依 order 排序，和首頁邏輯一致
  const sortedItems = [...items].sort((a, b) => {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    return ao - bo;
  });

  // 產出 href，加上多語 lang
  const toHref = (raw?: string | null): string => {
    const href = String(raw ?? "").trim();
    if (!href) return "#";
    if (isBypassLink(href)) return href;
    return addLangQuery(href, lang);
  };

  const CARD_H = "h-[380px]";

  return (
    <div className="min-h-screen bg-[#1C3D5A] text-white">
      {/* 導覽列 */}
      {await NavigationServer({ lang })}

      {/* 主內容：三張小卡置中版型 */}
      <main className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          {/* 標題區置中 */}
          <div className="mb-10 text-center sm:mb-12">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {copy.heading}
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              {copy.subheading}
            </p>
          </div>

          {/* 卡片區：三張卡片整排置中 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {sortedItems.map((it) => {
              const finalHref = toHref(it.href);
              return (
                <Link
                  key={it._id}
                  href={finalHref}
                  className={`
                    group relative flex flex-col overflow-hidden rounded-2xl
                    bg-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/10
                    transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]
                    w-full max-w-xs ${CARD_H}
                  `}
                >
                  {it.imageUrl ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={it.imageUrl}
                        alt={it.title || ""}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 1280px) 260px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-slate-700" />
                  )}

                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <h2 className="text-base font-semibold leading-snug text-white">
                      {it.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200 line-clamp-4">
                      {it.desc}
                    </p>

                    <div className="mt-auto pt-4 flex justify-center">
                      <span
                        className="
                          inline-flex h-10 items-center justify-center rounded-xl
                          px-4 text-sm font-semibold shadow
                          transition-colors duration-200
                          text-white bg-[#1f2454] group-hover:bg-[#2b3068]
                        "
                      >
                        {copy.cta}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* 頁尾 */}
      {await FooterServer({ lang })}
    </div>
  );
}
