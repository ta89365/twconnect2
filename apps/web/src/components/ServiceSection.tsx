// apps/web/src/app/components/ServiceSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Lang = "jp" | "zh" | "zh-cn" | "en";

export type ServiceItem = {
  _id: string;
  order?: number | null;
  href?: string | null;
  imageUrl?: string | null;
  title?: string | null;
  desc?: string | null;
};

/* 將 URL 的 ?lang 正規化；簡體一律視為繁體 zh */
function normalizeLang(input?: string | null): Exclude<Lang, "zh-cn"> {
  const k = String(input ?? "").trim().toLowerCase();
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh";
  if (k === "zh" || k === "zh-hant" || k === "zh_tw" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  return "jp";
}

/** 內建多語（不走 Sanity） */
function resolveCopy(lang: Exclude<Lang, "zh-cn">) {
  const dict = {
    jp: {
      heading: "サービス内容",
      subheading: "― 専門アドバイザリーチームが台湾進出や国際ビジネス展開の第一歩を支援 ―",
      cta: "詳細を見る",
      bottomCta: "会社概要を見る",
    },
    zh: {
      heading: "服務內容",
      subheading: "— 專業顧問團隊支援您邁出進軍臺灣與國際業務拓展的第一步 —",
      cta: "查看詳情",
      bottomCta: "公司概要",
    },
    en: {
      heading: "Services",
      subheading: "— Our advisory team supports your first steps into Taiwan and global expansion —",
      cta: "Learn More",
      bottomCta: "Company Overview",
    },
  } as const;

  return dict[lang];
}

/** 判斷是否為不應附掛語言參數的連結 */
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

/** 對站內相對路徑附掛 ?lang=xx；若已帶 lang 則不重複附掛 */
function addLangQuery(href: string, lang: Exclude<Lang, "zh-cn">): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default function ServiceSection({
  items,
  lang,
  heading,
  subheading,
  ctaText,
}: {
  items: ServiceItem[];
  lang?: Lang;
  heading?: string;
  subheading?: string;
  ctaText?: string;
}) {
  if (!items?.length) return null;

  const sp = useSearchParams();
  const urlLang = normalizeLang(sp?.get("lang"));
  const effectiveLang = normalizeLang(lang ?? urlLang);
  const copy = resolveCopy(effectiveLang);

  const toHref = (raw?: string | null) => {
    const href = String(raw ?? "").trim();
    if (!href) return "#";
    if (isBypassLink(href)) return href;
    return addLangQuery(href, effectiveLang);
  };

  const finalBottomHref = addLangQuery("/company", effectiveLang);

  return (
    <section className="relative overflow-hidden bg-[#1C3D5A] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="mt-3 text-sm text-slate-200 sm:text-base">
            {subheading ?? copy.subheading}
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => {
            const finalHref = toHref(it.href);
            return (
              <Link
                key={it._id}
                href={finalHref}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]"
              >
                {it.imageUrl ? (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={it.imageUrl}
                      alt={it.title || ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-slate-700" />
                )}

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h3 className="text-base font-semibold leading-snug text-white">
                    {it.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">
                    {it.desc}
                  </p>

                  <div className="mt-auto pt-4">
                    <span
                      className="
                        inline-flex h-10 items-center justify-center rounded-xl
                        px-4 text-sm font-semibold shadow
                        transition-colors duration-200
                        text-white bg-[#1f2454] hover:bg-[#2b3068]
                      "
                    >
                      {ctaText ?? copy.cta}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 置中的大 CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href={finalBottomHref}
            className="inline-flex items-center rounded-xl px-6 py-3 text-sm sm:text-base font-medium transition
                      text-white bg-[#1f2454] hover:bg-[#2b3068]
                      focus:outline-none focus:ring-2 focus:ring-[#2b3068] focus:ring-offset-2 focus:ring-offset-[#1C3D5A]"
          >
            {copy.bottomCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
