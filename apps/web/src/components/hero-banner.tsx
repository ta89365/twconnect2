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
  heroContentOffsetVh: number;
  heroLeftPadRem: { base: number; md: number; lg: number };
  heroMaxWidth: string;
  heroObjectPos: string;
  heroObjectPosY?: string; // ★ 新增：背景上下位置控制
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
  // 背景構圖位置：允許自訂上下
  const objectPosition = tune.heroObjectPosY
    ? `${tune.heroObjectPos} ${tune.heroObjectPosY}`
    : tune.heroObjectPos;

  // 預設位移
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

  /** subtitle：第一個句號後換行 */
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
          style={{
            objectFit: "cover",
            objectPosition: objectPosition,
          }}
        />
      )}

      <div className="absolute inset-0 z-20">
        <div
          className="mx-auto h-full flex items-center pr-4"
          style={{
            maxWidth: tune.heroMaxWidth,
            paddingLeft: `${tune.heroLeftPadRem.base}rem`,
            paddingTop: tune.forceTopVh
              ? `${tune.heroContentOffsetVh}vh`
              : `max(${navHeight + 8}px, ${tune.heroContentOffsetVh}vh)`,
          }}
        >
          <div className="w-full md:max-w-[75rem] lg:max-w-[85rem] text-white">
            {/* 主標 */}
            {data?.heading && (
              <div style={move(blocks.heading)}>
                <h1
                  className="font-extrabold leading-[1.05] text-white tracking-normal md:whitespace-nowrap"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  {data.heading}
                </h1>
              </div>
            )}

            {/* 副標（粗體 90% 白） */}
            {data?.subheading && (
              <div style={move(blocks.subheading)}>
                <p
                  className="mt-4 text-white/90 font-semibold"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
                >
                  {data.subheading}
                </p>
              </div>
            )}

            {/* subtitle（再粗一點） */}
            {data?.subtitle && (
              <div style={move(blocks.subtitle)}>
                <p className="mt-3 max-w-[70rem] text-white/90 font-semibold text-sm md:text-base leading-snug">
                  <span className="whitespace-pre-wrap">{renderSubtitle(data.subtitle)}</span>
                </p>
              </div>
            )}

            {/* CTA */}
            {data?.ctaText && data?.ctaHref && (
              <div style={move(blocks.cta)}>
                <a
                  href={data.ctaHref}
                  className="
                    mt-8 inline-flex h-11 min-w-[220px]
                    items-center justify-center
                    rounded-md px-6 text-center
                    font-semibold leading-none text-white
                    shadow-lg hover:shadow-xl
                    ring-1 ring-white/20 hover:ring-white/30
                    transition
                  "
                  style={{ backgroundColor: "#1C3D5A" }}
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
