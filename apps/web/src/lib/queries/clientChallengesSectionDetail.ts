// queries/clientChallengesSectionDetail.ts
import { groq } from "next-sanity";

export const clientChallengesSectionDetailByLang = groq`
*[_type == "clientChallengesSectionDetail"] | order(_updatedAt desc)[0]{
  /* ========== Hero ========== */
  "heroTitle": coalesce(
    select($lang == "jp" => heroTitleJp, $lang == "zh" => heroTitleZh, $lang == "en" => heroTitleEn),
    heroTitleJp, heroTitleZh, heroTitleEn
  ),
  "heroSubtitle": coalesce(
    select($lang == "jp" => heroSubtitleJp, $lang == "zh" => heroSubtitleZh, $lang == "en" => heroSubtitleEn),
    heroSubtitleJp, heroSubtitleZh, heroSubtitleEn
  ),
  "heroImage": heroImage{
    ...,
    "url": asset->url,
    "alt": coalesce(
      select($lang == "jp" => altJp, $lang == "zh" => altZh, $lang == "en" => altEn),
      altJp, altZh, altEn
    )
  },

  /* ========== Introduction ========== */
  "intro": coalesce(
    select($lang == "jp" => introJp, $lang == "zh" => introZh, $lang == "en" => introEn),
    introJp, introZh, introEn
  ),

  /* ========== Challenges ========== */
  "challenges": challenges[] | order(order asc){
    _key,
    order,
    "title": coalesce(
      select($lang == "jp" => titleJp, $lang == "zh" => titleZh, $lang == "en" => titleEn),
      titleJp, titleZh, titleEn
    ),
    "content": coalesce(
      select($lang == "jp" => contentJp, $lang == "zh" => contentZh, $lang == "en" => contentEn),
      contentJp, contentZh, contentEn
    ),
    "tip": coalesce(
      select($lang == "jp" => tipJp, $lang == "zh" => tipZh, $lang == "en" => tipEn),
      tipJp, tipZh, tipEn
    )
  },

  /* ========== Conclusion ========== */
  "conclusion": coalesce(
    select($lang == "jp" => conclusionJp, $lang == "zh" => conclusionZh, $lang == "en" => conclusionEn),
    conclusionJp, conclusionZh, conclusionEn
  ),

  /* ========== Company Intro ========== */
  "companyIntro": coalesce(
    select($lang == "jp" => companyIntroJp, $lang == "zh" => companyIntroZh, $lang == "en" => companyIntroEn),
    companyIntroJp, companyIntroZh, companyIntroEn
  ),

  /* ========== Features ========== */
  "features": features[]{
    _key,
    icon,
    "title": coalesce(
      select($lang == "jp" => titleJp, $lang == "zh" => titleZh, $lang == "en" => titleEn),
      titleJp, titleZh, titleEn
    ),
    "description": coalesce(
      select($lang == "jp" => descriptionJp, $lang == "zh" => descriptionZh, $lang == "en" => descriptionEn),
      descriptionJp, descriptionZh, descriptionEn
    )
  },

  /* ========== Contact Section ========== */
  "contactSection": contactSection{
    linkedin,
    line,
    "note": coalesce(
      select($lang == "jp" => noteJp, $lang == "zh" => noteZh, $lang == "en" => noteEn),
      noteJp, noteZh, noteEn
    )
  }
}
`;
