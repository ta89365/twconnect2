// File: apps/web/src/components/TimezoneSelect.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  id?: string;
  name?: string;             // 送到後端的欄位名（預設 "timezone"）
  className?: string;        // 額外 class，可再疊加
  placeholder?: string;      // 初始提示文字
  showOffsetHint?: boolean;  // 是否顯示下方 UTC 偏移
  variant?: "brand" | "light"; // ★ 外觀切換
};

const BRAND_BLUE = "#1C3D5A";

export default function TimezoneSelect({
  id = "timezone",
  name = "timezone",
  className = "",
  placeholder = "Detecting your time zone…",
  showOffsetHint = true,
  variant = "brand",
}: Props) {
  const fallbackZones = useMemo(
    () => [
      "Asia/Taipei",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Hong_Kong",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "UTC",
    ],
    []
  );

  const [zones, setZones] = useState<string[] | null>(null);
  const [value, setValue] = useState<string>("");

  function offsetString(tz: string): string {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
        hour: "2-digit",
      }).formatToParts(now);
      const raw = parts.find((p) => p.type === "timeZoneName")?.value || "GMT±00:00";
      return raw.replace("GMT", "UTC");
    } catch {
      return "UTC±00:00";
    }
  }

  useEffect(() => {
    try {
      const supported =
        typeof (Intl as any).supportedValuesOf === "function"
          ? (Intl as any).supportedValuesOf("timeZone")
          : null;

      const list: string[] = supported?.length ? supported : fallbackZones;
      setZones(list);

      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setValue(list.includes(detected) ? detected : list.includes("UTC") ? "UTC" : list[0]);
    } catch {
      setZones(fallbackZones);
      setValue("UTC");
    }
  }, [fallbackZones]);

  // 依 variant 設定顏色
  const isBrand = variant === "brand";
  const selectStyle = isBrand
    ? { backgroundColor: BRAND_BLUE, color: "#fff" }
    : { backgroundColor: "#fff", color: "#111" };

  const optionStyle = isBrand
    ? { backgroundColor: BRAND_BLUE, color: "#fff" }
    : { backgroundColor: "#fff", color: "#111" };

  const ring = isBrand ? "ring-white/20 focus:ring-white/40" : "ring-black/10 focus:ring-black/20";

  // 行動裝置優化：提高高度字級、加入 appearance-none，並在需要時給予 z-index 以避免被覆蓋
  const mergedClass = [
    "rounded-xl px-3 py-2 outline-none ring-1 focus:ring-2 transition-shadow",
    "appearance-none",           // iOS/Android 原生下拉更一致
    "h-12 sm:h-11 text-[15px]",  // 行動裝置更大的點擊區與字級
    "bg-no-repeat pr-9",         // 預留右側箭頭空間（若日後加自訂箭頭）
    ring,
    className,
  ].join(" ");

  return (
    // 若遇到顯示層級被覆蓋，這個容器提供 stacking context；桌機還原
    <div className="grid gap-1 relative z-10 md:z-auto">
      <select
        id={id}
        name={name}
        className={mergedClass}
        style={selectStyle}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {!zones && (
          <option value="" disabled style={optionStyle}>
            {placeholder}
          </option>
        )}
        {zones?.map((z) => (
          <option key={z} value={z} style={optionStyle}>
            {z} ({offsetString(z)})
          </option>
        ))}
      </select>

      {showOffsetHint && value ? (
        <div className={isBrand ? "text-xs opacity-80 text-white" : "text-xs opacity-70 text-gray-600"}>
          UTC offset: {offsetString(value)}
        </div>
      ) : null}
    </div>
  );
}
