// apps/web/src/components/CrossBorderSection.tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.image";
import React from "react";

/* =====================================
 * Data contracts
 * ===================================== */
export type CrossBorderData = {
  heading?: string | null;
  lead1?: string | null;
  lead2?: string | null;
  body?: string | null;
  bgUrl?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;

  leftPillar?: { title?: string | null; items?: string[] | null; href?: string | null } | null;
  rightPillar?: { title?: string | null; items?: string[] | null; href?: string | null } | null;

  cta2Text?: string | null;
  cta2Href?: string | null;
};

export type CrossBorderTune = {
  containerAlign?: "left" | "center" | "right";
  offsetYvh?: number;
  blockOffsets?: {
    heading?: { xRem?: number; yRem?: number };
    lead1?: { xRem?: number; yRem?: number };
    lead2?: { xRem?: number; yRem?: number };
    body?: { xRem?: number; yRem?: number };
    cta?: { xRem?: number; yRem?: number };
  };
};

type Lang = "jp" | "zh" | "en";

/* =====================================
 * Utils
 * ===================================== */
function isBypassLink(href?: string | null): boolean {
  const s = String(href ?? "").trim().toLowerCase();
  if (!s) return true;
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("mailto:") || s.startsWith("tel:") || s.startsWith("#");
}
function addLangQuery(href: string, lang: Lang): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}
const BRAND_BLUE = "#1C3D5A";

/* =====================================
 * 括號後自動換行（並靠左對齊）
 * ===================================== */
function renderBullet(text?: string) {
  if (!text) return null;
  const fullIdx = text.indexOf("（");
  const halfIdx = text.indexOf("(");
  const i = fullIdx >= 0 ? fullIdx : halfIdx;
  if (i > 0) {
    const head = text.slice(0, i).trim();
    const tail = text.slice(i).trim(); // 含括號本身
    return (
      <>
        <span className="block text-left">{head}</span>
        <span className="block text-left text-white/80 text-[0.95rem] leading-7">{tail}</span>
      </>
    );
  }
  return <span className="block text-left">{text}</span>;
}

/* =====================================
 * Component
 * ===================================== */
