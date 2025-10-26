// C:\Users\ta893\twconnect2\apps\web\src\lib\queries\companyStrengthsAndFAQ.ts

export type Lang = "jp" | "zh" | "en";

export type CompanyStrengthsFAQ = {
  heroImage?: {
    assetId?: string | null;
    url?: string | null;
    alt?: string | null;
    hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
    crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
    dimensions?: { width?: number; height?: number; aspectRatio?: number } | null;
    lqip?: string | null;
  } | null;

  title?: string | null;
  labels?: {
    strengths?: string | null;
    faq?: string | null;
    readMore?: string | null;
    contactUs?: string | null;
  } | null;

  strengthsCount?: number;

  strengths?: Array<{
    order?: number | null;
    icon?: string | null; // 例如 "Globe"、"Scale"；不填則會自動依標題推測
    title?: string | null;
    body?: string | null;
  }> | null;

  faqTitle?: string | null;
  faqIntro?: string | null;

  faqItems?: Array<{
    order?: number | null;
    question?: string | null;
    answer?: string | null;
  }> | null;
};

export const companyStrengthsAndFAQByLang = /* groq */ `
*[_type == "companyStrengthsAndFAQ"][0]{
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
  "title": coalesce(title, "Our Strengths"),
  "labels": {
    "strengths": select($lang=="jp"=>"私たちの強み", $lang=="zh"=>"我們的優勢", "Our Strengths"),
    "faq":        select($lang=="jp"=>"よくある質問", $lang=="zh"=>"常見問題", "FAQ"),
    "readMore":   select($lang=="jp"=>"詳しく見る", $lang=="zh"=>"了解更多", "Read more"),
    "contactUs":  select($lang=="jp"=>"お問い合わせ", $lang=="zh"=>"聯絡我們", "Contact us")
  },
  "strengths": strengths[]{
    order,
    icon,
    "title": select(
      $lang=="jp" => coalesce(titleJp, titleZh, titleEn),
      $lang=="zh" => coalesce(titleZh, titleJp, titleEn),
      $lang=="en" => coalesce(titleEn, titleJp, titleZh)
    ),
    "body": select(
      $lang=="jp" => coalesce(bodyJp, bodyZh, bodyEn),
      $lang=="zh" => coalesce(bodyZh, bodyJp, bodyEn),
      $lang=="en" => coalesce(bodyEn, bodyJp, bodyZh)
    )
  } | order(order asc),
  "strengthsCount": count(strengths),
  "faqTitle": select(
    $lang=="jp" => faqTitle.jp,
    $lang=="zh" => faqTitle.zh,
    $lang=="en" => faqTitle.en
  ),
  "faqIntro": select(
    $lang=="jp" => faqIntro.jp,
    $lang=="zh" => faqIntro.zh,
    $lang=="en" => faqIntro.en
  ),
  "faqItems": faqItems[]{
    order,
    "question": select(
      $lang=="jp" => questionJp,
      $lang=="zh" => questionZh,
      $lang=="en" => questionEn
    ),
    "answer": select(
      $lang=="jp" => answerJp,
      $lang=="zh" => answerZh,
      $lang=="en" => answerEn
    )
  } | order(order asc)
}
`;
