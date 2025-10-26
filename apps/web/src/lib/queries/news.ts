// apps/web/src/lib/queries/news.ts
// News 專欄用 GROQ Queries（多語版）
// 改寫為舊版 API 相容格式：以「+」串接取代 concat() 與 array::unique()

export type Lang = "jp" | "zh" | "en";

/** 入口頁：Hero 文案、快速主題、以及文章清單（置頂→精選→最新） */
export const newsEntranceByLang = /* groq */ `
{
  // 入口頁文案與入口設定
  "settings": *[_type == "newsSettings"][0]{
    // ✅ 新增：Hero 背景圖（含 hotspot/crop/lqip/尺寸）
    "heroImage": heroImage{
      "assetId": asset->_id,
      "url": asset->url,
      "alt": coalesce(alt, ""),
      hotspot,
      crop,
      "dimensions": asset->metadata.dimensions{
        width,
        height,
        aspectRatio
      },
      "lqip": asset->metadata.lqip
    },

    "heroTitle": select(
      $lang == "jp" => coalesce(heroTitleJp, heroTitleZh, heroTitleEn),
      $lang == "zh" => coalesce(heroTitleZh, heroTitleJp, heroTitleEn),
      heroTitleEn
    ),
    "heroSubtitle": select(
      $lang == "jp" => coalesce(heroSubtitleJp, heroSubtitleZh, heroSubtitleEn),
      $lang == "zh" => coalesce(heroSubtitleZh, heroSubtitleJp, heroSubtitleEn),
      heroSubtitleEn
    ),
    "quickTopics": quickTopics[]->{
      "title": select(
        $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
        $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
        titleEn
      ),
      "slug": slug.current
    }
  },

  // ===== 文章清單：置頂 → 精選 → 最新 =====
  // 使用加號運算子取代 concat()，並過濾未發布/草稿
  "posts": (
    *[_type == "post" && pinnedAtTop == true
       && defined(publishedAt) && publishedAt <= now()
       && !(_id in path('drafts.**'))
    ] | order(publishedAt desc) +
    *[_type == "post" && isFeatured == true && pinnedAtTop != true
       && defined(publishedAt) && publishedAt <= now()
       && !(_id in path('drafts.**'))
    ] | order(publishedAt desc) +
    *[_type == "post" && isFeatured != true && pinnedAtTop != true
       && defined(publishedAt) && publishedAt <= now()
       && !(_id in path('drafts.**'))
    ] | order(publishedAt desc)
  )[0...$limit]{
    _id,
    publishedAt,
    isFeatured,
    pinnedAtTop,
    readingMinutes,
    "slug": select(
      $lang == "jp" => slugJp.current,
      $lang == "zh" => slugZh.current,
      slugEn.current
    ),
    "title": select(
      $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
      $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
      titleEn
    ),
    "excerpt": select(
      $lang == "jp" => coalesce(excerptJp, excerptZh, excerptEn),
      $lang == "zh" => coalesce(excerptZh, excerptJp, excerptEn),
      excerptEn
    ),
    "coverImage": {
      "url": coverImage.asset->url,
      alt
    },
    "category": category->{
      "title": select(
        $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
        $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
        titleEn
      ),
      "slug": slug.current
    },
    "tags": tags[]->{
      "title": select(
        $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
        $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
        titleEn
      ),
      "slug": slug.current
    },
    "author": author->{
      name
    }
  }
}
`;

/** 內頁：依語言別 slug 取得單篇文章，含 SEO、作者、類別、標籤與相關文章 */
export const postBySlugAndLang = /* groq */ `
*[_type == "post" && select(
  $lang == "jp" => slugJp.current == $slug,
  $lang == "zh" => slugZh.current == $slug,
  slugEn.current == $slug
)][0]{
  _id,
  publishedAt,
  isFeatured,
  pinnedAtTop,
  readingMinutes,

  "slug": select(
    $lang == "jp" => slugJp.current,
    $lang == "zh" => slugZh.current,
    slugEn.current
  ),
  "title": select(
    $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
    $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
    titleEn
  ),
  "excerpt": select(
    $lang == "jp" => coalesce(excerptJp, excerptZh, excerptEn),
    $lang == "zh" => coalesce(excerptZh, excerptJp, excerptEn),
    excerptEn
  ),
  "body": select(
    $lang == "jp" => coalesce(bodyJp, bodyZh, bodyEn),
    $lang == "zh" => coalesce(bodyZh, bodyJp, bodyEn),
    bodyEn
  ),

  "seoTitle": select(
    $lang == "jp" => coalesce(seoTitleJp, seoTitleZh, seoTitleEn),
    $lang == "zh" => coalesce(seoTitleZh, seoTitleJp, seoTitleEn),
    seoTitleEn
  ),
  "seoDescription": select(
    $lang == "jp" => coalesce(seoDescriptionJp, seoDescriptionZh, seoDescriptionEn),
    $lang == "zh" => coalesce(seoDescriptionZh, seoDescriptionJp, seoDescriptionEn),
    seoDescriptionEn
  ),
  "ogImage": {
    "url": coalesce(ogImage.asset->url, coverImage.asset->url),
    "alt": coalesce(ogImage.alt, coverImage.alt)
  },

  "coverImage": { "url": coverImage.asset->url, alt },
  "gallery": gallery[]{ "url": asset->url, alt },
  "category": category->{
    "title": select(
      $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
      $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
      titleEn
    ),
    "slug": slug.current,
    _id
  },
  // ✅ 主文 tags 帶回 _id，供 related 交集判斷
  "tags": tags[]->{
    _id,
    "title": select(
      $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
      $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
      titleEn
    ),
    "slug": slug.current
  },
  "author": author->{
    name, title,
    "avatar": avatar.asset->url,
    linkedin, email
  },

  // ✅ related 以同分類或 tag 交集為準
  "related": *[_type == "post" && _id != ^._id && (
      category._ref == ^.category._id ||
      count(tags[@._ref in ^.^.tags[]._id]) > 0
    )] | order(publishedAt desc)[0...6]{
      _id,
      publishedAt,
      "slug": select(
        $lang == "jp" => slugJp.current,
        $lang == "zh" => slugZh.current,
        slugEn.current
      ),
      "title": select(
        $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
        $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
        titleEn
      ),
      "excerpt": select(
        $lang == "jp" => coalesce(excerptJp, excerptZh, excerptEn),
        $lang == "zh" => coalesce(excerptZh, excerptJp, excerptEn),
        excerptEn
      ),
      "coverImage": { "url": coverImage.asset->url, alt }
    }
}
`;

/**（可選）取得所有語言別可用的 slug，供靜態路由預先建立或 sitemap 使用 */
export const allPostSlugs = /* groq */ `
{
  "jp":  *[_type == "post" && defined(slugJp.current)]{ "slug": slugJp.current },
  "zh":  *[_type == "post" && defined(slugZh.current)]{ "slug": slugZh.current },
  "en":  *[_type == "post" && defined(slugEn.current)]{ "slug": slugEn.current }
}
`;
