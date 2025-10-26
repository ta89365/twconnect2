// apps/web/src/lib/types/contact.ts
export type Lang = "jp" | "zh" | "en";

export type ContactData = {
  heading?: string | null;
  body?: string | null;
  lineId?: string | null;     // e.g. "@030qreji"
  email?: string | null;      // e.g. "info@twconnects.com"
  qrUrl?: string | null;      // optional
};
