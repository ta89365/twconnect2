// apps/web/src/lib/queries/news.ts
// 固定 channel = "news"；完全不引用 $channel，避免缺參數錯誤
export type Lang = "jp" | "zh" | "en";

/** 入口頁：Hero、QuickTopics、清單（置頂→精選→最新） */
export const newsEntranceByLang = /* groq */ `
{
  "settings": *[_type == "newsSettings"][0]{
    "heroImage": heroImage{
      "assetId": asset->_id, "url": asset->url, "alt": coalesce(alt, ""),
      hotspot, crop, "dimensions": asset->metadata.dimensions{width,height,aspectRatio},
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

  // 同一排序：置頂→精選→最新；固定 channel == "news"
  "posts": (
    *[_type == "post" && channel == "news" && pinnedAtTop == true
      && defined(publishedAt) && publishedAt <= now()
      && !(_id in path('drafts.**'))] | order(publishedAt desc)
    +
    *[_type == "post" && channel == "news" && isFeatured == true && pinnedAtTop != true
      && defined(publishedAt) && publishedAt <= now()
      && !(_id in path('drafts.**'))] | order(publishedAt desc)
    +
    *[_type == "post" && channel == "news" && isFeatured != true && pinnedAtTop != true
      && defined(publishedAt) && publishedAt <= now()
      && !(_id in path('drafts.**'))] | order(publishedAt desc)
  )[0...$limit]{
    _id, publishedAt, isFeatured, pinnedAtTop, readingMinutes,
    "slug": select($lang=="jp"=>slugJp.current,$lang=="zh"=>slugZh.current,slugEn.current),
    "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn),
    "excerpt": select($lang=="jp"=>coalesce(excerptJp,excerptZh,excerptEn),$lang=="zh"=>coalesce(excerptZh,excerptJp,excerptEn),excerptEn),
    "coverImage": {"url": coverImage.asset->url, "alt": coalesce(coverImage.alt,"")},
    "category": { "title": select($lang=="jp"=>coalesce(category->titleJp,category->titleZh,category->titleEn),$lang=="zh"=>coalesce(category->titleZh,category->titleJp,category->titleEn),category->titleEn), "slug": category->slug.current },
    "tags": tags[]->{ "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn), "slug": slug.current },
    "author": author->{ name }
  }
}
`;

/** 內頁（固定 news）：語言對應 slug，含 related */
export const postBySlugAndLang = /* groq */ `
*[
  _type == "post" &&
  channel == "news" &&
  defined(publishedAt) && publishedAt <= now() &&
  !(_id in path('drafts.**')) &&
  select($lang=="jp"=>slugJp.current==$slug,$lang=="zh"=>slugZh.current==$slug,slugEn.current==$slug)
][0]{
  _id, publishedAt, isFeatured, pinnedAtTop, readingMinutes,
  "slug": select($lang=="jp"=>slugJp.current,$lang=="zh"=>slugZh.current,slugEn.current),
  "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn),
  "excerpt": select($lang=="jp"=>coalesce(excerptJp,excerptZh,excerptEn),$lang=="zh"=>coalesce(excerptZh,excerptJp,excerptEn),excerptEn),
  "body": select($lang=="jp"=>coalesce(bodyJp,bodyZh,bodyEn),$lang=="zh"=>coalesce(bodyZh,bodyJp,bodyEn),bodyEn),
  "seoTitle": select($lang=="jp"=>coalesce(seoTitleJp,seoTitleZh,seoTitleEn),$lang=="zh"=>coalesce(seoTitleZh,seoTitleJp,seoTitleEn),seoTitleEn),
  "seoDescription": select($lang=="jp"=>coalesce(seoDescriptionJp,seoDescriptionZh,seoDescriptionEn),$lang=="zh"=>coalesce(seoDescriptionZh,seoDescriptionJp,seoDescriptionEn),seoDescriptionEn),
  "coverImage": {"url": coverImage.asset->url, "alt": coalesce(coverImage.alt,"")},
  "gallery": gallery[]{ "url": asset->url, "alt": coalesce(alt,"") },
  "category": category->{ _id, "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn), "slug": slug.current },
  "tags": tags[]->{ _id, "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn), "slug": slug.current },
  "author": author->{ name, title, "avatar": avatar.asset->url, linkedin, email },

  "related": *[
    _type == "post" && channel == "news" &&
    defined(publishedAt) && publishedAt <= now() &&
    !(_id in path('drafts.**')) &&
    _id != ^._id &&
    (category._ref == ^.category._id || count(tags[@._ref in ^.tags[]._id]) > 0)
  ] | order(publishedAt desc)[0...6]{
    _id, publishedAt,
    "slug": select($lang=="jp"=>slugJp.current,$lang=="zh"=>slugZh.current,slugEn.current),
    "title": select($lang=="jp"=>coalesce(titleJp,titleZh,titleEn),$lang=="zh"=>coalesce(titleZh,titleJp,titleEn),titleEn),
    "excerpt": select($lang=="jp"=>coalesce(excerptJp,excerptZh,excerptEn),$lang=="zh"=>coalesce(excerptZh,excerptJp,excerptEn),excerptEn),
    "coverImage": {"url": coverImage.asset->url, "alt": coalesce(coverImage.alt,"")}
  }
}
`;
