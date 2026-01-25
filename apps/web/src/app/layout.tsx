// File: apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";
import LanguageSwitcher from "@/components/language-switcher";

// Client components
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

const defaultCssVars = {
  ["--default-page-bg" as any]: "#ffffff",
  ["--default-page-fg" as any]: "#0b1324",
  ["--default-background" as any]: "#ffffff",
  ["--default-foreground" as any]: "#0b1324",
} as React.CSSProperties;

const GOOGLE_ADS_ID = "AW-17886973732";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* 1) 最早期先建立 dataLayer + gtag stub，並把預設同意設為 denied */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;

            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied'
            });
          `}
        </Script>

        {/* 2) 載入 gtag.js（可以先載入，因為已經被 consent default 鎖住） */}
        <Script
          async
          src={"https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_ADS_ID}
          strategy="afterInteractive"
        />

        {/* 3) 初始化 gtag，不在這裡做 config，避免同意機制被繞過 */}
        <Script id="gtag-base" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
          `}
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
        <React.Suspense fallback={null}>
          <ConsentProvider>
            <React.Suspense fallback={null}>
              <LanguageSwitcher behavior="fixed" offsetY={0.3} offsetRight={0.75} />
            </React.Suspense>

            {children}

            <React.Suspense fallback={null}>
              <CookieBanner />
            </React.Suspense>

            <React.Suspense fallback={null}>
              <QuickConsult
                targetId="contact"
                position="bottom-right"
                offsetY={1}
                offsetRight={0.9}
                followAnchor={false}
                matchAnchorWidth={false}
              />
            </React.Suspense>
          </ConsentProvider>
        </React.Suspense>
      </body>
    </html>
  );
}
