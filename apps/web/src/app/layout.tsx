// File: apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";

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
      <body
        suppressHydrationWarning
        style={defaultCssVars}
        className={`
          min-h-screen relative overflow-x-hidden antialiased
          bg-[var(--page-bg,var(--default-page-bg,#ffffff))]
          text-[var(--page-fg,var(--default-foreground,#0b1324))]
        `}
      >
        {children}

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
      </body>
    </html>
  );
}
