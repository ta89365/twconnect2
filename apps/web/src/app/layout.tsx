// File: apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";

// Client components（可能使用 next/navigation hooks）
import ConsentProvider from "@/components/ConsentProvider";
import CookieBanner from "@/components/CookieBanner";

import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TW Connect | Cross-border Advisory",
  description: "Take your first step into Taiwan, Japan, and the US with confidence.",
  icons: { icon: "/favicon.ico" },
};

// 預設 CSS 變數
const defaultCssVars = {
  ["--default-page-bg" as any]: "#ffffff",
  ["--default-page-fg" as any]: "#0b1324",
  ["--default-background" as any]: "#ffffff",
  ["--default-foreground" as any]: "#0b1324",
} as React.CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
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
        {/* 任何可能使用 next/navigation hooks 的 client 區塊都放進 Suspense */}
        <React.Suspense fallback={null}>
          <ConsentProvider>
            {children}

            <React.Suspense fallback={null}>
              {/* Cookie 同意橫幅（讀取 ?lang= 等） */}
              <CookieBanner />
            </React.Suspense>

            <React.Suspense fallback={null}>
              {/* 諮詢快捷列 */}
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
        </React.Suspense>
      </body>
    </html>
  );
}
