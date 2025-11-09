// apps/web/src/lib/consent.ts
export type ConsentCategory = "necessary" | "analytics" | "ads";

export type ConsentState = {
  necessary: true;         // 永遠為 true
  analytics: boolean;
  ads: boolean;
};

export const CONSENT_COOKIE = "tc_consent_v1"; // 存 JSON 的 cookie 名稱
export const CONSENT_MAX_AGE_DAYS = 180;

export const DEFAULT_DENIED: ConsentState = {
  necessary: true,
  analytics: false,
  ads: false,
};

export const ALL_ALLOWED: ConsentState = {
  necessary: true,
  analytics: true,
  ads: true,
};

// 解析 URL ?lang= 參數（找不到則回傳空字串）
export function getLangFromURL(): string {
  if (typeof window === "undefined") return "";
  const u = new URL(window.location.href);
  return (u.searchParams.get("lang") || "").toLowerCase();
}

export function setCookie(name: string, value: string, maxAgeDays = 180) {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function loadStoredConsent(): ConsentState | null {
  try {
    const v = getCookie(CONSENT_COOKIE);
    if (!v) return null;
    const parsed = JSON.parse(v);
    if (typeof parsed === "object" && parsed) {
      return {
        necessary: true,
        analytics: !!parsed.analytics,
        ads: !!parsed.ads,
      };
    }
  } catch {}
  return null;
}
