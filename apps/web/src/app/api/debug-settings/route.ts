import { NextResponse } from "next/server";
import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

export const revalidate = 0;

export async function GET() {
  const data = await sfetch<any>(siteSettingsByLang, { lang: "jp" });
  return NextResponse.json(data ?? {});
}
