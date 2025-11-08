// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import * as React from "react"; // ⬅️ 用命名空間匯入，避免 TS2786
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult";

// === Google Fonts ===
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// === Metadata ===
export const metadata: Metadata = {
  title: "TW Connect | Cross-border Advisory",
  description: "Take your first step into Taiwan, Japan, and the US with confidence.",
  icons: { icon: "/favicon.ico" },
};

// === Root Layout ===
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable} ${geistMono.variable}
          bg-background text-foreground antialiased
          relative overflow-x-hidden
        `}
      >
        {children}

        {/* 用 Suspense 包住任何會用到 useSearchParams/usePathname 的 Client Component */}
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
