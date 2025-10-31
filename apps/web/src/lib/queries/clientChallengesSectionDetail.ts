// apps/web/src/lib/queries/clientChallengesSectionDetail.ts
import { groq } from "next-sanity";

export const clientChallengesSectionDetailByLang = groq`
*[_type == "clientChallengesSectionDetail"] | order(_updatedAt desc)[0]{
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

  "intro": coalesce(
    select($lang == "jp" => introJp, $lang == "zh" => introZh, $lang == "en" => introEn),
    introJp, introZh, introEn
  ),

  "challenges": challenges[] | order(order asc){
    _key,
    "order": order,
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

  "conclusion": coalesce(
    select($lang == "jp" => conclusionJp, $lang == "zh" => conclusionZh, $lang == "en" => conclusionEn),
    conclusionJp, conclusionZh, conclusionEn
  ),

  "companyIntro": coalesce(
    select($lang == "jp" => companyIntroJp, $lang == "zh" => companyIntroZh, $lang == "en" => companyIntroEn),
    companyIntroJp, companyIntroZh, companyIntroEn
  ),

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

  "contactSection": {
    "linkedin": contactSection.linkedin,
    "line": contactSection.line,
    "note": coalesce(
      select($lang == "jp" => contactSection.noteJp, $lang == "zh" => contactSection.noteZh, $lang == "en" => contactSection.noteEn),
      contactSection.noteJp, contactSection.noteZh, contactSection.noteEn
    )
  }
}
`;
