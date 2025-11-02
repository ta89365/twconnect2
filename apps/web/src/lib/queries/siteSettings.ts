// apps/web/src/lib/queries/siteSettings.ts
import groq from "groq";

export const siteSettingsByLang = groq`*[_type == "siteSettings"] | order(_updatedAt desc)[0]{
  "logoUrl": coalesce(logo.asset->url, ""),

  "navigation": navigation[]{
    "label": select(
      $lang == "jp"    => coalesce(labelJp,   labelEn, labelZh, labelZhCn),
      $lang == "zh-cn" => coalesce(labelZhCn, labelZh, labelEn, labelJp),
      $lang == "zh"    => coalesce(labelZh,   labelZhCn, labelEn, labelJp),
      coalesce(labelEn, labelZh, labelZhCn, labelJp)
    ),
    "href": href,
    "external": coalesce(external, false),
    "order": coalesce(order, 999)
  }[defined(href)] | order(order asc),

  "footer": {
    "company": {
      "name": select(
        $lang == "jp"    => coalesce(footer.company.nameJp,   footer.company.nameEn,   footer.company.nameZh,   footer.company.nameZhCn),
        $lang == "zh-cn" => coalesce(footer.company.nameZhCn, footer.company.nameZh,   footer.company.nameEn,   footer.company.nameJp),
        $lang == "zh"    => coalesce(footer.company.nameZh,   footer.company.nameZhCn, footer.company.nameEn,   footer.company.nameJp),
        coalesce(footer.company.nameEn, footer.company.nameZh, footer.company.nameZhCn, footer.company.nameJp)
      ),
      "desc": select(
        $lang == "jp"    => coalesce(footer.company.descJp,   footer.company.descEn,   footer.company.descZh,   footer.company.descZhCn),
        $lang == "zh-cn" => coalesce(footer.company.descZhCn, footer.company.descZh,   footer.company.descEn,   footer.company.descJp),
        $lang == "zh"    => coalesce(footer.company.descZh,   footer.company.descZhCn, footer.company.descEn,   footer.company.descJp),
        coalesce(footer.company.descEn, footer.company.descZh, footer.company.descZhCn, footer.company.descJp)
      ),
      "logoUrl": coalesce(footer.company.logo.asset->url, ^.^.logo.asset->url)
    },

    "contact": {
      "email": footer.contact.email,
      "lineId": footer.contact.lineId,
      "addressJp": footer.contact.addressJp,
      "addressTw": footer.contact.addressTw
    },

    "sitemapLabel": select(
      $lang == "jp"    => coalesce(footer.sitemapLabel.jp,   "サイトマップ"),
      $lang == "zh-cn" => coalesce(footer.sitemapLabel.zhcn, "網站導覽"),
      $lang == "zh"    => coalesce(footer.sitemapLabel.zh,   "網站導覽"),
      coalesce(footer.sitemapLabel.en, "Sitemap")
    ),

    "primaryLinks": footer.primaryLinks[] | order(order asc){
      "label": select(
        $lang == "jp"    => coalesce(labelJp,   labelEn, labelZh, labelZhCn),
        $lang == "zh-cn" => coalesce(labelZhCn, labelZh, labelEn, labelJp),
        $lang == "zh"    => coalesce(labelZh,   labelZhCn, labelEn, labelJp),
        coalesce(labelEn, labelZh, labelZhCn, labelJp)
      ),
      "href": href,
      "external": coalesce(external, false),
      "order": coalesce(order, 999)
    }[defined(href)],

    "secondaryLinks": footer.secondaryLinks[] | order(order asc){
      "label": select(
        $lang == "jp"    => coalesce(labelJp,   labelEn, labelZh, labelZhCn),
        $lang == "zh-cn" => coalesce(labelZhCn, labelZh, labelEn, labelJp),
        $lang == "zh"    => coalesce(labelZh,   labelZhCn, labelEn, labelJp),
        coalesce(labelEn, labelZh, labelZhCn, labelJp)
      ),
      "href": href,
      "external": coalesce(external, false),
      "order": coalesce(order, 999)
    }[defined(href)]
  },

  // ✅ Social：同時支援 footer.social / social / socials；空字串視為 null
  "social": {
    "facebook": coalesce(
      select(defined(footer.social.facebook) && footer.social.facebook != "" => footer.social.facebook, null),
      select(defined(social.facebook)        && social.facebook        != "" => social.facebook,        null),
      select(defined(socials.facebook)       && socials.facebook       != "" => socials.facebook,       null)
    ),
    "instagram": coalesce(
      select(defined(footer.social.instagram) && footer.social.instagram != "" => footer.social.instagram, null),
      select(defined(social.instagram)        && social.instagram        != "" => social.instagram,        null),
      select(defined(socials.instagram)       && socials.instagram       != "" => socials.instagram,       null)
    ),
    "linkedin": coalesce(
      select(defined(footer.social.linkedin) && footer.social.linkedin != "" => footer.social.linkedin, null),
      select(defined(social.linkedin)        && social.linkedin        != "" => social.linkedin,        null),
      select(defined(socials.linkedin)       && socials.linkedin       != "" => socials.linkedin,       null)
    ),
    "github": coalesce(
      select(defined(footer.social.github) && footer.social.github != "" => footer.social.github, null),
      select(defined(social.github)        && social.github        != "" => social.github,        null),
      select(defined(socials.github)       && socials.github       != "" => socials.github,       null)
    ),
    "medium": coalesce(
      select(defined(footer.social.medium) && footer.social.medium != "" => footer.social.medium, null),
      select(defined(social.medium)        && social.medium        != "" => social.medium,        null),
      select(defined(socials.medium)       && socials.medium       != "" => socials.medium,       null)
    ),
    "note": coalesce(
      select(defined(footer.social.note) && footer.social.note != "" => footer.social.note, null),
      select(defined(social.note)        && social.note        != "" => social.note,        null),
      select(defined(socials.note)       && socials.note       != "" => socials.note,       null)
    ),
    "line": coalesce(
      select(defined(footer.social.line) && footer.social.line != "" => footer.social.line, null),
      select(defined(social.line)        && social.line        != "" => social.line,        null),
      select(defined(socials.line)       && socials.line       != "" => socials.line,       null)
    )
  }
}`;
