export default {
  name: "contactSection",
  title: "Contact Section",
  type: "document",
  fields: [
    { name: "headingZh", type: "string", title: "標題（中文）" },
    { name: "headingJp", type: "string", title: "見出し（日文）" },
    { name: "headingEn", type: "string", title: "Heading（英文）" },
    { name: "bodyZh", type: "text", title: "內文（中文）" },
    { name: "bodyJp", type: "text", title: "本文（日文）" },
    { name: "bodyEn", type: "text", title: "Body（英文）" },
    {
      name: "lineId",
      type: "string",
      title: "LINE ID",
      initialValue: "@030qreji",
    },
    { name: "email", type: "string", title: "Email", initialValue: "info@twconnects.com" },
    {
      name: "qrImage",
      type: "image",
      title: "LINE QR 圖片",
      options: { hotspot: true },
    },
  ],
};
