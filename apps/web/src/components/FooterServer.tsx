// apps/web/src/components/FooterServer.tsx
import Footer from "@/components/Footer";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

type Lang = "jp" | "zh" | "en" | "zh-cn";

export type FooterLink = { label?: string; href?: string; external?: boolean; order?: number };

type SiteSettingsQuery = {
  logoUrl?: string | null;
  footer?: {
    company?: {
      name?: string | null;
      desc?: string | null;
      logoUrl?: string | null;
    } | null;
    contact?: {
      email?: string | null;
      addressJp?: string | null;
      addressTw?: string | null;
    } | null;
    sitemapLabel?: string | null;
    primaryLinks?: FooterLink[] | null;
    secondaryLinks?: FooterLink[] | null;
  } | null;
  social?: {
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    github?: string | null;
    medium?: string | null;
    note?: string | null;
  } | null;
};

export default async function FooterServer({ lang = "jp" as Lang }) {
  const data = await sfetch<SiteSettingsQuery>(siteSettingsByLang, { lang });

  const companyName =
    data?.footer?.company?.name ??
    (lang === "en" ? "Taiwan Connect Inc." : "株式会社 Taiwan Connect");

  const logoUrl =
    data?.footer?.company?.logoUrl ||
    data?.logoUrl ||
    undefined;

  const contact = data?.footer?.contact ?? undefined;
  const primaryLinks = data?.footer?.primaryLinks ?? undefined;
  const secondaryLinks = data?.footer?.secondaryLinks ?? undefined;
  const sitemapLabel = data?.footer?.sitemapLabel ?? undefined;
  const social = data?.social ?? undefined;
  const companyDesc = data?.footer?.company?.desc ?? undefined;

  return (
    <Footer
      lang={lang}
      company={{ name: companyName, logoUrl, desc: companyDesc }}
      contact={contact}
      primaryLinks={primaryLinks}
      secondaryLinks={secondaryLinks}
      sitemapLabel={sitemapLabel}
      social={social}
    />
  );
}
