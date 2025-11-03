// apps/web/src/components/hero-banner.tsx
import Image from "next/image";

type HeroData = {
  heading?: string;
  subheading?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  bgUrl?: string;
  hotspot?: { x: number; y: number } | null;
};

type Offset = { xRem: number; yRem: number };

type Tune = {
  heroContentOffsetVh: number; // 供 forceTopVh 使用
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
  /** 若 true 則採用頂端偏移（原本的行為）；否則預設垂直置中 */
  forceTopVh?: boolean;
  /** ✅ 整塊內容上下移動的量（vh）— 正數往下，負數往上 */
  shiftVh?: number;
};

export default function HeroBanner({
  data,
  navHeight = 72,
  tune,
}: {
  data?: HeroData;
  navHeight?: number;
  tune: Tune;
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

  const renderSubtitle = (t?: string) => {
    if (!t) return null;
    const m = t.match(/[。．\.!?？！]/);
    if (!m) return <>{t}</>;
    const idx = m.index ?? -1;
    if (idx < 0) return <>{t}</>;
    const first = t.slice(0, idx + 1);
    const rest = t.slice(idx + 1).trim();
    return (
      <>
        <span>{first}</span>
        {rest && (
          <>
            <br />
            <span>{rest}</span>
          </>
        )}
      </>
    );
  };

  // ===== 文字陰影設定 =====
  const SHADOW = { color: "rgba(0,0,0,0.65)", blur: 10 };
  const textShadow = `0 2px ${SHADOW.blur}px ${SHADOW.color}`;

  // ===== 內容容器設定 =====
  const containerBaseClass = "mx-auto h-full flex px-4 sm:px-6 lg:px-8";
  const containerAlignClass = tune.forceTopVh ? "items-start" : "items-center";
  const containerJustifyClass = "justify-center";

  // ✅ 直接內建 shiftVh = 6，可自行改數字（正數往下、負數往上）
  const shift = typeof tune.shiftVh === "number" ? tune.shiftVh : 12;

  const containerStyle: React.CSSProperties = {
    maxWidth: tune.heroMaxWidth,
    paddingTop: tune.forceTopVh
      ? `max(${navHeight + 8}px, ${tune.heroContentOffsetVh}vh)`
      : undefined,
    transform: `translateY(${shift}vh)`, // 整塊移動
  };

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-black"
      style={{ height: `calc(100lvh - ${navHeight}px)` }}
    >
      {/* 背景圖 */}
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

      {/* 內容層 */}
      <div className="absolute inset-0 z-20">
        <div
          className={`${containerBaseClass} ${containerAlignClass} ${containerJustifyClass}`}
          style={containerStyle}
        >
          <div className="w-full text-white text-center flex flex-col items-center">
            {/* 主標題 */}
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

            {/* 副標題 */}
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

            {/* subtitle */}
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
                  <span className="whitespace-pre-wrap">
                    {renderSubtitle(data.subtitle)}
                  </span>
                </p>
              </div>
            )}

            {/* CTA */}
            {data?.ctaText && data?.ctaHref && (
              <div style={move(blocks.cta)}>
                <a
                  href={data.ctaHref}
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
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
