// apps/web/src/components/NavigationServer.tsx
import type { JSX } from "react";
import Navigation from "@/components/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

type Lang = "jp" | "zh" | "zh-cn" | "en";
type NavItem = { label?: string; href?: string; external?: boolean; order?: number };

function normalizeLang(input?: string | null): Lang {
  const k = String(input ?? "").trim().toLowerCase();
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh-cn";
  if (k === "zh" || k === "zh-hant" || k === "zh_tw" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  return "jp";
}

export default async function NavigationServer(
  { lang }: { lang?: string }
): Promise<JSX.Element> {
  const norm = normalizeLang(lang);
  const data = await sfetch<{
    logoUrl?: string | null;
    logoText?: string | null;
    navigation?: NavItem[] | null;
  }>(siteSettingsByLang, { lang: norm });

  return (
    <Navigation
      lang={norm}
      items={data?.navigation ?? []}
      brand={{
        name: data?.logoText ?? "Taiwan Connect",
        logoUrl: data?.logoUrl ?? undefined,
      }}
    />
  );
}
