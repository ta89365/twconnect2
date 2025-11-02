// apps/web/src/lib/queries/contactus.ts
export const contactPageByLang = /* groq */ `
{
  "doc": *[_type == "contactPage"][0]{
    "resolvedLang": select(
      $lang == "jp" => "jp",
      $lang == "en" => "en",
      "zh"
    ),
    "hero": {
      "title": select(
        $lang == "jp" => coalesce(heroTitle.jp, heroTitle.zh, heroTitle.en),
        $lang == "en" => coalesce(heroTitle.en, heroTitle.zh, heroTitle.jp),
        coalesce(heroTitle.zh, heroTitle.jp, heroTitle.en)
      ),
      "subtitle": select(
        $lang == "jp" => coalesce(heroSubtitle.jp, heroSubtitle.zh, heroSubtitle.en),
        $lang == "en" => coalesce(heroSubtitle.en, heroSubtitle.zh, heroSubtitle.jp),
        coalesce(heroSubtitle.zh, heroSubtitle.jp, heroSubtitle.en)
      ),
      "image": select(
        defined(heroImage) => heroImage{
          "assetId": asset->_id,
          "url": asset->url,
          "alt": select(
            $lang == "jp" => coalesce(alt.jp, alt.zh, alt.en),
            $lang == "en" => coalesce(alt.en, alt.zh, alt.jp),
            coalesce(alt.zh, alt.jp, alt.en)
          ),
          hotspot, crop,
          "dimensions": asset->metadata.dimensions{width, height, aspectRatio},
          "lqip": asset->metadata.lqip
        },
        {}
      ),
      "ctas": ctas[]{
        "label": select(
          $lang == "jp" => coalesce(label.jp, label.zh, label.en),
          $lang == "en" => coalesce(label.en, label.zh, label.jp),
          coalesce(label.zh, label.jp, label.en)
        ),
        kind,
        "href": select(defined(href) => href, null),
        recommended
      }
    },
    "info": {
      "languages": select(
        $lang == "jp" => coalesce(languages.jp, languages.zh, languages.en),
        $lang == "en" => coalesce(languages.en, languages.zh, languages.jp),
        coalesce(languages.zh, languages.jp, languages.en)
      ),
      "businessHours": select(
        $lang == "jp" => coalesce(businessHours.jp, businessHours.zh, businessHours.en),
        $lang == "en" => coalesce(businessHours.en, businessHours.zh, businessHours.jp),
        coalesce(businessHours.zh, businessHours.jp, businessHours.en)
      ),
      "serviceAreas": select(
        $lang == "jp" => coalesce(serviceAreas.jp, serviceAreas.zh, serviceAreas.en),
        $lang == "en" => coalesce(serviceAreas.en, serviceAreas.zh, serviceAreas.jp),
        coalesce(serviceAreas.zh, serviceAreas.jp, serviceAreas.en)
      )
    },
    "faqTopics": select(
      $lang == "jp" => coalesce(commonTopics.jp, commonTopics.zh, commonTopics.en),
      $lang == "en" => coalesce(commonTopics.en, commonTopics.zh, commonTopics.jp),
      coalesce(commonTopics.zh, commonTopics.jp, commonTopics.en)
    ),
    "form": {
      "subjectOptions": select(
        $lang == "jp" => coalesce(subjectOptions.jp, subjectOptions.zh, subjectOptions.en),
        $lang == "en" => coalesce(subjectOptions.en, subjectOptions.zh, subjectOptions.jp),
        coalesce(subjectOptions.zh, subjectOptions.jp, subjectOptions.en)
      ),
      "preferredContactOptions": select(
        $lang == "jp" => coalesce(preferredContactOptions.jp, preferredContactOptions.zh, preferredContactOptions.en),
        $lang == "en" => coalesce(preferredContactOptions.en, preferredContactOptions.zh, preferredContactOptions.jp),
        coalesce(preferredContactOptions.zh, preferredContactOptions.jp, preferredContactOptions.en)
      ),
      "summaryHint": select(
        $lang == "jp" => coalesce(summaryHint.jp, summaryHint.zh, summaryHint.en),
        $lang == "en" => coalesce(summaryHint.en, summaryHint.zh, summaryHint.jp),
        coalesce(summaryHint.zh, summaryHint.jp, summaryHint.en)
      ),
      "datetimeHint": select(
        $lang == "jp" => coalesce(datetimeHint.jp, datetimeHint.zh, datetimeHint.en),
        $lang == "en" => coalesce(datetimeHint.en, datetimeHint.zh, datetimeHint.jp),
        coalesce(datetimeHint.zh, datetimeHint.jp, datetimeHint.en)
      ),
      "attachmentHint": select(
        $lang == "jp" => coalesce(attachmentHint.jp, attachmentHint.zh, attachmentHint.en),
        $lang == "en" => coalesce(attachmentHint.en, attachmentHint.zh, attachmentHint.jp),
        coalesce(attachmentHint.zh, attachmentHint.jp, attachmentHint.en)
      ),
      "consentText": select(
        $lang == "jp" => coalesce(consentText.jp, consentText.zh, consentText.en),
        $lang == "en" => coalesce(consentText.en, consentText.zh, consentText.jp),
        coalesce(consentText.zh, consentText.jp, consentText.en)
      )
    },
    "success": {
      "message": select(
        $lang == "jp" => coalesce(submitSuccessMessage.jp, submitSuccessMessage.zh, submitSuccessMessage.en),
        $lang == "en" => coalesce(submitSuccessMessage.en, submitSuccessMessage.zh, submitSuccessMessage.jp),
        coalesce(submitSuccessMessage.zh, submitSuccessMessage.jp, submitSuccessMessage.en)
      ),
      "email": {
        "subject": select(
          $lang == "jp" => coalesce(autoReplySubject.jp, autoReplySubject.zh, autoReplySubject.en),
          $lang == "en" => coalesce(autoReplySubject.en, autoReplySubject.zh, autoReplySubject.jp),
          coalesce(autoReplySubject.zh, autoReplySubject.jp, autoReplySubject.en)
        ),
        "body": select(
          $lang == "jp" => coalesce(autoReplyBody.jp, autoReplyBody.zh, autoReplyBody.en),
          $lang == "en" => coalesce(autoReplyBody.en, autoReplyBody.zh, autoReplyBody.jp),
          coalesce(autoReplyBody.zh, autoReplyBody.jp, autoReplyBody.en)
        )
      }
    },
    "addresses": addresses[] {
      "label": select(
        $lang == "jp" => coalesce(label.jp, label.zh, label.en),
        $lang == "en" => coalesce(label.en, label.zh, label.jp),
        coalesce(label.zh, label.jp, label.en)
      ),
      "address": select(
        $lang == "jp" => coalesce(address.jp, address.zh, address.en),
        $lang == "en" => coalesce(address.en, address.zh, address.jp),
        coalesce(address.zh, address.jp, address.en)
      ),
      "note": select(
        $lang == "jp" => coalesce(note.jp, note.zh, note.en),
        $lang == "en" => coalesce(note.en, note.zh, note.jp),
        coalesce(note.zh, note.jp, note.en)
      )
    }
  }
}
`
