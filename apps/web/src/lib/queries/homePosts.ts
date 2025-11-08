// apps/web/src/lib/queries/homePosts.ts
import { groq } from "next-sanity";

export const homePostsQuery = groq`
*[_type == "post" && showOnHome == true && defined(publishedAt)]
| order(pinnedAtTop desc, publishedAt desc)[0...6]{
  _id,
  channel,
  publishedAt,
  "slug": coalesce(
    select(
      $lang == "jp" => slugJp.current,
      $lang == "zh" => slugZh.current,
      $lang == "en" => slugEn.current
    ),
    slugEn.current, slugZh.current, slugJp.current
  ),
  "title": coalesce(
    select(
      $lang == "jp" => titleJp,
      $lang == "zh" => titleZh,
      $lang == "en" => titleEn
    ),
    titleEn, titleZh, titleJp
  ),
  coverImage{
    asset->{url, mimeType, metadata{dimensions}}
  }
}
`;