export default function CrossBorderSection({
  data,
  tune,
  lang,
}: {
  data: CrossBorderData | null;
  tune?: CrossBorderTune;
  lang: Lang;
}) {
  const bg = data?.bgUrl ? urlFor(data.bgUrl) : null;

  const align =
    tune?.containerAlign === "right"
      ? { wrapper: "items-end text-right", inner: "items-end" }
      : tune?.containerAlign === "center"
      ? { wrapper: "items-center text-center", inner: "items-center" }
      : { wrapper: "items-start text-left", inner: "items-start" };

  const overallTranslate = { transform: `translateY(${tune?.offsetYvh ?? 0}vh)` };
  const posStyle = (key: keyof NonNullable<CrossBorderTune["blockOffsets"]>) => {
    const x = tune?.blockOffsets?.[key]?.xRem ?? 0;
    const y = tune?.blockOffsets?.[key]?.yRem ?? 0;
    return { transform: `translate(${x}rem, ${y}rem)` };
  };

  const ctaHrefFinal =
    data?.ctaHref && !isBypassLink(data.ctaHref) ? addLangQuery(data.ctaHref, lang) : data?.ctaHref ?? "#";
  const cta2HrefFinal =
    data?.cta2Href && !isBypassLink(data?.cta2Href) ? addLangQuery(data?.cta2Href, lang) : data?.cta2Href ?? "";

  const leftHrefFinal =
    data?.leftPillar?.href && !isBypassLink(data.leftPillar.href)
      ? addLangQuery(data.leftPillar.href, lang)
      : data?.leftPillar?.href ?? "";
  const rightHrefFinal =
    data?.rightPillar?.href && !isBypassLink(data.rightPillar.href)
      ? addLangQuery(data.rightPillar.href, lang)
      : data?.rightPillar?.href ?? "";

  const showTwinCards =
    (data?.leftPillar && (data.leftPillar.title || (data.leftPillar.items || []).length > 0)) ||
    (data?.rightPillar && (data.rightPillar.title || (data.rightPillar.items || []).length > 0));

  return (
    <section
      className={`relative isolate w-full min-h-[92vh] overflow-hidden flex justify-center ${align.wrapper}`}
      aria-label="Cross-border support section"
    >
      {/* 背景層 */}
      <div className="absolute inset-0 -z-20" style={{ backgroundColor: BRAND_BLUE }} />
      <div className="absolute inset-0 -z-10">
        {bg && (
          <Image
            src={bg}
            alt="Cross-border service background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_45%]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_35%,rgba(0,0,0,0.55))]" />
      </div>

      {/* 內容層 */}
      <div className={`mx-auto w-full max-w-[1200px] px-6 pt-20 md:pt-24 pb-14 flex flex-col gap-4 ${align.inner}`} style={overallTranslate}>
        {data?.heading && (
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm" style={posStyle("heading")}>
            {data.heading}
          </h2>
        )}
        {data?.lead1 && (
          <div className="inline-block rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base text-white/95 backdrop-blur" style={posStyle("lead1")}>
            {data.lead1}
          </div>
        )}
        {data?.lead2 && (
          <div className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm" style={posStyle("lead2")}>
            {data.lead2}
          </div>
        )}

        {/* 左右雙卡：中間留塔身保護區；右欄更寬 */}
        {showTwinCards && (
          <div
            className={[
              "mt-6 w-full grid gap-4 sm:gap-5 md:gap-6 lg:gap-8",
              "grid-cols-1",
              // 右側加寬：md 起 1fr | 保護區 | 1.2fr；lg 起 1.3fr；xl 起 1.4fr
              "md:grid-cols-[1fr_220px_1.2fr]",
              "lg:grid-cols-[1fr_260px_1.3fr]",
              "xl:grid-cols-[1fr_300px_1.4fr]",
            ].join(" ")}
          >
            {/* Left card */}
            {data?.leftPillar && (data.leftPillar.title || (data.leftPillar.items || []).length > 0) ? (
              <article className="rounded-2xl border border-white/14 bg-white/[0.10] text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md p-5 md:p-6">
                <header className="mb-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white/16 px-3 py-1 ring-1 ring-white/20">
                    <span className="text-sm font-semibold">
                      {data.leftPillar.title ?? (lang === "jp" ? "財務・会計アドバイザリー" : lang === "en" ? "Financial & Accounting Advisory" : "財務會計顧問")}
                    </span>
                  </div>
                </header>
                {(data.leftPillar.items || []).length > 0 && (
                  <ul className="mt-2.5 space-y-2">
                    {data.leftPillar.items!.slice(0, 6).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden />
                        <span className="text-white/90 leading-7 w-full">{renderBullet(t)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {leftHrefFinal && (
                  <div className="mt-4">
                    <Link
                      href={leftHrefFinal}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold"
                      style={{ border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      {lang === "jp" ? "詳しく見る" : lang === "en" ? "Learn more" : "了解更多"}
                    </Link>
                  </div>
                )}
              </article>
            ) : <div />}

            {/* 中間保護區：避免壓到東京鐵塔 */}
            <div className="hidden md:block" aria-hidden="true" />

            {/* Right card（加寬） */}
            {data?.rightPillar && (data.rightPillar.title || (data.rightPillar.items || []).length > 0) ? (
              <article className="rounded-2xl border border-white/14 bg-white/[0.10] text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md p-5 md:p-6">
                <header className="mb-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white/16 px-3 py-1 ring-1 ring-white/20">
                    <span className="text-sm font-semibold">
                      {data.rightPillar.title ?? (lang === "jp" ? "海外展開支援" : lang === "en" ? "Overseas Expansion Support" : "海外發展支援")}
                    </span>
                  </div>
                </header>
                {(data.rightPillar.items || []).length > 0 && (
                  <ul className="mt-2.5 space-y-2">
                    {data.rightPillar.items!.slice(0, 8).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden />
                        <span className="text-white/90 leading-7 w-full">{renderBullet(t)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {rightHrefFinal && (
                  <div className="mt-4">
                    <Link
                      href={rightHrefFinal}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                      style={{ border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      {lang === "jp" ? "お問い合わせ" : lang === "en" ? "Contact us" : "聯絡我們"}
                    </Link>
                  </div>
                )}
              </article>
            ) : <div />}
          </div>
        )}

        {/* 放大 CTA（維持） */}
        {(data?.ctaText && data?.ctaHref) || (data?.cta2Text && data?.cta2Href) ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" style={posStyle("cta")}>
            {data?.ctaText && data?.ctaHref ? (
              <Link
                href={ctaHrefFinal}
                className="inline-flex items-center justify-center rounded-2xl px-6 md:px-7 lg:px-8 py-3.5 md:py-4 text-base md:text-lg font-semibold shadow-lg"
                style={{ backgroundColor: "#ffffff", color: BRAND_BLUE, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
              >
                {data.ctaText}
              </Link>
            ) : null}
            {data?.cta2Text && data?.cta2Href ? (
              <Link
                href={cta2HrefFinal}
                className="inline-flex items-center justify-center rounded-2xl px-6 md:px-7 lg:px-8 py-3.5 md:py-4 text-base md:text-lg font-semibold text-white"
                style={{ border: "1px solid rgba(255,255,255,0.28)", backgroundColor: "rgba(255,255,255,0.10)", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
              >
                {data.cta2Text}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
