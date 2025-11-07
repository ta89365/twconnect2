// apps/web/src/components/AboutSection.tsx
import Image from "next/image";
import Link from "next/link";

export type AboutData = {
  title?: string | null;
  sloganMain?: string | null;
  sloganSub?: string | null;
  intro?: string[] | null;
  ctaText?: string | null;
  ctaHref?: string | null; // Sanity 可能給 /aboutus，會在下方統一改 /company
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

function isBypassLink(href?: string | null): boolean {
  const s = String(href ?? "").trim().toLowerCase();
  if (!s) return true;
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("mailto:")
    || s.startsWith("tel:") || s.startsWith("#");
}

/** 將 /aboutus 及其子路徑統一改為 /company */
function normalizeAboutPath(href: string): string {
  if (!href.startsWith("/")) return href;
  // 移除多餘斜線後比對
  const clean = href.replace(/\/{2,}/g, "/");
  if (clean === "/aboutus") return "/company";
  if (clean.startsWith("/aboutus/")) return clean.replace(/^\/aboutus/, "/company");
  return clean;
}

/** 站內路徑附掛 ?lang=xx；若已帶 lang 則不重複附掛 */
function addLangQuery(href: string, lang: Lang): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default function AboutSection({
  data,
  lang,
}: {
  data: AboutData | null;
  lang: Lang; // ✅ 由頁面傳入目前語言
}) {
  if (!data) return null;

  const { title, sloganMain, sloganSub, intro, ctaText, ctaHref, logoUrl, bgUrl, bgImage } = data;
  const bgPos = objectPositionFromHotspot(bgImage?.hotspot);

  // ✅ 無論 Sanity 給什麼，只要是站內且是 /aboutus 開頭，一律改 /company
  const baseHref = (() => {
    const raw = String(ctaHref || "/company").trim();
    if (isBypassLink(raw)) return raw;                // 外部連結不動
    const normalized = normalizeAboutPath(raw);       // /aboutus -> /company
    return normalized || "/company";
  })();

  const finalHref = isBypassLink(baseHref) ? baseHref : addLangQuery(baseHref, lang);

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
          {sloganSub && <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">{sloganSub}</p>}
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

        {/* CTA 按鈕：固定導向 /company?lang=xx（若 Sanity 給 /aboutus 也會被改寫） */}
        <div className="mt-8">
          <Link
            href={finalHref}
            className="inline-flex items-center rounded-xl px-5 py-3 text-sm sm:text-base font-medium transition
                       text-white bg-[#4A90E2] hover:bg-[#5AA2F0]
                       focus:outline-none focus:ring-2 focus:ring-[#5AA2F0] focus:ring-offset-2 focus:ring-offset-[#1C3D5A]"
          >
            {ctaText || "Learn more"}
          </Link>
        </div>
      </div>
    </section>
  );
}
