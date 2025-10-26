// apps/web/src/components/NavigationServer.tsx
import Navigation from "@/components/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

type Lang = "jp" | "zh" | "en";
type NavItem = { label?: string; href?: string; external?: boolean; order?: number };

export default async function NavigationServer({ lang = "jp" as Lang }) {
  const data = await sfetch<{
    logoUrl?: string | null;
    logoText?: string | null;
    navigation?: NavItem[] | null;
  }>(siteSettingsByLang, { lang });

  return (
    <Navigation
      lang={lang}
      items={data?.navigation ?? []}
      brand={{
        name: data?.logoText ?? "Taiwan Connect",
        logoUrl: data?.logoUrl ?? undefined,
      }}
    />
  );
}
