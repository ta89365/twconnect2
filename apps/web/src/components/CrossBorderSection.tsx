// apps/web/src/components/CrossBorderSection.tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.image";

export type CrossBorderData = {
  heading?: string | null;
  lead1?: string | null;
  lead2?: string | null;
  body?: string | null;
  bgUrl?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;
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

/** 不應附掛語言參數的連結 */
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
function addLangQuery(href: string, lang: Lang): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default function CrossBorderSection({
  data,
  tune,
  lang, // ✅ 新增：用於附掛語言參數
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

  // ✅ 計算 CTA 最終 href
  const ctaHrefFinal =
    data?.ctaHref && !isBypassLink(data.ctaHref)
      ? addLangQuery(data.ctaHref, lang)
      : data?.ctaHref ?? "#";

  return (
    <section
      className={`relative isolate w-full min-h-[90vh] overflow-hidden flex justify-center ${align.wrapper}`}
      aria-label="Cross-border support section"
    >
      {/* ===== 背景層 ===== */}
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

        <div className="absolute inset-0 bg-[#1C3D5A]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        {/* ★ 弧線光軌 */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none mix-blend-screen"
          viewBox="0 0 1440 900"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="cbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(210 100% 85%)" stopOpacity="1" />
              <stop offset="40%" stopColor="hsl(210 100% 70%)" stopOpacity=".85" />
              <stop offset="100%" stopColor="hsl(210 100% 65%)" stopOpacity="0" />
            </radialGradient>
            <filter id="cbBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          </defs>

          <path
            className="cb-arc cb-arc--thick animate-cb-dash"
            vectorEffect="non-scaling-stroke"
            style={
              {
                ["--arc-len" as any]: 1100,
                ["--arc-speed" as any]: "20s",
              } as React.CSSProperties
            }
            d="M 115 850 C 500 740, 760 660, 1180 580"
          />
          <g
            filter="url(#cbBlur)"
            className="animate-cb-glow"
            style={{ animationDuration: "20s", animationTimingFunction: "ease-in-out" }}
          >
            <circle cx="1180" cy="580" r="22" fill="url(#cbGlow)" />
          </g>

          <path
            className="cb-arc animate-cb-dash"
            vectorEffect="non-scaling-stroke"
            style={
              {
                ["--arc-len" as any]: 1000,
                ["--arc-speed" as any]: "14s",
              } as React.CSSProperties
            }
            d="M 1320 160 C 1150 220, 960 500, 120 550"
          />
          <g
            filter="url(#cbBlur)"
            className="animate-cb-glow"
            style={{ animationDuration: "20s", animationTimingFunction: "ease-in-out" }}
          >
            <circle cx="120" cy="550" r="22" fill="url(#cbGlow)" />
          </g>
        </svg>
      </div>

      {/* ===== 內容層 ===== */}
      <div
        className={`mx-auto max-w-6xl px-6 py-20 sm:py-28 md:py-32 flex flex-col gap-4 ${align.inner}`}
        style={overallTranslate}
      >
        {data?.heading && (
          <h2
            className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md"
            style={posStyle("heading")}
          >
            {data.heading}
          </h2>
        )}

        {data?.lead1 && (
          <div
            className="inline-block rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-base text-white backdrop-blur-md shadow-sm whitespace-pre-line"
            style={posStyle("lead1")}
          >
            {data.lead1}
          </div>
        )}

        {data?.lead2 && (
          <div
            className="inline-block rounded-2xl border border-white/20 bg-white/10 px-6 py-2 text-sm text-slate-200 backdrop-blur-sm whitespace-pre-line"
            style={posStyle("lead2")}
          >
            {data.lead2}
          </div>
        )}

        {data?.body && (
          <p
            className="max-w-3xl whitespace-pre-line text-slate-200/95 leading-relaxed drop-shadow-sm"
            style={posStyle("body")}
          >
            {data.body}
          </p>
        )}

        {/* ===== CTA 按鈕（語言參數已處理） ===== */}
        {data?.ctaText && data?.ctaHref && (
          <div className="mt-10" style={posStyle("cta")}>
            <Link
              href={ctaHrefFinal}
              className="inline-block rounded-xl px-6 py-3 font-semibold text-white shadow-md
                         bg-[#4A90E2] hover:bg-[#5AA2F0]
                         focus:outline-none focus:ring-4 focus:ring-[#5AA2F0]/40 transition-colors duration-200"
            >
              {data.ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
