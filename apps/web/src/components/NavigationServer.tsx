import Navigation from "@/components/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";
import { servicesNavChildrenQuery } from "@/lib/queries/navChildren.groq";

type Lang = "jp" | "zh" | "zh-cn" | "en";

/** 從 Site Settings 拿到的每個主選單項目（不含 children） */
type NavItemIn = {
  label?: string;
  href?: string;
  external?: boolean;
  order?: number;
  hasZhCn?: boolean;
};

/** 送進 <Navigation> 的項目（可帶 children） */
type NavChild = { label: string; href: string; external?: boolean };
type NavItemOut = NavItemIn & { children?: NavChild[] };

function normalizeLang(x?: string): Lang {
  const v = String(x || "").toLowerCase();
  if (v === "zh-cn" || v === "zh_cn" || v === "zh-hans" || v === "zhhans" || v === "cn" || v === "hans")
    return "zh-cn";
  if (v === "zh" || v === "zh-hant" || v === "zh_tw" || v === "zhtw") return "zh";
  if (v === "en" || v === "english") return "en";
  return "jp";
}

/** props 現在支援 linkLang，讓你能以 A 語言取資料顯示、以 B 語言輸出連結 */
export default async function NavigationServer({ lang = "jp" as Lang, linkLang }: { lang?: Lang; linkLang?: Lang }) {
  const resolvedLang = normalizeLang(lang);

  // 1) 站點設定（品牌與主選單）以顯示語言抓資料
  const data = await sfetch<{
    logoUrl?: string | null;
    logoText?: string | null;
    navigation?: NavItemIn[] | null;
  }>(siteSettingsByLang, { lang: resolvedLang });

  const items: NavItemIn[] = Array.isArray(data?.navigation) ? data!.navigation! : [];

  // 2) 從 CMS 取回「服務內容」的子選單（同顯示語言）
  const servicesChildren = await sfetch<Array<{ _id: string; href: string; label: string }>>(
    servicesNavChildrenQuery,
    { lang: resolvedLang }
  );

  // 3) 將 Service 子選單塞入 /services，那一筆以 base path 比對（忽略 ?lang）
  const itemsWithChildren: NavItemOut[] = items.map((it) => {
    const base = String(it.href ?? "").split("?")[0];
    if (base === "/services") {
      return {
        ...it,
        children:
          servicesChildren?.map((x) => ({
            label: x.label,
            href: x.href,
            external: false,
          })) ?? [],
      };
    }
    return it;
  });

  // 4) 將顯示語言與連結語言分開傳給 <Navigation>
  return (
    <Navigation
      lang={resolvedLang}
      linkLang={linkLang} // 可為 undefined，則在 navigation.tsx 內部自動處理 zh-cn→zh
      items={itemsWithChildren}
      brand={{
        name: data?.logoText ?? "Taiwan Connect",
        logoUrl: data?.logoUrl ?? undefined,
      }}
    />
  );
}
