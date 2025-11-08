import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QuickConsult from "@/components/QuickConsult"; // ← 用包裝元件，不直接用 Suspense

// === Google Fonts ===
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// === Metadata ===
export const metadata: Metadata = {
  title: "TW Connect | Cross-border Advisory",
  description: "Take your first step into Taiwan, Japan, and the US with confidence.",
  icons: { icon: "/favicon.ico" },
};

// === Root Layout ===
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-background
          text-foreground
          antialiased
          relative
          overflow-x-hidden
        `}
      >
        {children}

        {/* 由 Client 包裝元件在用戶端負責 Suspense 與 useSearchParams 安全性 */}
        <QuickConsult
          targetId="contact"
          anchorSelector='[data-lang-switcher="true"]'
          followAnchor={false}
          position="top-right"
          topAdjustRem={-0.325}
          matchAnchorWidth={true}
        />
      </body>
    </html>
  );
}
