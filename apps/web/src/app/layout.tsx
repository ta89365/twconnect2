// File: apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";

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
            {children}

            <React.Suspense fallback={null}>
              <CookieBanner />
            </React.Suspense>

            <React.Suspense fallback={null}>
              {/* 右下角固定 */}
              <QuickConsult
                targetId="contact"
                position="bottom-right"
                offsetY={1}        // 距底 1rem
                offsetRight={0.9}  // 距右 0.9rem
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
