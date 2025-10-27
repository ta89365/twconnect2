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

export default function CrossBorderSection({
  data,
  tune,
}: {
  data: CrossBorderData | null;
  tune?: CrossBorderTune;
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

        {/* overlays 先渲染 */}
        <div className="absolute inset-0 bg-[#1C3D5A]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        {/* ★ 弧線光軌（放在 overlays 之後，才不會被蓋住） */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none mix-blend-screen"
          viewBox="0 0 1440 900"
          aria-hidden="true"
        >
          <defs>
            {/* 端點光芒：柔和藍色放射 */}
            <radialGradient id="cbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="hsl(210 100% 85%)" stopOpacity="1" />
              <stop offset="40%" stopColor="hsl(210 100% 70%)" stopOpacity=".85" />
              <stop offset="100%" stopColor="hsl(210 100% 65%)" stopOpacity="0" />
            </radialGradient>
            {/* 輕微高斯模糊讓光更柔 */}
            <filter id="cbBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          </defs>

          {/* ── 弧線 1：中位弧（較粗）── */}
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
          {/* 端點光芒（弧線 1 的終點：對應上方 path 的最後座標 1180,580） */}
          <g
            filter="url(#cbBlur)"
            className="animate-cb-glow"
            style={{ animationDuration: "20s", animationTimingFunction: "ease-in-out" }}
          >
            <circle cx="1180" cy="580" r="22" fill="url(#cbGlow)" />
          </g>

          {/* ── 弧線 2：低位弧（靠近天際線）── */}
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
          {/* 端點光芒（弧線 2 的終點：對應上方 path 的最後座標 120,550） */}
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

        {data?.ctaText && data?.ctaHref && (
          <div className="mt-10" style={posStyle("cta")}>
            <Link
              href={data.ctaHref}
              className="inline-block rounded-xl border border-white/15 bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-colors duration-200"
            >
              {data.ctaText}
            </Link>
          </div>
        )}
      </div>

      {/* ===== 右下角品牌標語 ===== */}
      <div className="absolute bottom-12 right-12 text-white/70 text-base md:text-lg tracking-wider select-none pointer-events-none drop-shadow-sm">
        台湾・日本・アメリカをつなぐ専門ネットワーク
      </div>
    </section>
  );
}
