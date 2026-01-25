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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17886973732"
          strategy="afterInteractive"
        />

        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17886973732');
          `}
        </Script>

        {/* Keep existing init-datalayer (harmless redundancy, but consistent with your current setup) */}
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
        <React.Suspense fallback={null}>
          <ConsentProvider>
            {/* ✅ 全站共用語言切換（右上、導航列下方，捲動後自動消失） */}
            <React.Suspense fallback={null}>
              <LanguageSwitcher behavior="fixed" offsetY={0.3} offsetRight={0.75} />
            </React.Suspense>

            {children}

            <React.Suspense fallback={null}>
              <CookieBanner />
            </React.Suspense>

            {/* ✅ 右下角固定：快捷諮詢（回到頂端你可以一樣放這裡） */}
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
