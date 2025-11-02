// apps/web/src/components/AboutSection.tsx
import Image from "next/image";
import Link from "next/link";

export type AboutData = {
  title?: string | null;
  sloganMain?: string | null;
  sloganSub?: string | null;
  intro?: string[] | null;
  ctaText?: string | null;
  ctaHref?: string | null;
  logoUrl?: string | null;
  logo?: {
    crop?: any;
    hotspot?: { x: number; y: number } | null;
    asset?: { _id: string; url: string; mimeType?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
  } | null;
  bgUrl?: string | null;
  bgImage?: {
    crop?: any;
    hotspot?: { x: number; y: number } | null;
    asset?: { _id: string; url: string; mimeType?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
  } | null;
  isActive?: boolean;
  order?: number;
};

/** 將 Sanity hotspot.x/y 轉換為 CSS object-position 百分比 */
function objectPositionFromHotspot(hotspot?: { x: number; y: number } | null) {
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") {
    return "50% 50%";
  }
  const x = Math.round(hotspot.x * 100);
  const y = Math.round(hotspot.y * 100);
  return `${x}% ${y}%`;
}

export default function AboutSection({ data }: { data: AboutData | null }) {
  if (!data) return null;

  const { title, sloganMain, sloganSub, intro, ctaText, ctaHref, logoUrl, bgUrl, bgImage } = data;

  const bgPos = objectPositionFromHotspot(bgImage?.hotspot);

  return (
    <section
      className="relative overflow-hidden"
      aria-label="About Taiwan Connect"
      style={{
        backgroundColor: "#1C3D5A", // 固定深藍底色
      }}
    >
      {/* 背景圖（加上深藍遮罩確保文字對比） */}
      {bgUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={bgUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{
              objectPosition: bgPos,
              opacity: 0.25, // 讓藍色底仍主導
            }}
          />
        </div>
      )}

      {/* 主要內容 */}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-20 lg:py-24 text-white">
        {/* Logo + Title */}
        <div className="flex items-center gap-6">
          {logoUrl && (
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <Image
                src={logoUrl}
                alt="Taiwan Connect Logo"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
          )}
        </div>

        {/* 主副標語 */}
        <div className="mt-6 space-y-3">
          {sloganMain && (
            <p className="inline-block text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
              {sloganMain}
            </p>
          )}
          {sloganSub && (
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
              {sloganSub}
            </p>
          )}
        </div>

        {/* 核心介紹文字 */}
        {intro && intro.length > 0 && (
          <div className="mt-6 space-y-2">
            {intro.map((line, i) => (
              <p key={i} className="text-white/90 text-sm sm:text-base leading-7">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* CTA 按鈕（依要求更新顏色） */}
        {(ctaText || ctaHref) && (
          <div className="mt-8">
            <Link
              href={ctaHref || "#"}
              className="inline-flex items-center rounded-xl px-5 py-3 text-sm sm:text-base font-medium transition
                         text-white
                         bg-[#4A90E2] hover:bg-[#5AA2F0]
                         focus:outline-none focus:ring-2 focus:ring-[#5AA2F0] focus:ring-offset-2 focus:ring-offset-[#1C3D5A]"
            >
              {ctaText || "Learn more"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
