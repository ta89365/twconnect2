// apps/web/src/components/AboutSection.tsx
import Image from "next/image";

export type AboutData = {
  title?: string | null;
  sloganMain?: string | null;
  sloganSub?: string | null;
  intro?: string[] | null;
  logoUrl?: string | null;
  logo?: {
    crop?: any;
    hotspot?: { x: number; y: number } | null;
    asset?: {
      _id: string;
      url: string;
      mimeType?: string;
      metadata?: { dimensions?: { width: number; height: number } };
    } | null;
  } | null;
  bgUrl?: string | null;
  bgImage?: {
    crop?: any;
    hotspot?: { x: number; y: number } | null;
    asset?: {
      _id: string;
      url: string;
      mimeType?: string;
      metadata?: { dimensions?: { width: number; height: number } };
    } | null;
  } | null;
  isActive?: boolean;
  order?: number;
};

type Lang = "jp" | "zh" | "en";

/** hotspot -> CSS object-position */
function objectPositionFromHotspot(hotspot?: { x: number; y: number } | null) {
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") return "50% 50%";
  const x = Math.round(hotspot.x * 100);
  const y = Math.round(hotspot.y * 100);
  return `${x}% ${y}%`;
}

export default function AboutSection({
  data,
  lang,
}: {
  data: AboutData | null;
  lang: Lang;
}) {
  if (!data) return null;

  const { title, sloganMain, sloganSub, intro, logoUrl, bgUrl, bgImage } = data;
  const bgPos = objectPositionFromHotspot(bgImage?.hotspot);

  return (
    <section
      className="relative overflow-hidden"
      aria-label="About Taiwan Connect"
      style={{ backgroundColor: "#1C3D5A" }}
    >
      {/* 背景圖 */}
      {bgUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={bgUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ objectPosition: bgPos, opacity: 0.25 }}
          />
        </div>
      )}

      {/* 主要內容 */}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-20 lg:py-24 text-white">
        {/* Logo + Title */}
        <div className="flex items-center gap-6">
          {logoUrl && (
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0">
              <Image src={logoUrl} alt="Taiwan Connect Logo" fill className="object-contain" sizes="40px" />
            </div>
          )}
          {title && <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>}
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
        {Array.isArray(intro) && intro.length > 0 && (
          <div className="mt-6 space-y-2">
            {intro.map((line, i) => (
              <p key={i} className="text-white/90 text-sm sm:text-base leading-7">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
