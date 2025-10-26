// apps/web/src/lib/i18n.ts
export type Lang = "jp" | "zh" | "en";

/** 直接從字串解析語言參數。無或無效時預設 jp。 */
export function resolveLang(sp?: string): Lang {
  const l = (sp ?? "").toLowerCase();
  return l === "jp" || l === "zh" || l === "en" ? (l as Lang) : "jp";
}

/** 若頁面用 Next 的 searchParams 物件，可用這個幫手統一處理 array 或 promise。 */
export function normalizeLangParam(
  sp?:
    | { lang?: string | string[] }
    | Promise<{ lang?: string | string[] }>
    | null
): Promise<Lang> | Lang {
  // 如果傳進來是 Promise，就交給呼叫端 await；這裡只做同步判斷
  // 呼叫端常見用法：
  // const spRaw = typeof (searchParams as any)?.then === "function" ? await searchParams : searchParams;
  // const lang  = normalizeLangParam(spRaw) as Lang;
  if (!sp || typeof (sp as any).then === "function") return "jp";
  let v = (sp as { lang?: string | string[] })?.lang;
  if (Array.isArray(v)) v = v[0];
  return resolveLang(v);
}
