// apps/web/src/components/SectionDivider.tsx
export default function SectionDivider({
  variant = "wave",
  bg = "#1C3D5A",        // 下方區塊底色（News 的藍）
  shade = "#173149",     // 波形顏色（比底色再深一階）
  accent = "rgba(59, 130, 246, 0.25)", // 上緣淡淡的藍色描邊
  className = "",
}: {
  variant?: "wave" | "slant" | "rule";
  bg?: string;
  shade?: string;
  accent?: string;
  className?: string;
}) {
  if (variant === "rule") {
    return (
      <div className={className}>
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(59,130,246,.5) 20%, rgba(59,130,246,.5) 80%, rgba(255,255,255,0) 100%)",
            opacity: 0.7,
          }}
        />
      </div>
    );
  }

  if (variant === "slant") {
    return (
      <div className={className} aria-hidden>
        <div
          className="h-10 md:h-14 w-full"
          style={{
            background: `linear-gradient( to right, ${shade}, ${bg})`,
            clipPath: "polygon(0 0, 100% 25%, 100% 100%, 0 100%)",
          }}
        />
      </div>
    );
  }

  // wave（預設）
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 1440 90" className="block w-full h-[70px] md:h-[90px]">
        {/* 上緣淡藍描邊，讓分界更清楚 */}
        <path
          d="M0 10 C 240 40, 480 0, 720 20 C 960 40, 1200 10, 1440 30"
          fill="none"
          stroke={accent}
          strokeWidth="2"
        />
        {/* 主體波形，填滿到下方藍底 */}
        <path
          d="M0,30 C240,60 480,10 720,35 C960,60 1200,20 1440,45 L1440,90 L0,90 Z"
          style={{ fill: shade }}
        />
        {/* 延伸到底色，避免接縫 */}
        <rect x="0" y="45" width="1440" height="45" style={{ fill: bg }} />
      </svg>
    </div>
  );
}
