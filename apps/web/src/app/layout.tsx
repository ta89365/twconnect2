// File: apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";

// 新增：Consent Provider 與 Banner（Client 組件）
// 這兩個檔案依照我先前提供的路徑：
// apps/web/src/components/ConsentProvider.tsx
// apps/web/src/components/CookieBanner.tsx
import ConsentProvider from "@/components/ConsentProvider";
import CookieBanner from "@/components/CookieBanner";

// 可選：初始化 dataLayer，未裝 GTM 也不會出錯
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TW Connect | Cross-border Advisory",
  description: "Take your first step into Taiwan, Japan, and the US with confidence.",
  icons: { icon: "/favicon.ico" },
};

// 用「預設」變數名稱，讓各 page 以 --page-bg 覆寫
const defaultCssVars = {
  ["--default-page-bg" as any]: "#ffffff",
  ["--default-page-fg" as any]: "#0b1324",
  ["--default-background" as any]: "#ffffff",
  ["--default-foreground" as any]: "#0b1324",
} as React.CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* 初始化 dataLayer，避免首屏事件遺失。之後接 GTM 會用到 */}
        <Script id="init-datalayer" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        style={defaultCssVars}
        className={`
          min-h-screen relative overflow-x-hidden antialiased
          bg-[var(--page-bg,var(--default-page-bg,#ffffff))]
          text-[var(--page-fg,var(--default-foreground,#0b1324))]
        `}
      >
        <ConsentProvider>
          {children}

          {/* Cookie 同意橫條，語言將自動讀取 ?lang= */}
          <CookieBanner />

          {/* 既有的諮詢快捷列保持不變 */}
          <React.Suspense fallback={null}>
            <QuickConsult
              targetId="contact"
              anchorSelector='[data-lang-switcher="true"]'
              followAnchor={false}
              position="top-right"
              topAdjustRem={-0.325}
              matchAnchorWidth={true}
            />
          </React.Suspense>
        </ConsentProvider>
      </body>
    </html>
  );
}
