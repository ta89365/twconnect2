// File: apps/web/src/components/ContactForm.tsx
"use client";

import React, { useState } from "react";

export default function ContactForm({
  lang = "zh",
}: {
  lang?: "jp" | "zh" | "en" | "zh-cn";
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErr("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("lang", lang);
    // 預留：若未來想由首頁送出後回到首頁，加上 returnTo，API 目前忽略也不影響
    fd.set("returnTo", typeof window !== "undefined" ? window.location.pathname : "/");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd, // multipart，支援附件
        // 告知伺服器若要回 JSON 我們可以解析，但就算回 303 也能處理
        headers: { Accept: "application/json" },
      });

      // 1) 若 API 採用 303 redirect（目前就是這樣），直接視為成功
      if (res.type === "opaqueredirect" || res.redirected || res.status === 303) {
        setStatus("ok");
        form.reset();
        return;
      }

      // 2) 嘗試解析 JSON（若 API 回 JSON）
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "SEND_FAILED");
        setStatus("ok");
        form.reset();
        return;
      }

      // 3) 其他 2xx 視為成功
      if (res.ok) {
        setStatus("ok");
        form.reset();
        return;
      }

      // 4) 非 2xx 當作錯誤
      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      setStatus("err");
      setErr(e?.message ?? "SEND_FAILED");
    }
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" className="mt-1 w-full rounded border px-3 py-2" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" name="email" className="mt-1 w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input name="phone" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Subject</label>
        <input name="subject" className="mt-1 w-full rounded border px-3 py-2" required />
      </div>

      <div>
        <label className="block text-sm font-medium">Summary</label>
        <textarea name="summary" className="mt-1 w-full rounded border px-3 py-2" rows={6} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Preferred Contact</label>
        <input name="preferredContact" className="mt-1 w-full rounded border px-3 py-2" placeholder="Email / Phone / LINE" />
        </div>
        <div>
          <label className="block text-sm font-medium">Preferred Time</label>
          <input type="datetime-local" name="datetime" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Attachments</label>
        <input type="file" name="attachments" multiple className="mt-1 w-full" />
      </div>

      <div className="flex items-center gap-2">
        <input id="consent" type="checkbox" name="consent" value="yes" required />
        <label htmlFor="consent" className="text-sm">I agree to the privacy policy</label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded bg-[#1C3D5A] px-4 py-2 text-white"
      >
        {status === "loading" ? "Sending..." : "Send"}
      </button>

      {status === "ok" && <p className="text-green-600">Submitted! Please check your mailbox.</p>}
      {status === "err" && <p className="text-red-600">Failed: {err}</p>}
    </form>
  );
}
