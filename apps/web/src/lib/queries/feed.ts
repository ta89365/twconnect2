// apps/web/src/lib/queries/feed.ts
// 通用 News 與 Column 的入口查詢與單篇查詢
export const feedEntranceQuery = /* groq */ `
{
  "settings": *[_type == $settingsType][0]{
    heroImage{ ..., asset->, alt },
    heroTitleJp, heroTitleZh, heroTitleEn,
    heroSubtitleJp, heroSubtitleZh, heroSubtitleEn,
    listStrategy,
    manualOrder[]->{
      _id, channel, publishedAt, isFeatured, pinnedAtTop,
      category->{ _id, titleJp, titleZh, titleEn, slug, color },
      tags[]->{ _id, titleJp, titleZh, titleEn, slug },
      author->{ _id, name, title, email, linkedin, avatar{..., asset->} },
      coverImage{ ..., asset->, alt },
      gallery[]{ ..., asset-> },
      slugJp, slugZh, slugEn,
      titleJp, titleZh, titleEn,
      excerptJp, excerptZh, excerptEn,
      bodyJp, bodyZh, bodyEn,
      seoTitleJp, seoTitleZh, seoTitleEn,
      seoDescriptionJp, seoDescriptionZh, seoDescriptionEn,
      readingMinutes
    },
    featuredPosts[]->{
      _id, channel, publishedAt, isFeatured, pinnedAtTop,
      category->{ _id, titleJp, titleZh, titleEn, slug, color },
      tags[]->{ _id, titleJp, titleZh, titleEn, slug },
      author->{ _id, name, title, email, linkedin, avatar{..., asset->} },
      coverImage{ ..., asset->, alt },
      gallery[]{ ..., asset-> },
      slugJp, slugZh, slugEn,
      titleJp, titleZh, titleEn,
      excerptJp, excerptZh, excerptEn,
      bodyJp, bodyZh, bodyEn,
      seoTitleJp, seoTitleZh, seoTitleEn,
      seoDescriptionJp, seoDescriptionZh, seoDescriptionEn,
      readingMinutes
    },
    quickTopics[]->{ _id, titleJp, titleZh, titleEn, slug, color }
  },

  // 可見池：限定 channel 與發佈時間
  "pool": *[
    _type == "post" &&
    channel == $channel &&
    defined(publishedAt) && publishedAt <= $now
  ]{
    _id, channel, publishedAt, isFeatured, pinnedAtTop,
    category->{ _id, titleJp, titleZh, titleEn, slug, color },
    tags[]->{ _id, titleJp, titleZh, titleEn, slug },
    author->{ _id, name, title, email, linkedin, avatar{..., asset->} },
    coverImage{ ..., asset->, alt },
    gallery[]{ ..., asset-> },
    slugJp, slugZh, slugEn,
    titleJp, titleZh, titleEn,
    excerptJp, excerptZh, excerptEn,
    bodyJp, bodyZh, bodyEn,
    seoTitleJp, seoTitleZh, seoTitleEn,
    seoDescriptionJp, seoDescriptionZh, seoDescriptionEn,
    readingMinutes
  } | order(publishedAt desc),

  // 最終 items：依 settings.listStrategy 組裝
  "items": select(
    ^.settings.listStrategy == "manual" => ^.settings.manualOrder,
    ^.settings.listStrategy == "featuredThenNewest" =>
      array::unique( (^.settings.featuredPosts[]->){_id, ...} + ^.pool ),
    ^.settings.listStrategy == "pinnedFeaturedNewest" =>
      array::unique(
        (^.pool[ pinnedAtTop == true ]) +
        ((^.pool[ isFeatured == true ])) +
        ^.pool
      ),
    // default: newest
    ^.pool
  )
}
`;

export const singlePostBySlug = /* groq */ `
*[
  _type == "post" &&
  channel == $channel &&
  defined(publishedAt) && publishedAt <= $now &&
  select(
    $lang == "jp" => slugJp.current == $slug,
    $lang == "zh" => slugZh.current == $slug,
    $lang == "en" => slugEn.current == $slug,
    true => slugEn.current == $slug
  )
][0]{
  _id, channel, publishedAt, isFeatured, pinnedAtTop,
  category->{ _id, titleJp, titleZh, titleEn, slug, color },
  tags[]->{ _id, titleJp, titleZh, titleEn, slug },
  author->{ _id, name, title, email, linkedin, avatar{..., asset->} },
  coverImage{ ..., asset->, alt },
  gallery[]{ ..., asset-> },
  slugJp, slugZh, slugEn,
  titleJp, titleZh, titleEn,
  excerptJp, excerptZh, excerptEn,
  bodyJp, bodyZh, bodyEn,
  seoTitleJp, seoTitleZh, seoTitleEn,
  seoDescriptionJp, seoDescriptionZh, seoDescriptionEn,
  readingMinutes
}
`;
