// apps/web/src/components/hero-banner.tsx
import Image from "next/image";
import Link from "next/link";

type Lang = "jp" | "zh" | "en";

type HeroData = {
  heading?: string;
  subheading?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string; // Sanity：站內相對路徑或外部完整網址
  bgUrl?: string;
  hotspot?: { x: number; y: number } | null;
};

type Offset = { xRem: number; yRem: number };

type Tune = {
  heroContentOffsetVh: number;
  heroLeftPadRem: { base: number; md: number; lg: number };
  heroMaxWidth: string;
  heroObjectPos: string;
  heroObjectPosY?: string;
  headingSizes: string;
  subTextSize: string;
  textColorClass: string;
  ribbonRounded: string;
  ribbonBg: string;
  ctaTopMarginClass: string;
  blockOffsets?: {
    heading?: Offset;
    subheading?: Offset;
    subtitle?: Offset;
    cta?: Offset;
  };
  forceTopVh?: boolean;
  shiftVh?: number;
};

/** 外部或不需處理的連結判斷 */
function isBypassLink(href?: string): boolean {
  if (!href) return true;
  const s = href.trim().toLowerCase();
  if (!s) return true;
  return (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("mailto:") ||
    s.startsWith("tel:") ||
    s.startsWith("#")
  );
}

/** ✅ 將 ?lang=xx 附掛到站內相對路徑；若已帶 lang 則不重複附掛 */
function withLangQuery(href: string, lang: Lang): string {
  if (isBypassLink(href)) return href;
  if (!href.startsWith("/")) return href;

  // 已經帶有 lang 參數就不再附掛
  if (/[?&]lang=/.test(href)) return href;

  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default function HeroBanner({
  data,
  navHeight = 72,
  tune,
  lang,
}: {
  data?: HeroData;
  navHeight?: number;
  tune: Tune;
  lang: Lang;
}) {
  const objectPosition = tune.heroObjectPosY
    ? `${tune.heroObjectPos} ${tune.heroObjectPosY}`
    : tune.heroObjectPos;

  const defaults: Required<Required<Tune>["blockOffsets"]> = {
    heading: { xRem: 0, yRem: 0 },
    subheading: { xRem: 0, yRem: 0 },
    subtitle: { xRem: 0, yRem: 0 },
    cta: { xRem: 0, yRem: 0 },
  };
  const raw = { ...defaults, ...(tune.blockOffsets ?? {}) };

  const baseX = raw.heading.xRem;
  const blocks = {
    heading: raw.heading,
    subheading: { xRem: raw.subheading.xRem ?? baseX, yRem: raw.subheading.yRem },
    subtitle: { xRem: raw.subtitle.xRem ?? baseX, yRem: raw.subtitle.yRem },
    cta: { xRem: raw.cta.xRem ?? baseX, yRem: raw.cta.yRem },
  };

  const move = (o?: Offset) => ({
    transform: `translate(${o?.xRem ?? 0}rem, ${o?.yRem ?? 0}rem)`,
  });

  const SHADOW = { color: "rgba(0,0,0,0.65)", blur: 10 };
  const textShadow = `0 2px ${SHADOW.blur}px ${SHADOW.color}`;

  const containerBaseClass = "mx-auto h-full flex px-4 sm:px-6 lg:px-8";
  const containerAlignClass = tune.forceTopVh ? "items-start" : "items-center";
  const containerJustifyClass = "justify-center";

  const shift = typeof tune.shiftVh === "number" ? tune.shiftVh : 12;

  const containerStyle: React.CSSProperties = {
    maxWidth: tune.heroMaxWidth,
    paddingTop: tune.forceTopVh
      ? `max(${navHeight + 8}px, ${tune.heroContentOffsetVh}vh)`
      : undefined,
    transform: `translateY(${shift}vh)`,
  };

  // ✅ 產出最終 CTA：站內自動附掛 ?lang=，外部維持原樣
  const ctaHrefFinal =
    data?.ctaHref && lang ? withLangQuery(data.ctaHref, lang) : data?.ctaHref ?? "";

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-black"
      style={{ height: `calc(100lvh - ${navHeight}px)` }}
    >
      {data?.bgUrl && (
        <Image
          src={data.bgUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition }}
        />
      )}

      <div className="absolute inset-0 z-20">
        <div
          className={`${containerBaseClass} ${containerAlignClass} ${containerJustifyClass}`}
          style={containerStyle}
        >
          <div className="w-full text-white text-center flex flex-col items-center">
            {data?.heading && (
              <div style={move(blocks.heading)}>
                <h1
                  className="font-extrabold leading-[1.1] tracking-normal"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    textShadow,
                    maxWidth: "22ch",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {data.heading}
                </h1>
              </div>
            )}

            {data?.subheading && (
              <div style={move(blocks.subheading)}>
                <p
                  className="mt-4 font-semibold"
                  style={{
                    fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
                    opacity: 0.95,
                    textShadow,
                    maxWidth: "60ch",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {data.subheading}
                </p>
              </div>
            )}

            {data?.subtitle && (
              <div style={move(blocks.subtitle)}>
                <p
                  className="mt-3 font-semibold leading-snug"
                  style={{
                    opacity: 0.9,
                    textShadow,
                    maxWidth: "70ch",
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
                  }}
                >
                  <span className="whitespace-pre-wrap">{data.subtitle}</span>
                </p>
              </div>
            )}

            {data?.ctaText && data?.ctaHref && (
              <div style={move(blocks.cta)}>
                <Link
                  href={ctaHrefFinal}
                  className="mt-8 inline-flex items-center justify-center rounded-xl text-center font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-[#2a5882]"
                  style={{
                    fontSize: "1.125rem",
                    minWidth: "min(260px, 80vw)",
                    height: "4.2rem",
                    padding: "0 2rem",
                    backgroundColor: "#1C3D5A",
                  }}
                >
                  {data.ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
