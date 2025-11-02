// apps/web/src/lib/queries/insights.ts
// 混合 News 與 Column，依時間新到舊，固定要帶 $limit
export type Lang = "jp" | "zh" | "en";

export const mixedHomeFeedByLang = /* groq */ `
{
  "posts": (
    *[
      _type=="post" &&
      channel=="news" &&
      defined(publishedAt) && publishedAt <= now() &&
      !(_id in path('drafts.**'))
    ] | order(publishedAt desc)
    +
    *[
      _type=="post" &&
      channel=="column" &&
      defined(publishedAt) && publishedAt <= now() &&
      !(_id in path('drafts.**'))
    ] | order(publishedAt desc)
  )
  | order(publishedAt desc)[0...$limit]{
    _id,
    channel,                     // "news" | "column"
    publishedAt,
    "slug": select(
      $lang=="jp" => slugJp.current,
      $lang=="zh" => slugZh.current,
      slugEn.current
    ),
    "title": select(
      $lang=="jp" => coalesce(titleJp,titleZh,titleEn),
      $lang=="zh" => coalesce(titleZh,titleJp,titleEn),
      titleEn
    ),
    "excerpt": select(
      $lang=="jp" => coalesce(excerptJp,excerptZh,excerptEn),
      $lang=="zh" => coalesce(excerptZh,excerptJp,excerptEn),
      excerptEn
    ),
    "category": {
      "title": select(
        $lang=="jp" => coalesce(category->titleJp,category->titleZh,category->titleEn),
        $lang=="zh" => coalesce(category->titleZh,category->titleJp,category->titleEn),
        category->titleEn
      )
    },
    "tags": tags[]->{
      "title": select(
        $lang=="jp" => coalesce(titleJp,titleZh,titleEn),
        $lang=="zh" => coalesce(titleZh,titleJp,titleEn),
        titleEn
      )
    }
  }
}
`;
