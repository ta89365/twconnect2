// apps/web/src/components/FooterServer.tsx
import Footer from "@/components/Footer";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

type Lang = "jp" | "zh" | "en";

export default async function FooterServer({ lang = "jp" as Lang }) {
  const data = await sfetch<{
    logoUrl?: string | null;
    logoText?: string | null;
  }>(siteSettingsByLang, { lang });

  return (
    <Footer
      lang={lang}
      company={{
        name: data?.logoText ?? "Taiwan Connect",
        logoUrl: data?.logoUrl ?? undefined,
      }}
    />
  );
}
